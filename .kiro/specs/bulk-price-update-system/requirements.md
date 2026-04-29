# Requirements Document

## Introduction

The Bulk Price Update System enables automated price updates for an e-commerce product catalog containing 218 products across 16 mobile phone brands. The system addresses the current manual process that requires script creation for each price update and achieves only 82% match rate, leaving 40 products unmatched. The system will parse price lists containing 400+ products, intelligently match them to existing catalog products, provide preview and validation capabilities, maintain audit trails, and enable manual resolution of unmatched products.

## Glossary

- **Price_List**: A user-provided input containing product names and prices in the format "PRODUCT NAME [CATEGORY]: ₹PRICE"
- **Catalog_Product**: A product record stored in the Firebase Firestore products collection with fields including id, name, brand, price, category
- **Match_Candidate**: A Catalog_Product that has been algorithmically paired with a Price_List entry based on similarity scoring
- **Confidence_Score**: A numerical value (0-100) representing the likelihood that a Match_Candidate correctly corresponds to a Price_List entry
- **Price_Update_Session**: A complete workflow instance from price list upload through preview, approval, and application of updates
- **Audit_Record**: A historical record of a price change including old price, new price, timestamp, user, and product identifier
- **Matching_Engine**: The algorithmic component that compares Price_List entries to Catalog_Products and generates Match_Candidates with Confidence_Scores
- **Admin_User**: An authenticated user with permissions to perform bulk price updates
- **Unmatched_Entry**: A Price_List entry that the Matching_Engine could not pair with any Catalog_Product above the minimum confidence threshold
- **Manual_Mapping**: The process by which an Admin_User explicitly associates an Unmatched_Entry with a specific Catalog_Product
- **Price_Change_Preview**: A display of proposed price updates showing old price, new price, and affected product before application
- **Rollback_Operation**: The process of reverting price changes to their previous values using Audit_Records

## Requirements

### Requirement 1: Price List Input and Parsing

**User Story:** As an Admin_User, I want to upload price lists in multiple formats, so that I can update prices without manual data transformation.

#### Acceptance Criteria

1. WHEN an Admin_User provides a Price_List in plain text format, THE System SHALL parse each line matching the pattern "PRODUCT NAME [CATEGORY]: ₹PRICE"
2. WHEN an Admin_User provides a Price_List in CSV format, THE System SHALL parse rows containing product name and price columns
3. WHEN an Admin_User provides a Price_List in Excel format, THE System SHALL parse rows containing product name and price columns
4. WHEN the System encounters a parsing error, THE System SHALL report the line number and error description to the Admin_User
5. THE System SHALL extract product name, category, and price from each successfully parsed Price_List entry
6. WHEN parsing completes, THE System SHALL display the count of successfully parsed entries and any parsing errors

### Requirement 2: Product Matching Algorithm

**User Story:** As an Admin_User, I want the system to automatically match price list entries to catalog products with confidence scores, so that I can quickly identify correct matches and focus on uncertain ones.

#### Acceptance Criteria

1. WHEN the Matching_Engine receives a parsed Price_List entry, THE Matching_Engine SHALL compare it against all Catalog_Products using multiple similarity metrics
2. THE Matching_Engine SHALL calculate a Confidence_Score for each potential Match_Candidate based on name similarity, brand matching, and category matching
3. THE Matching_Engine SHALL use fuzzy string matching algorithms to handle variations in product name formatting
4. THE Matching_Engine SHALL assign higher Confidence_Scores to Match_Candidates where brand names match exactly
5. THE Matching_Engine SHALL assign higher Confidence_Scores to Match_Candidates where category values match exactly
6. WHEN multiple Match_Candidates exist for a Price_List entry, THE Matching_Engine SHALL select the Match_Candidate with the highest Confidence_Score
7. WHEN the highest Confidence_Score is below 60, THE Matching_Engine SHALL classify the Price_List entry as an Unmatched_Entry
8. THE Matching_Engine SHALL complete matching for 400 Price_List entries within 10 seconds

### Requirement 3: Match Preview and Review Interface

**User Story:** As an Admin_User, I want to review all proposed price changes before applying them, so that I can verify correctness and prevent pricing errors.

