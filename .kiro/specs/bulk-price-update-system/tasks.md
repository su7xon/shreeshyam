# Implementation Plan: Bulk Price Update System

## Overview

Implement a web-based bulk price update interface integrated into the existing Next.js 14 admin panel. The system parses price lists (text, CSV, Excel), fuzzy-matches entries to Firestore products using fuse.js, provides a 3-tab preview interface, supports bulk product creation, maintains a full audit trail, and enables session-level rollback. All state is managed via a dedicated Zustand store; all Firestore operations use the authenticated admin user's credentials.

## Tasks

- [x] 1. Install dependencies and define shared types
  - Run `npm install fuse.js@^7.0.0 xlsx@^0.18.5 papaparse@^5.4.1 react-window@^1.8.10 date-fns@^3.0.0`
  - Run `npm install -D @types/papaparse@^5.3.14 @types/react-window@^1.8.8`
  - Create `lib/bulk-update/types.ts` with all shared interfaces: `ParsedEntry`, `ParseError`, `ParseResult`, `CSVParseOptions`, `MatchResult`, `NewProductCandidate`, `UnmatchedEntry`, `MatchingResult`, `ManualMapping`, `AuditRecord`, `AuditFilters`, `PriceChange`, `PriceUpdateSession`, `SessionResults`, `BulkUpdateResult`, `BulkCreateResult`, `ValidationResult`, `AppError`, and the `ErrorCode` enum
  - _Requirements: 1.5, 2.2, 6.2, 9.1_

- [-] 2. Implement PriceListParserService
  - [ ] 2.1 Create `lib/bulk-update/PriceListParserService.ts`
    - Implement `parseTextFormat(content: string): ParseResult` — parse lines matching `"PRODUCT NAME [CATEGORY]: ₹PRICE"` pattern; record line number and error for malformed lines
    - Implement `parseCSVFormat(content: string, options?: CSVParseOptions): ParseResult` using papaparse
    - Implement `parseExcelFormat(buffer: ArrayBuffer): ParseResult` using xlsx
    - Implement `parse(file: File): Promise<ParseResult>` — auto-detect format by file extension and delegate
    - Implement `validateEntry(entry: ParsedEntry): ValidationResult` — reject zero/negative prices, flag prices > 1,000,000
    - Implement `sanitizeProductName(name: string): string` — trim, remove dangerous chars, normalize whitespace, cap at 200 chars
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3_

  - [ ]* 2.2 Write property test for text parsing round-trip
    - **Property 1: Text Parsing Round-Trip** — for any valid name/category/price, format then parse must recover original values
    - **Validates: Requirements 1.1, 1.5**

  - [ ]* 2.3 Write property test for CSV parsing round-trip
    - **Property 2: CSV Parsing Round-Trip** — serialise to CSV then parse must preserve all product names and prices
    - **Validates: Requirements 1.2, 1.5**

  - [ ]* 2.4 Write property test for Excel parsing round-trip
    - **Property 3: Excel Parsing Round-Trip** — serialise to Excel then parse must preserve all product names and prices
    - **Validates: Requirements 1.3, 1.5**

  - [ ]* 2.5 Write property test for parsing error location
    - **Property 4: Parsing Error Location** — for any malformed input line, the error report must include the correct line number and a non-empty error message
    - **Validates: Requirements 1.4**

  - [ ]* 2.6 Write property test for price validation
    - **Property 26: Price Validation** — validation must accept positive numbers and reject zero or negative values
    - **Property 27: High Price Flagging** — any price > 1,000,000 must be flagged for admin review
    - **Validates: Requirements 9.1, 9.2, 9.3**

