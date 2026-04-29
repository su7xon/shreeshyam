/**
 * Unit tests for PriceListParserService
 * 
 * Tests parsing of price lists in text, CSV, and Excel formats
 * 
 * @see Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 9.1, 9.2, 9.3
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PriceListParserService } from './PriceListParserService';
import { ParsedEntry } from './types';

describe('PriceListParserService', () => {
  let service: PriceListParserService;

  beforeEach(() => {
    service = new PriceListParserService();
  });

  describe('parseTextFormat', () => {
    it('should parse valid text format with category', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999
iPhone 15 Pro [Smartphones]: ₹129900
Vivo V30 Pro 5G [Smartphones]: ₹39999`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(3);
      expect(result.errors).toHaveLength(0);
      
      expect(result.entries[0].productName).toBe('Samsung Galaxy S24 Ultra');
      expect(result.entries[0].category).toBe('Smartphones');
      expect(result.entries[0].price).toBe(134999);
      
      expect(result.entries[1].productName).toBe('iPhone 15 Pro');
      expect(result.entries[1].category).toBe('Smartphones');
      expect(result.entries[1].price).toBe(129900);
      
      expect(result.entries[2].productName).toBe('Vivo V30 Pro 5G');
      expect(result.entries[2].category).toBe('Smartphones');
      expect(result.entries[2].price).toBe(39999);
    });

    it('should parse text format without category', () => {
      const content = `Samsung Galaxy S24 Ultra: ₹134999
iPhone 15 Pro: ₹129900`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].category).toBeNull();
      expect(result.entries[1].category).toBeNull();
    });

    it('should parse prices with commas', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹1,34,999`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].price).toBe(134999);
    });

    it('should parse prices without rupee symbol', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: 134999`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].price).toBe(134999);
    });

    it('should skip empty lines', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999

iPhone 15 Pro [Smartphones]: ₹129900`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(2);
    });

    it('should report errors for malformed lines', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999
This is not a valid line
iPhone 15 Pro [Smartphones]: ₹129900`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(2);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].lineNumber).toBe(2);
      expect(result.errors[0].error).toContain('does not match expected format');
    });

    it('should report errors for zero prices', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹0`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toContain('positive number');
    });

    it('should report errors for negative prices', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹-1000`;

      const result = service.parseTextFormat(content);

      // Negative prices won't match the regex pattern
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include line numbers in parsed entries', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999
iPhone 15 Pro [Smartphones]: ₹129900`;

      const result = service.parseTextFormat(content);

      expect(result.entries[0].lineNumber).toBe(1);
      expect(result.entries[1].lineNumber).toBe(2);
    });

    it('should include raw text in parsed entries', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999`;

      const result = service.parseTextFormat(content);

      expect(result.entries[0].rawText).toBe('Samsung Galaxy S24 Ultra [Smartphones]: ₹134999');
    });

    it('should handle CRLF line endings', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999\r\niPhone 15 Pro [Smartphones]: ₹129900`;

      const result = service.parseTextFormat(content);

      expect(result.entries).toHaveLength(2);
    });
  });

  describe('parseCSVFormat', () => {
    it('should parse CSV with header row', () => {
      const content = `Product Name,Category,Price
Samsung Galaxy S24 Ultra,Smartphones,134999
iPhone 15 Pro,Smartphones,129900`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 2,
        categoryColumn: 1,
        hasHeader: true,
        delimiter: ',',
      });

      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].productName).toBe('Samsung Galaxy S24 Ultra');
      expect(result.entries[0].category).toBe('Smartphones');
      expect(result.entries[0].price).toBe(134999);
    });

    it('should parse CSV without header row', () => {
      const content = `Samsung Galaxy S24 Ultra,Smartphones,134999
iPhone 15 Pro,Smartphones,129900`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 2,
        categoryColumn: 1,
        hasHeader: false,
        delimiter: ',',
      });

      expect(result.entries).toHaveLength(2);
    });

    it('should parse CSV with prices containing rupee symbol', () => {
      const content = `Product Name,Price
Samsung Galaxy S24 Ultra,₹134999`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 1,
        hasHeader: true,
        delimiter: ',',
      });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].price).toBe(134999);
    });

    it('should parse CSV with custom delimiter', () => {
      const content = `Product Name;Price
Samsung Galaxy S24 Ultra;134999`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 1,
        hasHeader: true,
        delimiter: ';',
      });

      expect(result.entries).toHaveLength(1);
      expect(result.entries[0].price).toBe(134999);
    });

    it('should report errors for missing columns', () => {
      const content = `Product Name
Samsung Galaxy S24 Ultra`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 1,
        hasHeader: true,
        delimiter: ',',
      });

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].error).toContain('Price column not found');
    });

    it('should report errors for invalid prices', () => {
      const content = `Product Name,Price
Samsung Galaxy S24 Ultra,not_a_price`;

      const result = service.parseCSVFormat(content, {
        productNameColumn: 0,
        priceColumn: 1,
        hasHeader: true,
        delimiter: ',',
      });

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0].error).toContain('Invalid price value');
    });
  });

  describe('parseExcelFormat', () => {
    it('should parse Excel format with three columns', async () => {
      // Create a simple Excel file in memory
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const data = [
        ['Product Name', 'Category', 'Price'],
        ['Samsung Galaxy S24 Ultra', 'Smartphones', 134999],
        ['iPhone 15 Pro', 'Smartphones', 129900],
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      const result = service.parseExcelFormat(buffer);

      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].productName).toBe('Samsung Galaxy S24 Ultra');
      expect(result.entries[0].category).toBe('Smartphones');
      expect(result.entries[0].price).toBe(134999);
    });

    it('should parse Excel format with two columns (name and price)', async () => {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const data = [
        ['Product Name', 'Price'],
        ['Samsung Galaxy S24 Ultra', 134999],
        ['iPhone 15 Pro', 129900],
      ];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      const result = service.parseExcelFormat(buffer);

      expect(result.entries).toHaveLength(2);
      expect(result.entries[0].category).toBeNull();
      expect(result.entries[0].price).toBe(134999);
    });

    it('should handle empty Excel file', async () => {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const data: any[][] = [];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      const result = service.parseExcelFormat(buffer);

      expect(result.entries).toHaveLength(0);
    });
  });

  describe('validateEntry', () => {
    it('should validate positive prices', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Test Product [Category]: ₹1000',
        productName: 'Test Product',
        category: 'Category',
        price: 1000,
        lineNumber: 1,
      };

      const result = service.validateEntry(entry);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject zero prices', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Test Product [Category]: ₹0',
        productName: 'Test Product',
        category: 'Category',
        price: 0,
        lineNumber: 1,
      };

      const result = service.validateEntry(entry);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Price must be a positive number');
    });

    it('should reject negative prices', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Test Product [Category]: ₹-100',
        productName: 'Test Product',
        category: 'Category',
        price: -100,
        lineNumber: 1,
      };

      const result = service.validateEntry(entry);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Price must be a positive number');
    });

    it('should flag prices over 1,000,000 for review', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Test Product [Category]: ₹1500000',
        productName: 'Test Product',
        category: 'Category',
        price: 1500000,
        lineNumber: 1,
      };

      const result = service.validateEntry(entry);

      expect(result.valid).toBe(true);
      expect(result.warnings).toBeDefined();
      expect(result.warnings).toHaveLength(1);
      expect(result.warnings![0]).toContain('exceeds');
      expect(result.warnings![0]).toContain('requires admin review');
    });

    it('should reject empty product names', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: ': ₹1000',
        productName: '',
        category: null,
        price: 1000,
        lineNumber: 1,
      };

      const result = service.validateEntry(entry);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Product name cannot be empty');
    });
  });

  describe('sanitizeProductName', () => {
    it('should trim whitespace', () => {
      expect(service.sanitizeProductName('  Test Product  ')).toBe('Test Product');
    });

    it('should remove dangerous characters', () => {
      expect(service.sanitizeProductName('Test<script>Product')).toBe('TestscriptProduct');
      expect(service.sanitizeProductName('Test"Product')).toBe('TestProduct');
      expect(service.sanitizeProductName("Test'Product")).toBe('TestProduct');
    });

    it('should normalize whitespace', () => {
      expect(service.sanitizeProductName('Test   Product')).toBe('Test Product');
      expect(service.sanitizeProductName('Test\t\tProduct')).toBe('Test Product');
    });

    it('should cap at 200 characters', () => {
      const longName = 'A'.repeat(300);
      const result = service.sanitizeProductName(longName);
      expect(result.length).toBe(200);
    });

    it('should handle empty strings', () => {
      expect(service.sanitizeProductName('')).toBe('');
    });
  });

  describe('parse (auto-detect)', () => {
    it('should reject files larger than 10MB', async () => {
      // Create a mock file that's too large
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.txt', { type: 'text/plain' });
      Object.defineProperty(largeFile, 'size', { value: 11 * 1024 * 1024 });

      const result = await service.parse(largeFile);

      expect(result.entries).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toContain('exceeds maximum allowed size');
    });

    it('should reject unsupported file formats', async () => {
      const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });

      const result = await service.parse(file);

      expect(result.entries).toHaveLength(0);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].error).toContain('Unsupported file format');
    });
  });

  describe('parseTime tracking', () => {
    it('should include parseTime in text format result', () => {
      const content = `Samsung Galaxy S24 Ultra [Smartphones]: ₹134999`;
      const result = service.parseTextFormat(content);
      expect(result.parseTime).toBeGreaterThanOrEqual(0);
    });

    it('should include parseTime in CSV format result', () => {
      const content = `Product Name,Price
Samsung Galaxy S24 Ultra,134999`;
      const result = service.parseCSVFormat(content);
      expect(result.parseTime).toBeGreaterThanOrEqual(0);
    });

    it('should include parseTime in Excel format result', async () => {
      const XLSX = await import('xlsx');
      const workbook = XLSX.utils.book_new();
      const data = [['Product Name', 'Price'], ['Test', 100]];
      const worksheet = XLSX.utils.aoa_to_sheet(data);
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
      const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });

      const result = service.parseExcelFormat(buffer);
      expect(result.parseTime).toBeGreaterThanOrEqual(0);
    });
  });
});