#### Acceptance Criteria

1. WHEN matching completes, THE System SHALL display a Price_Change_Preview for all matched entries
2. THE Price_Change_Preview SHALL display the Catalog_Product name, current price, proposed new price, and price difference for each match
3. THE Price_Change_Preview SHALL display the Confidence_Score for each match
4. THE Price_Change_Preview SHALL group matches into high confidence (80-100), medium confidence (60-79), and unmatched (below 60) categories
5. THE System SHALL allow the Admin_User to approve or reject individual matches within the Price_Change_Preview
6. THE System SHALL allow the Admin_User to approve all high confidence matches with a single action
7. WHEN the Admin_User rejects a match, THE System SHALL move that Price_List entry to the Unmatched_Entry list

### Requirement 4: Manual Mapping for Unmatched Products

**User Story:** As an Admin_User, I want to manually map unmatched price list entries to catalog products, so that I can achieve 100% price update coverage.

#### Acceptance Criteria

1. THE System SHALL display all Unmatched_Entry items in a dedicated interface section
2. FOR each Unmatched_Entry, THE System SHALL display the original Price_List text and extracted product name and price
3. THE System SHALL provide a search interface to find Catalog_Products by name, brand, or category
4. WHEN an Admin_User selects a Catalog_Product for an Unmatched_Entry, THE System SHALL create a Manual_Mapping
5. THE System SHALL add Manual_Mapping entries to the Price_Change_Preview with a confidence score of 100 and a manual mapping indicator
6. THE System SHALL persist Manual_Mapping associations for future Price_Update_Sessions
7. WHEN a future Price_List contains an entry that matches a previous Manual_Mapping, THE System SHALL automatically apply that mapping with 100 confidence score

### Requirement 5: Price Update Application

**User Story:** As an Admin_User, I want to apply approved price changes to the live catalog, so that the website displays current prices.

#### Acceptance Criteria

1. WHEN an Admin_User initiates price update application, THE System SHALL update only the approved matches in the Price_Change_Preview
2. THE System SHALL use Firebase Firestore batch operations to update multiple Catalog_Product prices atomically
3. WHEN a batch contains more than 500 updates, THE System SHALL split the updates into multiple batches of 500 or fewer
4. THE System SHALL update the price field of each Catalog_Product with the new price value
5. THE System SHALL update the updatedAt timestamp field of each Catalog_Product
6. WHEN all updates complete successfully, THE System SHALL display a success message with the count of updated products
7. IF any update fails, THE System SHALL report the failure to the Admin_User with the product identifier and error message

### Requirement 6: Audit Trail and History

**User Story:** As an Admin_User, I want to see a history of all price changes, so that I can track pricing decisions and identify errors.

#### Acceptance Criteria

1. WHEN the System updates a Catalog_Product price, THE System SHALL create an Audit_Record
2. THE Audit_Record SHALL contain the product identifier, product name, old price, new price, timestamp, and Admin_User identifier
3. THE System SHALL store Audit_Records in a dedicated Firebase Firestore collection
4. THE System SHALL provide an interface to view Audit_Records filtered by date range, product, or Admin_User
5. THE System SHALL display Audit_Records in reverse chronological order with the most recent changes first
6. FOR each Audit_Record, THE System SHALL display the product name, old price, new price, price difference, percentage change, timestamp, and Admin_User

### Requirement 7: Rollback Capability

**User Story:** As an Admin_User, I want to rollback incorrect price updates, so that I can quickly correct pricing errors.

#### Acceptance Criteria

1. THE System SHALL allow an Admin_User to select a Price_Update_Session from the audit history
2. WHEN an Admin_User initiates a Rollback_Operation for a Price_Update_Session, THE System SHALL display all price changes from that session
3. THE System SHALL allow the Admin_User to select which price changes to rollback
4. WHEN the Admin_User confirms a Rollback_Operation, THE System SHALL revert the selected Catalog_Product prices to their old price values from the Audit_Records
5. THE System SHALL create new Audit_Records documenting the Rollback_Operation
6. THE System SHALL complete the Rollback_Operation using Firebase Firestore batch operations
7. WHEN the Rollback_Operation completes, THE System SHALL display a success message with the count of reverted products