- [-] 3. Implement MatchingEngineService
  - [ ] 3.1 Create `lib/bulk-update/MatchingEngineService.ts`
    - Implement `BRAND_PATTERNS` map with all 16 brand regex patterns (Samsung, OPPO, Vivo, Realme, Xiaomi, Poco, Motorola, Nokia, ITEL, LAVA, Infinix, iQOO, Tecno, Nothing, OnePlus, Philips)
    - Implement `detectBrand(productName: string): string | null`
    - Implement `normalizeString(str: string): string` — lowercase, strip special chars, collapse whitespace
    - Implement `calculateConfidence(entry: ParsedEntry, product: AdminProduct): number` — name similarity (0–60 pts) + brand match (0–25 pts) + category match (0–15 pts), capped at 100
    - Implement `initialize(products: AdminProduct[], mappings: ManualMapping[]): void` — build fuse.js index with keys `name` (weight 0.7), `brand` (0.2), `category` (0.1); threshold 0.4
    - Implement `checkManualMapping(entry: ParsedEntry): AdminProduct | null`
    - Implement `matchEntry(entry: ParsedEntry): MatchResult | UnmatchedEntry | NewProductCandidate`
    - Implement `matchAll(entries: ParsedEntry[], onProgress: (pct: number) => void): Promise<MatchingResult>` — batch 50 entries, yield to main thread between batches
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.4_

  - [ ]* 3.2 Write property test for matching produces scored results
    - **Property 5: Matching Produces Scored Results** — for any parsed entry and non-empty catalog, at least one candidate with score 0–100 must be produced
    - **Validates: Requirements 2.1, 2.2**

  - [ ]* 3.3 Write property test for fuzzy matching tolerance
    - **Property 6: Fuzzy Matching Tolerance** — any catalog product name with up to 2 character edits must still appear as a candidate with score ≥ 50
    - **Validates: Requirements 2.3**

  - [ ]* 3.4 Write property test for brand match score boost
    - **Property 7: Brand Match Score Boost** — a candidate with exact brand match must score higher than an otherwise identical candidate without brand match
    - **Validates: Requirements 2.4**

  - [ ]* 3.5 Write property test for category match score boost
    - **Property 8: Category Match Score Boost** — a candidate with exact category match must score higher than an otherwise identical candidate without category match
    - **Validates: Requirements 2.5**

  - [ ]* 3.6 Write property test for highest score selection
    - **Property 9: Highest Score Selection** — when multiple candidates exist, the selected match must be the one with the highest confidence score
    - **Validates: Requirements 2.6**

  - [ ]* 3.7 Write property test for unmatched threshold
    - **Property 10: Unmatched Threshold** — any entry whose highest candidate score is below 60 must be classified as unmatched
    - **Validates: Requirements 2.7**

  - [ ]* 3.8 Write property test for brand detection
    - **Property 29: Brand Detection** — for any product name containing a known brand pattern, `detectBrand` must return the correct brand string
    - **Validates: Requirements 10.4**

- [x] 4. Checkpoint — Ensure all service unit/property tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement AuditService and SessionService
  - [ ] 5.1 Create `lib/bulk-update/AuditService.ts`
    - Implement `createAuditRecord(change: PriceChange, sessionId: string, userId: string, userEmail: string): Promise<AuditRecord>` — write to `audit_records` collection with all required fields including `priceDifference`, `percentageChange`, `isRollback: false`
    - Implement `getAuditRecords(filters?: AuditFilters): Promise<AuditRecord[]>` — query with `orderBy('timestamp', 'desc')`, apply optional date range / productId / userId `where` clauses
    - Implement `getSessionRecords(sessionId: string): Promise<AuditRecord[]>`
    - Implement `createRollbackRecords(originalRecords: AuditRecord[], userId: string, userEmail: string): Promise<AuditRecord[]>` — write new records with `isRollback: true` and `originalRecordId` reference
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 7.5_

  - [ ] 5.2 Create `lib/bulk-update/SessionService.ts`
    - Implement `createSession(data: Omit<PriceUpdateSession, 'id' | 'createdAt'>): Promise<string>` — write to `price_update_sessions`
    - Implement `getSession(sessionId: string): Promise<PriceUpdateSession | null>`
    - Implement `getRecentSessions(limit?: number): Promise<PriceUpdateSession[]>` — ordered by `createdAt DESC`
    - Implement `updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void>`
    - Implement `completeSession(sessionId: string, results: SessionResults): Promise<void>`
    - _Requirements: 6.3, 7.1, 7.2_

  - [ ]* 5.3 Write property test for audit record creation
    - **Property 21: Audit Record Creation** — for any successful price update, the created audit record must contain the correct productId, oldPrice, newPrice, userId, and a timestamp within 1 second of now
    - **Validates: Requirements 6.1, 6.2**

  - [ ]* 5.4 Write property test for audit record filtering
    - **Property 22: Audit Record Filtering** — query results must only contain records matching all specified filter criteria
    - **Validates: Requirements 6.4**

  - [ ]* 5.5 Write property test for audit record ordering
    - **Property 23: Audit Record Ordering** — results must be in reverse chronological order (most recent first)
    - **Validates: Requirements 6.5**

  - [ ]* 5.6 Write property test for rollback audit creation
    - **Property 25: Rollback Audit Creation** — rollback records must have `isRollback: true` and reference the original record IDs
    - **Validates: Requirements 7.5**

