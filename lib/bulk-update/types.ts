/**
 * Shared types for the Bulk Price Update System
 * 
 * This module contains all shared interfaces and types used across
 * the bulk price update functionality.
 * 
 * @see Requirements 1.5, 2.2, 6.2, 9.1
 */

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// Error Types
// ============================================================================

/**
 * Error codes for the bulk price update system
 */
export enum ErrorCode {
  // File parsing errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_FORMAT = 'UNSUPPORTED_FORMAT',
  PARSE_ERROR = 'PARSE_ERROR',
  
  // Validation errors
  INVALID_PRICE = 'INVALID_PRICE',
  EMPTY_FILE = 'EMPTY_FILE',
  NO_VALID_ENTRIES = 'NO_VALID_ENTRIES',
  
  // Matching errors
  NO_PRODUCTS_IN_CATALOG = 'NO_PRODUCTS_IN_CATALOG',
  MATCHING_FAILED = 'MATCHING_FAILED',
  
  // Update errors
  PRODUCT_NOT_FOUND = 'PRODUCT_NOT_FOUND',
  BATCH_UPDATE_FAILED = 'BATCH_UPDATE_FAILED',
  PARTIAL_UPDATE_FAILURE = 'PARTIAL_UPDATE_FAILURE',
  
  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  PERMISSION_DENIED = 'PERMISSION_DENIED'
}

/**
 * Application error with recovery information
 */
export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
  recoverable: boolean;
  action?: string;
}

// ============================================================================
// Parsing Types
// ============================================================================

/**
 * A single parsed entry from the price list
 */
export interface ParsedEntry {
  id: string;
  rawText: string;
  productName: string;
  category: string | null;
  price: number;
  lineNumber: number;
}

/**
 * Error from parsing a price list line
 */
export interface ParseError {
  lineNumber: number;
  rawText: string;
  error: string;
}

/**
 * Result of parsing a price list file
 */
export interface ParseResult {
  entries: ParsedEntry[];
  errors: ParseError[];
  totalLines: number;
  parseTime: number;
}

/**
 * Options for CSV parsing
 */
export interface CSVParseOptions {
  productNameColumn: string | number;
  priceColumn: string | number;
  categoryColumn?: string | number;
  hasHeader: boolean;
  delimiter: string;
}

// ============================================================================
// Matching Types
// ============================================================================

/**
 * Admin product type for matching
 */
export interface AdminProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}

/**
 * Result of matching a price list entry to a catalog product
 */
export interface MatchResult {
  id: string;
  parsedEntry: ParsedEntry;
  matchedProduct: AdminProduct;
  confidenceScore: number;
  confidenceLevel: 'high' | 'medium';
  status: 'pending' | 'approved' | 'rejected';
  isManualMapping: boolean;
}

/**
 * A candidate for creating a new product
 */
export interface NewProductCandidate {
  id: string;
  parsedEntry: ParsedEntry;
  detectedBrand: string | null;
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * An entry that could not be matched to any catalog product
 */
export interface UnmatchedEntry {
  id: string;
  parsedEntry: ParsedEntry;
  suggestedProducts: AdminProduct[]; // Top 5 suggestions
}

/**
 * Complete result of matching all entries
 */
export interface MatchingResult {
  matches: MatchResult[];
  newProducts: NewProductCandidate[];
  unmatched: UnmatchedEntry[];
  matchRate: number;
  processingTime: number;
}

/**
 * A persisted manual mapping from price list pattern to product
 */
export interface ManualMapping {
  id: string;
  sourcePattern: string;
  sourceCategory?: string;
  productId: string;
  productName: string;
  createdBy: string;
  createdAt: Date | Timestamp;
  lastUsedAt: Date | Timestamp;
  useCount: number;
}

// ============================================================================
// Audit Types
// ============================================================================

/**
 * A record of a price change for audit trail
 */
export interface AuditRecord {
  id: string;
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
  priceDifference: number;
  percentageChange: number;
  sessionId: string;
  userId: string;
  userEmail: string;
  timestamp: Date | Timestamp;
  isRollback: boolean;
  originalRecordId?: string;
}

/**
 * Filters for querying audit records
 */
export interface AuditFilters {
  dateRange: { start: Date; end: Date } | null;
  productId: string | null;
  userId: string | null;
}

/**
 * A single price change for audit recording
 */
export interface PriceChange {
  productId: string;
  productName: string;
  oldPrice: number;
  newPrice: number;
}

// ============================================================================
// Session Types
// ============================================================================

/**
 * Status of a price update session
 */
export type SessionStatus = 'pending' | 'in_progress' | 'completed' | 'rolled_back' | 'partial';

/**
 * A price update session tracking a complete workflow
 */
export interface PriceUpdateSession {
  id: string;
  createdAt: Date | Timestamp;
  createdBy: string;
  userEmail: string;
  status: SessionStatus;
  totalEntries: number;
  matchedCount: number;
  newProductCount: number;
  unmatchedCount: number;
  appliedCount: number;
  errorCount: number;
  sourceFileName?: string;
  sourceFileType?: 'text' | 'csv' | 'excel';
  rolledBackAt?: Date | Timestamp;
  rolledBackBy?: string;
  rolledBackCount?: number;
}

/**
 * Results of completing a session
 */
export interface SessionResults {
  matchedCount: number;
  newProductCount: number;
  appliedCount: number;
  errors: string[];
}

// ============================================================================
// Operation Result Types
// ============================================================================

/**
 * Result of bulk price update operation
 */
export interface BulkUpdateResult {
  success: boolean;
  updatedCount: number;
  errors?: Array<{ productId: string; error: string }>;
}

/**
 * Result of bulk product creation operation
 */
export interface BulkCreateResult {
  success: boolean;
  createdCount: number;
  ids: string[];
  errors?: Array<{ productName: string; error: string }>;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Result of validating an entry or operation
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}