### Requirement 8: Security and Authentication

**User Story:** As a system administrator, I want bulk price updates to be performed securely without opening Firebase security rules, so that the catalog remains protected from unauthorized changes.

#### Acceptance Criteria

1. THE System SHALL require Admin_User authentication before allowing access to the bulk price update interface
2. THE System SHALL verify that the authenticated user has admin role permissions
3. THE System SHALL perform all Firestore operations using the authenticated Admin_User's credentials
4. THE System SHALL not require temporary modification of Firebase security rules to perform updates
5. WHEN an unauthenticated user attempts to access the bulk price update interface, THE System SHALL redirect to the login page
6. WHEN an authenticated non-admin user attempts to access the bulk price update interface, THE System SHALL display an access denied message

### Requirement 9: Validation and Error Handling

**User Story:** As an Admin_User, I want the system to validate price data and handle errors gracefully, so that I can identify and correct issues before applying updates.

#### Acceptance Criteria

1. WHEN the System parses a price value, THE System SHALL validate that the price is a positive number
2. WHEN the System encounters a negative or zero price, THE System SHALL flag that entry as invalid and exclude it from matching
3. WHEN the System encounters a price greater than 1000000, THE System SHALL flag that entry for Admin_User review
4. THE System SHALL validate that each Catalog_Product identifier exists before attempting to update it
5. WHEN a Firestore operation fails, THE System SHALL log the error details and continue processing remaining updates
6. THE System SHALL display a summary of validation errors and failed updates after each operation
7. WHEN network connectivity is lost during an update operation, THE System SHALL display an error message and allow the Admin_User to retry

### Requirement 10: Bulk Product Creation for New Products

**User Story:** As an Admin_User, I want the system to automatically create new products from my price list that don't exist in the catalog, so that I can add all products from my supplier list without manual entry.

#### Acceptance Criteria

1. WHEN the System processes a Price_List, THE System SHALL identify entries that do not match any existing Catalog_Product
2. THE System SHALL classify non-matching entries as New_Product_Candidates
3. FOR each New_Product_Candidate, THE System SHALL extract product name, price, and category from the Price_List entry
4. THE System SHALL automatically detect the brand from the product name using known brand patterns (OPPO, Samsung, Vivo, Realme, Xiaomi, Poco, Motorola, Nokia, ITEL, LAVA, Infinix, IQOO, Tecno, Nothing, OnePlus, Philips)
5. THE System SHALL display all New_Product_Candidates in a dedicated "New Products" section of the Price_Change_Preview
6. THE Price_Change_Preview SHALL display for each New_Product_Candidate: product name, detected brand, category, and price from the Price_List
7. THE System SHALL allow the Admin_User to review and approve individual New_Product_Candidates
8. THE System SHALL allow the Admin_User to approve all New_Product_Candidates with a single action
9. WHEN an Admin_User approves New_Product_Candidates, THE System SHALL create new Catalog_Product records in Firebase Firestore
10. THE System SHALL create new products with fields: name, brand, category, price, createdAt, updatedAt
11. THE System SHALL use Firebase Firestore batch operations to create multiple products atomically
12. WHEN a batch contains more than 500 new products, THE System SHALL split the creation into multiple batches of 500 or fewer
13. WHEN all new products are created successfully, THE System SHALL display a success message with the count of created products
14. IF any product creation fails, THE System SHALL report the failure to the Admin_User with the product name and error message

### Requirement 11: Performance and Scalability

**User Story:** As an Admin_User, I want the system to handle large price lists efficiently, so that I can complete updates quickly.

#### Acceptance Criteria

1. THE System SHALL parse and match a Price_List containing 400 entries within 15 seconds
2. THE System SHALL apply 218 approved price updates within 5 seconds
3. THE System SHALL create up to 200 new products within 10 seconds
4. THE System SHALL load the Price_Change_Preview interface within 2 seconds after matching completes
5. THE System SHALL support Price_Lists containing up to 1000 entries
6. THE System SHALL display progress indicators during parsing, matching, and update operations
7. WHEN processing operations longer than 2 seconds, THE System SHALL display a progress percentage or spinner
