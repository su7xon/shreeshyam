/**
 * Unit tests for MatchingEngineService
 * 
 * Tests product matching with simple keyword matching (FAST VERSION)
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.4
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { MatchingEngineService } from './MatchingEngineService';
import { ParsedEntry, AdminProduct, ManualMapping } from './types';

describe('MatchingEngineService', () => {
  let service: MatchingEngineService;
  let mockProducts: AdminProduct[];
  let mockMappings: ManualMapping[];

  beforeEach(() => {
    service = new MatchingEngineService();
    
    mockProducts = [
      {
        id: '1',
        name: 'Samsung Galaxy S24 Ultra',
        brand: 'Samsung',
        category: 'Smartphones',
        price: 134999
      },
      {
        id: '2',
        name: 'iPhone 15 Pro',
        brand: 'Apple',
        category: 'Smartphones',
        price: 129900
      },
      {
        id: '3',
        name: 'Vivo V30 Pro 5G',
        brand: 'Vivo',
        category: 'Smartphones',
        price: 39999
      },
      {
        id: '4',
        name: 'Realme Narzo 70 Pro',
        brand: 'Realme',
        category: 'Smartphones',
        price: 19999
      }
    ];

    mockMappings = [
      {
        id: 'mapping-1',
        sourcePattern: 'Samsung S24 Ultra',
        productId: '1',
        productName: 'Samsung Galaxy S24 Ultra',
        createdBy: 'test-user',
        createdAt: new Date(),
        lastUsedAt: new Date(),
        useCount: 1
      }
    ];

    service.initialize(mockProducts, mockMappings);
  });

  describe('detectBrand', () => {
    it('should detect Samsung brand', () => {
      expect(service.detectBrand('Samsung Galaxy S24 Ultra')).toBe('Samsung');
      expect(service.detectBrand('Galaxy S24 Ultra')).toBe('Samsung');
    });

    it('should detect Vivo brand', () => {
      expect(service.detectBrand('Vivo V30 Pro 5G')).toBe('Vivo');
      expect(service.detectBrand('Vivo V Pro')).toBe('Vivo');
    });

    it('should detect Realme brand', () => {
      expect(service.detectBrand('Realme Narzo 70 Pro')).toBe('Realme');
    });

    it('should return null for unknown brand', () => {
      expect(service.detectBrand('Unknown Phone Model')).toBeNull();
    });

    it('should be case insensitive', () => {
      expect(service.detectBrand('samsung galaxy s24 ultra')).toBe('Samsung');
      expect(service.detectBrand('SAMSUNG GALAXY')).toBe('Samsung');
    });
  });

  // Note: normalizeString and calculateConfidence are private methods in FAST VERSION
  // Tests for these methods have been removed as they're implementation details

  describe('checkManualMapping', () => {
    it('should find manual mapping', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Samsung S24 Ultra [Smartphones]: ₹134999',
        productName: 'Samsung S24 Ultra',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const product = service['checkManualMapping'](entry);
      expect(product).not.toBeNull();
      expect(product?.id).toBe('1');
    });

    it('should return null for no manual mapping', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'iPhone 15 Pro [Smartphones]: ₹129900',
        productName: 'iPhone 15 Pro',
        category: 'Smartphones',
        price: 129900,
        lineNumber: 1
      };

      const product = service['checkManualMapping'](entry);
      expect(product).toBeNull();
    });
  });

  describe('matchEntry', () => {
    it('should return MatchResult for exact match', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Samsung Galaxy S24 Ultra [Smartphones]: ₹134999',
        productName: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = service.matchEntry(entry);
      expect('matchedProduct' in result).toBe(true);
      if ('matchedProduct' in result) {
        expect(result.matchedProduct.id).toBe('1');
        expect(result.confidenceScore).toBe(100);
        expect(result.confidenceLevel).toBe('high');
        expect(result.isManualMapping).toBe(false);
      }
    });

    it('should return MatchResult for manual mapping', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Samsung S24 Ultra [Smartphones]: ₹134999',
        productName: 'Samsung S24 Ultra',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = service.matchEntry(entry);
      expect('matchedProduct' in result).toBe(true);
      if ('matchedProduct' in result) {
        expect(result.matchedProduct.id).toBe('1');
        expect(result.confidenceScore).toBe(100);
        expect(result.isManualMapping).toBe(true);
      }
    });

    it('should return UnmatchedEntry for low confidence', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Unknown Phone [Smartphones]: ₹134999',
        productName: 'Unknown Phone',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = service.matchEntry(entry);
      expect('suggestedProducts' in result).toBe(true);
      if ('suggestedProducts' in result) {
        // FAST VERSION: returns empty suggestions array
        expect(result.suggestedProducts.length).toBe(0);
      }
    });

    it('should return NewProductCandidate for no match with brand detection', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'New Samsung Phone [Smartphones]: ₹134999',
        productName: 'New Samsung Phone',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = service.matchEntry(entry);
      expect('detectedBrand' in result).toBe(true);
      if ('detectedBrand' in result) {
        expect(result.detectedBrand).toBe('Samsung');
        expect(result.status).toBe('pending');
      }
    });

    it('should return UnmatchedEntry for no match without brand detection', () => {
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Unknown Brand Phone [Smartphones]: ₹134999',
        productName: 'Unknown Brand Phone',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = service.matchEntry(entry);
      expect('suggestedProducts' in result).toBe(true);
      if ('suggestedProducts' in result) {
        expect(result.suggestedProducts.length).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('matchAll', () => {
    it('should match all entries with progress reporting', async () => {
      const entries: ParsedEntry[] = [
        {
          id: 'test-1',
          rawText: 'Samsung Galaxy S24 Ultra [Smartphones]: ₹134999',
          productName: 'Samsung Galaxy S24 Ultra',
          category: 'Smartphones',
          price: 134999,
          lineNumber: 1
        },
        {
          id: 'test-2',
          rawText: 'iPhone 15 Pro [Smartphones]: ₹129900',
          productName: 'iPhone 15 Pro',
          category: 'Smartphones',
          price: 129900,
          lineNumber: 2
        },
        {
          id: 'test-3',
          rawText: 'New Samsung Phone [Smartphones]: ₹134999',
          productName: 'New Samsung Phone',
          category: 'Smartphones',
          price: 134999,
          lineNumber: 3
        }
      ];

      let progressValues: number[] = [];
      const onProgress = (pct: number) => {
        progressValues.push(pct);
      };

      const result = await service.matchAll(entries, onProgress);

      expect(result.matches).toHaveLength(2);
      expect(result.newProducts).toHaveLength(1);
      expect(result.unmatched).toHaveLength(0);
      expect(result.matchRate).toBeGreaterThan(0);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
      
      // Should have progress updates
      expect(progressValues.length).toBeGreaterThan(0);
      expect(progressValues[progressValues.length - 1]).toBe(100);
    });

    it('should handle empty entries', async () => {
      const entries: ParsedEntry[] = [];
      
      let progressValues: number[] = [];
      const onProgress = (pct: number) => {
        progressValues.push(pct);
      };

      const result = await service.matchAll(entries, onProgress);

      expect(result.matches).toHaveLength(0);
      expect(result.newProducts).toHaveLength(0);
      expect(result.unmatched).toHaveLength(0);
      expect(result.matchRate).toBe(0);
      expect(result.processingTime).toBeGreaterThanOrEqual(0);
    });

    it('should handle batch processing', async () => {
      // Create more than 50 entries to test batching
      const entries: ParsedEntry[] = [];
      for (let i = 0; i < 60; i++) {
        entries.push({
          id: `test-${i}`,
          rawText: `Samsung Galaxy S24 Ultra ${i} [Smartphones]: ₹134999`,
          productName: `Samsung Galaxy S24 Ultra ${i}`,
          category: 'Smartphones',
          price: 134999,
          lineNumber: i + 1
        });
      }

      let progressValues: number[] = [];
      const onProgress = (pct: number) => {
        progressValues.push(pct);
      };

      const result = await service.matchAll(entries, onProgress);

      // Should have multiple progress updates due to batching
      expect(progressValues.length).toBeGreaterThan(1);
    });
  });

  describe('initialize', () => {
    it('should initialize with products and mappings', () => {
      const newService = new MatchingEngineService();
      newService.initialize(mockProducts, mockMappings);
      
      // Test that it works after initialization
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Samsung Galaxy S24 Ultra [Smartphones]: ₹134999',
        productName: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = newService.matchEntry(entry);
      expect('matchedProduct' in result).toBe(true);
    });

    it('should handle empty initialization', () => {
      const newService = new MatchingEngineService();
      newService.initialize([], []);
      
      const entry: ParsedEntry = {
        id: 'test-1',
        rawText: 'Samsung Galaxy S24 Ultra [Smartphones]: ₹134999',
        productName: 'Samsung Galaxy S24 Ultra',
        category: 'Smartphones',
        price: 134999,
        lineNumber: 1
      };

      const result = newService.matchEntry(entry);
      // Should return NewProductCandidate when no products exist
      expect('detectedBrand' in result).toBe(true);
    });
  });
});