- [ ] 6. Implement Firebase bulk operations
  - [ ] 6.1 Create `lib/bulk-update/firebaseOperations.ts`
    - Implement `bulkUpdatePrices(updates: Array<{ productId: string; newPrice: number }>): Promise<BulkUpdateResult>` — split into batches of ≤ 500, update `price` and `updatedAt: serverTimestamp()` on each product doc, execute batches in parallel
    - Implement `bulkCreateProducts(products: Array<Omit<AdminProduct, 'id'>>): Promise<BulkCreateResult>` — split into batches of ≤ 500, set each new doc with `createdAt` and `updatedAt: serverTimestamp()`, return created IDs
    - Implement `saveManualMapping(sourcePattern: string, productId: string, productName: string, userId: string): Promise<string>` — check for existing mapping by normalised pattern; update `lastUsedAt` and increment `useCount` if found, else create new
    - Implement `getManualMappings(): Promise<ManualMapping[]>` — ordered by `useCount DESC`
    - Implement `validateProductExists(productId: string): Promise<boolean>`
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.7, 4.6, 9.4, 10.9, 10.10, 10.11, 10.12_

  - [ ]* 6.2 Write property test for batch splitting
    - **Property 19: Batch Splitting** — for any N updates > 500, the system must produce ceil(N/500) batches each containing ≤ 500 operations
    - **Validates: Requirements 5.3, 10.12**

  - [ ]* 6.3 Write property test for updatedAt timestamp
    - **Property 20: UpdatedAt Timestamp** — after a price update, the product's `updatedAt` must be within 1 second of the current time
    - **Validates: Requirements 5.5**

  - [ ]* 6.4 Write property test for product existence check
    - **Property 28: Product Existence Check** — `validateProductExists` must return `true` for IDs present in the catalog and `false` for IDs that are not
    - **Validates: Requirements 9.4**

  - [ ]* 6.5 Write property test for manual mapping persistence
    - **Property 16: Manual Mapping Persistence** — a mapping saved to Firestore must be retrievable with the same source pattern and product reference
    - **Validates: Requirements 4.6**

- [ ] 7. Create Zustand store for bulk update state
  - Create `lib/bulk-update/useBulkUpdateStore.ts` using Zustand
  - State shape: `step`, `parsedEntries`, `matchResults`, `newProductCandidates`, `unmatchedEntries`, `selectedSession`, `isProcessing`, `progress`, `errors`, `sessionId`
  - Actions: `setParsedEntries`, `setMatchResults`, `approveMatch(matchId)`, `rejectMatch(matchId)` (moves entry to unmatched), `approveAll(section)`, `applyManualMapping(unmatchedId, productId, product)`, `setStep`, `setProgress`, `setIsProcessing`, `reset`
  - `rejectMatch` must move the entry to `unmatchedEntries` (Requirement 3.7)
  - `applyManualMapping` must set `confidenceScore: 100` and `isManualMapping: true` on the resulting `MatchResult` (Requirement 4.5)
  - _Requirements: 3.5, 3.6, 3.7, 4.4, 4.5_

  - [ ]* 7.1 Write property test for match grouping
    - **Property 11: Match Grouping** — for any set of match results, each must be correctly grouped into high (80–100), medium (60–79), or unmatched (< 60) based on its confidence score
    - **Validates: Requirements 3.4**

  - [ ]* 7.2 Write property test for reject moves to unmatched
    - **Property 12: Reject Moves to Unmatched** — after rejecting an approved match, the corresponding entry must appear in the unmatched list and be absent from match results
    - **Validates: Requirements 3.7**

  - [ ]* 7.3 Write property test for manual mapping preview integration
    - **Property 15: Manual Mapping Preview Integration** — after creating a manual mapping, the entry must appear in the preview with `confidenceScore: 100` and `isManualMapping: true`
    - **Validates: Requirements 4.5**

  - [ ]* 7.4 Write property test for manual mapping auto-application
    - **Property 17: Manual Mapping Auto-Application** — when a price list entry matches a saved manual mapping's source pattern, the engine must automatically apply it with `confidenceScore: 100`
    - **Validates: Requirements 4.7**

- [ ] 8. Checkpoint — Ensure all store and Firebase operation tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Build FileUploadComponent
  - Create `components/admin/bulk-update/FileUploadComponent.tsx`
  - Render a drag-and-drop zone accepting `.txt`, `.csv`, `.xlsx`, `.xls`; max file size 10 MB
  - On file selection, call `PriceListParserService.parse(file)` and invoke `onFileParsed(entries, errors)` prop
  - Show a progress spinner during parsing
  - Display count of successfully parsed entries and any parse errors (line number + description) after completion
  - Show appropriate error messages for `FILE_TOO_LARGE` and `UNSUPPORTED_FORMAT` error codes
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.6, 9.6, 11.6, 11.7_

