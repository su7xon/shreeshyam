/**
 * PriceListParserService
 * 
 * Parses price lists in multiple formats (text, CSV, Excel) and extracts
 * product entries with validation.
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3
 */

import * as Papa from 'papaparse';
import * as XLSX from 'xlsx';
import {
  ParsedEntry,
  ParseError,
  ParseResult,
  CSVParseOptions,
  ValidationResult,
} from './types';

/**
 * Default CSV parsing options
 */
const DEFAULT_CSV_OPTIONS: CSVParseOptions = {
  productNameColumn: 0,
  priceColumn: 1,
  categoryColumn: 2,
  hasHeader: true,
  delimiter: ',',
};

/**
 * Maximum file size: 10MB
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Maximum product name length
 */
const MAX_PRODUCT_NAME_LENGTH = 200;

/**
 * High price threshold for admin review flag
 */
const HIGH_PRICE_THRESHOLD = 1000000;

/**
 * Generate a unique ID for parsed entries
 */
function generateId(): string {
  return `entry-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * PriceListParserService handles parsing of price lists in multiple formats
 */
export class PriceListParserService {
  /**
   * Parse plain text format: "PRODUCT NAME [CATEGORY]: ₹PRICE"
   * Each line should match the pattern: PRODUCT NAME [CATEGORY]: ₹PRICE
   * Category is optional in the pattern.
   * 
   * @param content - The text content to parse
   * @returns ParseResult with entries and errors
   * @see Requirement 1.1
   */
  parseTextFormat(content: string): ParseResult {
    const startTime = performance.now();
    const entries: ParsedEntry[] = [];
    const errors: ParseError[] = [];
    
    const lines = content.split(/\r?\n/);
    const totalLines = lines.length;
    
    // Regex pattern: "PRODUCT NAME [CATEGORY]: ₹PRICE" or "PRODUCT NAME: ₹PRICE"
    // Category is optional, price symbol (₹) is optional
    const linePattern = /^(.+?)(?:\s*\[([^\]]+)\])?\s*:\s*₹?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*$/;
    
    for (let i = 0; i < lines.length; i++) {
      const lineNumber = i + 1;
      const rawText = lines[i].trim();
      
      // Skip empty lines
      if (rawText === '') {
        continue;
      }
      
      const match = rawText.match(linePattern);
      
      if (match) {
        const productName = this.sanitizeProductName(match[1].trim());
        const category = match[2] ? match[2].trim() : null;
        const priceStr = match[3].replace(/,/g, ''); // Remove commas from price
        const price = parseFloat(priceStr);
        
        // Validate the parsed entry
        const entry: ParsedEntry = {
          id: generateId(),
          rawText,
          productName,
          category,
          price,
          lineNumber,
        };
        
        const validation = this.validateEntry(entry);
        if (validation.valid) {
          entries.push(entry);
        } else {
          // Entry has validation errors - still add it but with warnings
          // For zero/negative prices, we add to errors instead
          if (price <= 0) {
            errors.push({
              lineNumber,
              rawText,
              error: validation.errors.join('; '),
            });
          } else {
            // Valid entry with warnings (e.g., high price)
            entries.push(entry);
          }
        }
      } else {
        // Line doesn't match expected pattern
        errors.push({
          lineNumber,
          rawText,
          error: 'Line does not match expected format "PRODUCT NAME [CATEGORY]: ₹PRICE"',
        });
      }
    }
    
    const parseTime = performance.now() - startTime;
    
    return {
      entries,
      errors,
      totalLines,
      parseTime,
    };
  }
  
  /**
   * Parse CSV format with configurable columns
   * Uses papaparse library for robust CSV parsing
   * 
   * @param content - The CSV content to parse
   * @param options - CSV parsing options
   * @returns ParseResult with entries and errors
   * @see Requirement 1.2
   */
  parseCSVFormat(content: string, options?: Partial<CSVParseOptions>): ParseResult {
    const startTime = performance.now();
    const opts = { ...DEFAULT_CSV_OPTIONS, ...options };
    const entries: ParsedEntry[] = [];
    const errors: ParseError[] = [];
    
    const parseResult = Papa.parse<string[]>(content, {
      delimiter: opts.delimiter,
      skipEmptyLines: true,
      header: false, // We handle header manually
    });
    
    const data = parseResult.data;
    const totalLines = data.length;
    const startRow = opts.hasHeader ? 1 : 0;
    
    for (let i = startRow; i < data.length; i++) {
      const row = data[i];
      const lineNumber = i + 1;
      
      // Get column indices
      const nameIdx = typeof opts.productNameColumn === 'number' 
        ? opts.productNameColumn 
        : row.indexOf(opts.productNameColumn as string);
      
      const priceIdx = typeof opts.priceColumn === 'number'
        ? opts.priceColumn
        : row.indexOf(opts.priceColumn as string);
      
      const categoryIdx = opts.categoryColumn !== undefined
        ? (typeof opts.categoryColumn === 'number'
          ? opts.categoryColumn
          : row.indexOf(opts.categoryColumn as string))
        : -1;
      
      // Validate column indices
      if (nameIdx < 0 || nameIdx >= row.length) {
        errors.push({
          lineNumber,
          rawText: row.join(opts.delimiter),
          error: `Product name column not found at index ${opts.productNameColumn}`,
        });
        continue;
      }
      
      if (priceIdx < 0 || priceIdx >= row.length) {
        errors.push({
          lineNumber,
          rawText: row.join(opts.delimiter),
          error: `Price column not found at index ${opts.priceColumn}`,
        });
        continue;
      }
      
      const productName = this.sanitizeProductName(row[nameIdx]?.trim() || '');
      const priceStr = row[priceIdx]?.replace(/[₹,\s]/g, '') || '0';
      const price = parseFloat(priceStr);
      const category = categoryIdx >= 0 && categoryIdx < row.length 
        ? row[categoryIdx]?.trim() || null 
        : null;
      
      if (!productName) {
        errors.push({
          lineNumber,
          rawText: row.join(opts.delimiter),
          error: 'Product name is empty',
        });
        continue;
      }
      
      if (isNaN(price)) {
        errors.push({
          lineNumber,
          rawText: row.join(opts.delimiter),
          error: `Invalid price value: ${row[priceIdx]}`,
        });
        continue;
      }
      
      const entry: ParsedEntry = {
        id: generateId(),
        rawText: row.join(opts.delimiter),
        productName,
        category,
        price,
        lineNumber,
      };
      
      const validation = this.validateEntry(entry);
      if (validation.valid) {
        entries.push(entry);
      } else {
        if (price <= 0) {
          errors.push({
            lineNumber,
            rawText: row.join(opts.delimiter),
            error: validation.errors.join('; '),
          });
        } else {
          entries.push(entry);
        }
      }
    }
    
    const parseTime = performance.now() - startTime;
    
    return {
      entries,
      errors,
      totalLines,
      parseTime,
    };
  }
  
  /**
   * Parse Excel format using xlsx library
   * Supports both .xlsx and .xls formats
   * 
   * @param buffer - The Excel file as ArrayBuffer
   * @returns ParseResult with entries and errors
   * @see Requirement 1.3
   */
  parseExcelFormat(buffer: ArrayBuffer): ParseResult {
    const startTime = performance.now();
    const entries: ParsedEntry[] = [];
    const errors: ParseError[] = [];
    
    try {
      const workbook = XLSX.read(buffer, { type: 'array' });
      
      // Get the first sheet
      const sheetName = workbook.SheetNames[0];
      if (!sheetName) {
        return {
          entries: [],
          errors: [{ lineNumber: 0, rawText: '', error: 'No sheets found in Excel file' }],
          totalLines: 0,
          parseTime: performance.now() - startTime,
        };
      }
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<string[]>(worksheet, { header: 1 });
      
      const totalLines = data.length;
      
      // Skip header row (assume first row is header)
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        const lineNumber = i + 1;
        
        if (!row || row.length === 0) {
          continue;
        }
        
        // Assume columns: Product Name, Category (optional), Price
        // Or: Product Name, Price
        let productName = '';
        let category: string | null = null;
        let price = 0;
        
        if (row.length >= 2) {
          productName = this.sanitizeProductName(row[0]?.toString().trim() || '');
          
          // Check if second column is price or category
          const secondVal = row[1]?.toString().trim() || '';
          const secondAsNumber = parseFloat(secondVal.replace(/[₹,\s]/g, ''));
          
          if (row.length >= 3) {
            // Format: Name, Category, Price
            category = secondVal || null;
            const priceStr = row[2]?.toString().replace(/[₹,\s]/g, '') || '0';
            price = parseFloat(priceStr);
          } else {
            // Format: Name, Price
            price = isNaN(secondAsNumber) ? 0 : secondAsNumber;
          }
        }
        
        if (!productName) {
          errors.push({
            lineNumber,
            rawText: row.join(', '),
            error: 'Product name is empty',
          });
          continue;
        }
        
        if (isNaN(price)) {
          errors.push({
            lineNumber,
            rawText: row.join(', '),
            error: 'Invalid price value',
          });
          continue;
        }
        
        const entry: ParsedEntry = {
          id: generateId(),
          rawText: row.join(', '),
          productName,
          category,
          price,
          lineNumber,
        };
        
        const validation = this.validateEntry(entry);
        if (validation.valid) {
          entries.push(entry);
        } else {
          if (price <= 0) {
            errors.push({
              lineNumber,
              rawText: row.join(', '),
              error: validation.errors.join('; '),
            });
          } else {
            entries.push(entry);
          }
        }
      }
      
      const parseTime = performance.now() - startTime;
      
      return {
        entries,
        errors,
        totalLines,
        parseTime,
      };
    } catch (error) {
      return {
        entries: [],
        errors: [{
          lineNumber: 0,
          rawText: '',
          error: `Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }],
        totalLines: 0,
        parseTime: performance.now() - startTime,
      };
    }
  }
  
  /**
   * Auto-detect format by file extension and parse
   * 
   * @param file - The file to parse
   * @returns Promise resolving to ParseResult
   * @see Requirements 1.1, 1.2, 1.3
   */
  async parse(file: File): Promise<ParseResult> {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return {
        entries: [],
        errors: [{
          lineNumber: 0,
          rawText: file.name,
          error: `File size exceeds maximum allowed size of 10MB`,
        }],
        totalLines: 0,
        parseTime: 0,
      };
    }
    
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'txt':
        return this.parseTextFile(file);
      case 'csv':
        return this.parseCSVFile(file);
      case 'xlsx':
      case 'xls':
        return this.parseExcelFile(file);
      default:
        return {
          entries: [],
          errors: [{
            lineNumber: 0,
            rawText: file.name,
            error: `Unsupported file format: .${extension}. Supported formats: .txt, .csv, .xlsx, .xls`,
          }],
          totalLines: 0,
          parseTime: 0,
        };
    }
  }
  
  /**
   * Parse a text file
   */
  private async parseTextFile(file: File): Promise<ParseResult> {
    const content = await file.text();
    return this.parseTextFormat(content);
  }
  
  /**
   * Parse a CSV file
   */
  private async parseCSVFile(file: File): Promise<ParseResult> {
    const content = await file.text();
    return this.parseCSVFormat(content);
  }
  
  /**
   * Parse an Excel file
   */
  private async parseExcelFile(file: File): Promise<ParseResult> {
    const buffer = await file.arrayBuffer();
    return this.parseExcelFormat(buffer);
  }
  
  /**
   * Validate a parsed entry
   * - Rejects zero/negative prices
   * - Flags prices > 1,000,000 for admin review
   * 
   * @param entry - The parsed entry to validate
   * @returns ValidationResult with errors and warnings
   * @see Requirements 9.1, 9.2, 9.3
   */
  validateEntry(entry: ParsedEntry): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Validate price
    if (entry.price <= 0) {
      errors.push('Price must be a positive number');
    }
    
    // Check for high price (flag for review, not an error)
    if (entry.price > HIGH_PRICE_THRESHOLD) {
      warnings.push(`Price ₹${entry.price.toLocaleString()} exceeds ₹10,00,000 and requires admin review`);
    }
    
    // Validate product name
    if (!entry.productName || entry.productName.trim() === '') {
      errors.push('Product name cannot be empty');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
  }
  
  /**
   * Sanitize product name
   * - Trims whitespace
   * - Removes potentially dangerous characters
   * - Normalizes whitespace
   * - Caps at 200 characters
   * 
   * @param name - The product name to sanitize
   * @returns Sanitized product name
   * @see Requirement 9.1
   */
  sanitizeProductName(name: string): string {
    return name
      .trim()
      .replace(/[<>"'\\]/g, '') // Remove potentially dangerous characters
      .replace(/\s+/g, ' ')      // Normalize whitespace
      .slice(0, MAX_PRODUCT_NAME_LENGTH); // Limit length
  }
}

// Export singleton instance
export const priceListParserService = new PriceListParserService();