- [ ] 10. Build MatchCard component
  - Create `components/admin/bulk-update/MatchCard.tsx`
  - Display: catalog product name, price list entry name, current price → new price, price difference with colour coding (green for decrease, red for increase), confidence score badge (colour-coded by level), Approve / Reject buttons
  - Accept `match: MatchResult`, `onApprove`, `onReject`, `showActions` props
  - _Requirements: 3.2, 3.3, 3.5_

- [ ] 11. Build ManualMappingDialog
  - Create `components/admin/bulk-update/ManualMappingDialog.tsx`
  - Modal accepting `unmatchedEntry`, `products`, `onMap(productId)`, `onCancel` props
  - Debounced search input (300 ms) filtering products by name, brand, or category using fuse.js
  - Display product list rows with name, brand, category
  - On product selection, call `onMap(productId)` and close dialog
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ]* 11.1 Write property test for product search results
    - **Property 13: Product Search Results** — all returned search results must contain the search term in product name, brand, or category
    - **Validates: Requirements 4.3**

  - [ ]* 11.2 Write property test for manual mapping creation
    - **Property 14: Manual Mapping Creation** — creating a manual mapping must produce a record with the correct entry pattern and product reference
    - **Validates: Requirements 4.4**

- [ ] 12. Build PreviewSection with three tabs
  - Create `components/admin/bulk-update/PreviewSection.tsx`
  - Three tabs: "Existing Products (N)", "New Products (N)", "Unmatched (N)"
  - **Existing Products tab**: group match cards into "High Confidence (80–100)" and "Medium Confidence (60–79)" sub-sections; show "Approve All" button for high-confidence group; render each card using `MatchCard`; use `react-window` `FixedSizeList` (itemSize 120) when list length > 50
  - **New Products tab**: display each `NewProductCandidate` with name, detected brand, category, price; individual approve/reject; "Approve All" button
  - **Unmatched tab**: display each `UnmatchedEntry` with original text, extracted name and price; "Map Manually" button that opens `ManualMappingDialog`
  - Summary bar: "N matched | N new products | N unmatched"
  - Accept all props from `PreviewSectionProps` interface in the design
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 4.1, 4.2, 10.5, 10.6, 10.7, 10.8, 11.4_

- [ ] 13. Build AuditHistoryView and RollbackDialog
  - [ ] 13.1 Create `components/admin/bulk-update/AuditHistoryView.tsx`
    - Fetch audit records via `AuditService.getAuditRecords()` on mount; support load-more pagination
    - Filter controls: date range picker (using date-fns), product name search, user filter
    - Display records in reverse chronological order; each row shows product name, old price, new price, difference, percentage change, timestamp, user email, rollback badge if `isRollback: true`
    - "Rollback Session" button per session group that opens `RollbackDialog`
    - _Requirements: 6.4, 6.5, 6.6, 7.1, 7.2_

  - [ ] 13.2 Create `components/admin/bulk-update/RollbackDialog.tsx`
    - Accept `session: PriceUpdateSession`, `onConfirm(selectedProductIds: string[])`, `onCancel` props
    - List all changes in the session with checkboxes; warn that rollback creates new audit records
    - On confirm, call `bulkUpdatePrices` with old prices, then `AuditService.createRollbackRecords`, then `SessionService.updateSessionStatus(..., 'rolled_back')`
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 13.3 Write property test for rollback price reversion
    - **Property 24: Rollback Price Reversion** — for any audit record, performing a rollback must set the product's price back to the `oldPrice` value from that record
    - **Validates: Requirements 7.4**

  - [ ]* 13.4 Write property test for approved-only updates
    - **Property 18: Approved-Only Updates** — applying updates must only modify products whose match status is `'approved'`; pending and rejected matches must not be touched
    - **Validates: Requirements 5.1**

- [ ] 14. Create /admin/bulk-update page
  - Create `app/admin/bulk-update/page.tsx`
  - Protect with `useAdminAuth` — redirect to `/admin/login` if unauthenticated; show access-denied if non-admin
  - Step indicator: Upload → Review → Apply
  - Step 1 (upload): render `FileUploadComponent`; on `onFileParsed`, run `MatchingEngineService.matchAll` (fetching products and manual mappings first), store results in `useBulkUpdateStore`, advance to step 2
  - Show progress bar during matching with percentage from `onProgress` callback
  - Step 2 (preview): render `PreviewSection` wired to store actions; "Apply Updates" button
  - On "Apply Updates": create session via `SessionService.createSession`, call `bulkUpdatePrices` for approved matches, call `bulkCreateProducts` for approved new products, call `AuditService.createAuditRecord` for each change, call `SessionService.completeSession`, advance to step 3
  - Step 3 (complete): success message with counts of updated products and created products; "View Audit History" and "Start New Session" buttons
  - Render `AuditHistoryView` in a collapsible panel accessible from the header
  - Handle all error codes from `ErrorCode` enum with user-facing messages per the design's error table
  - _Requirements: 3.1, 5.1, 5.2, 5.6, 5.7, 6.1, 8.1, 8.2, 8.5, 8.6, 9.5, 9.6, 9.7, 10.9, 11.1, 11.2, 11.3, 11.6, 11.7_

- [ ] 15. Add navigation link in admin panel
  - In `app/admin/AdminLayoutWrapper.tsx`, add a new nav item to the `navItems` array:
    ```ts
    { href: '/admin/bulk-update', label: 'Bulk Price Update', icon: RefreshCw, group: 'CATALOG' }
    ```
  - Import `RefreshCw` from `lucide-react`
  - Place it after the existing "Import" entry in the CATALOG group
  - _Requirements: 8.1_

- [ ] 16. Update Firestore security rules
  - Edit `firestore.rules` (or create it if absent) to add rules for the three new collections:
    - `audit_records/{recordId}` — `allow read, write: if request.auth != null && request.auth.token.admin == true`
    - `manual_mappings/{mappingId}` — same admin-only rule
    - `price_update_sessions/{sessionId}` — same admin-only rule
  - Ensure the existing `products/{productId}` write rule also requires `request.auth.token.admin == true`
  - _Requirements: 8.3, 8.4_

- [ ] 17. Create Firestore indexes
  - Create or update `firestore.indexes.json` with the six composite indexes from the design:
    - `audit_records`: `timestamp DESC`
    - `audit_records`: `productId ASC, timestamp DESC`
    - `audit_records`: `sessionId ASC`
    - `audit_records`: `userId ASC, timestamp DESC`
    - `manual_mappings`: `sourcePattern ASC`
    - `price_update_sessions`: `createdAt DESC`
  - _Requirements: 6.4, 6.5_

- [ ] 18. Write unit tests for parser and matching engine
  - Create `__tests__/bulk-update/PriceListParserService.test.ts`
    - Test text format parsing with valid entries, malformed lines, missing price symbol, empty lines
    - Test CSV parsing with header row, no-header row, custom delimiter
    - Test Excel parsing with a generated workbook
    - Test `validateEntry` with zero price, negative price, price > 1,000,000, valid price
    - Test `sanitizeProductName` with special characters and excessive whitespace
  - Create `__tests__/bulk-update/MatchingEngineService.test.ts`
    - Test `detectBrand` for all 16 brand patterns and unknown brands
    - Test `calculateConfidence` with exact match, brand-only match, category-only match, no match
    - Test `matchAll` returns correct categorisation (high/medium/unmatched/new) for a sample catalog
    - Test manual mapping lookup takes priority over fuzzy matching
    - Test batch progress callback is called during `matchAll`
  - _Requirements: 2.8, 11.1_

- [ ] 19. Write integration tests
  - Create `__tests__/bulk-update/integration.test.ts`
    - Test full parse → match → preview flow with a 10-entry sample price list and a 5-product mock catalog
    - Test `bulkUpdatePrices` splits correctly at the 500-operation boundary using a mock Firestore batch
    - Test `bulkCreateProducts` returns correct IDs and calls batch.set for each product
    - Test `saveManualMapping` creates a new mapping and increments `useCount` on a second call
    - Test `AuditService.createRollbackRecords` produces records with `isRollback: true` and correct `originalRecordId`
  - _Requirements: 5.2, 5.3, 6.1, 7.5, 10.11_

- [ ] 20. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints at tasks 4, 8, and 20 ensure incremental validation
- Property tests validate universal correctness properties; unit tests validate specific examples and edge cases
- The design document's Correctness Properties section (Properties 1–30) maps directly to the `*`-marked sub-tasks above
- All Firestore operations must use the authenticated admin user's credentials — no temporary rule relaxation
- `react-window` virtualisation is applied only when list length exceeds 50 items to keep the implementation simple for small datasets
