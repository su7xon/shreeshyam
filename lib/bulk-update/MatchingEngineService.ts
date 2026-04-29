/**
 * Matching Engine Service for Bulk Price Update System
 * 
 * This service implements product matching between price list entries and catalog products
 * using simple keyword matching (FAST VERSION - using existing script logic).
 * 
 * @see Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 10.4
 */

import { ParsedEntry, AdminProduct, MatchResult, NewProductCandidate, UnmatchedEntry, MatchingResult, ManualMapping } from './types';

/**
 * Matching Engine Service - FAST VERSION
 * Uses simple keyword matching like the existing script logic
 */
export class MatchingEngineService {
  private products: AdminProduct[] = [];
  private manualMappings: ManualMapping[] = [];

  /**
   * Initialize the matching engine with products and manual mappings
   */
  initialize(products: AdminProduct[], mappings: ManualMapping[]): void {
    this.products = products;
    this.manualMappings = mappings;
  }

  /**
   * Detect brand from product name - simple keyword matching
   * FAST VERSION: Simple string includes check
   */
  detectBrand(productName: string): string | null {
    const nameUpper = productName.toUpperCase();
    
    // Simple brand detection based on keywords
    if (nameUpper.includes('SAMSUNG') || nameUpper.includes('GALAXY')) return 'Samsung';
    if (nameUpper.includes('OPPO') || nameUpper.includes('RENO') || nameUpper.includes('FIND X')) return 'OPPO';
    if (nameUpper.includes('VIVO') || nameUpper.includes('V PRO') || nameUpper.includes('V 5G')) return 'Vivo';
    if (nameUpper.includes('REALME') || nameUpper.includes('NARZO')) return 'Realme';
    if (nameUpper.includes('XIAOMI') || nameUpper.includes('REDMI') || nameUpper.includes('MI ')) return 'Xiaomi';
    if (nameUpper.includes('POCO') || nameUpper.includes('POCOPHONE')) return 'Poco';
    if (nameUpper.includes('MOTOROLA') || nameUpper.includes('MOTO G') || nameUpper.includes('MOTO EDGE')) return 'Motorola';
    if (nameUpper.includes('NOKIA')) return 'Nokia';
    if (nameUpper.includes('ITEL')) return 'ITEL';
    if (nameUpper.includes('LAVA')) return 'LAVA';
    if (nameUpper.includes('INFINIX') || nameUpper.includes('HOT ') || nameUpper.includes('NOTE PRO')) return 'Infinix';
    if (nameUpper.includes('IQOO') || nameUpper.includes('Z 5G')) return 'iQOO';
    if (nameUpper.includes('TECNO') || nameUpper.includes('SPARK') || nameUpper.includes('CAMON')) return 'Tecno';
    if (nameUpper.includes('NOTHING PHONE') || nameUpper.includes('PHONE (')) return 'Nothing';
    if (nameUpper.includes('ONEPLUS') || nameUpper.includes('NORD')) return 'OnePlus';
    if (nameUpper.includes('PHILIPS')) return 'Philips';
    
    return null;
  }

  /**
   * Check for existing manual mapping
   */
  private checkManualMapping(entry: ParsedEntry): AdminProduct | null {
    const entryNameUpper = entry.productName.toUpperCase();
    
    for (const mapping of this.manualMappings) {
      const patternUpper = mapping.sourcePattern.toUpperCase();
      
      // Simple pattern matching: check if entry contains pattern
      if (entryNameUpper.includes(patternUpper)) {
        // Find the product
        const product = this.products.find(p => p.id === mapping.productId);
        if (product) {
          return product;
        }
      }
    }
    
    return null;
  }

  /**
   * Simple keyword matching like the script logic
   * Returns true if enough keywords match
   */
  private keywordMatch(entryName: string, productName: string): boolean {
    const entryUpper = entryName.toUpperCase();
    const productUpper = productName.toUpperCase();
    
    // Split into keywords (non-alphanumeric as separators)
    const entryKeywords = entryUpper.split(/[^A-Z0-9]+/).filter(k => k.length > 0);
    const productKeywords = productUpper.split(/[^A-Z0-9]+/).filter(k => k.length > 0);
    
    // Count matching keywords
    let matchCount = 0;
    for (const entryKeyword of entryKeywords) {
      if (productUpper.includes(entryKeyword)) {
        matchCount++;
      }
    }
    
    // Similar to script logic: match if enough keywords match
    // In script: matchCount >= Math.max(2, rule.keys.length - 1)
    // Here we use: matchCount >= Math.max(2, Math.min(entryKeywords.length, productKeywords.length) - 1)
    const minKeywords = Math.min(entryKeywords.length, productKeywords.length);
    const requiredMatches = Math.max(2, minKeywords - 1);
    
    return matchCount >= requiredMatches;
  }

  /**
   * Match a single entry to catalog products using keyword matching
   * FAST VERSION: Simple match/no-match, no complex scoring
   */
  matchEntry(entry: ParsedEntry): MatchResult | UnmatchedEntry | NewProductCandidate {
    // First check for manual mapping
    const manualMappedProduct = this.checkManualMapping(entry);
    if (manualMappedProduct) {
      return {
        id: `${entry.id}-${manualMappedProduct.id}`,
        parsedEntry: entry,
        matchedProduct: manualMappedProduct,
        confidenceScore: 100,
        confidenceLevel: 'high',
        status: 'pending',
        isManualMapping: true
      };
    }

    // Find best match using keyword matching
    let bestMatch: AdminProduct | null = null;
    
    for (const product of this.products) {
      if (this.keywordMatch(entry.productName, product.name)) {
        bestMatch = product;
        break; // Take first match (FAST VERSION)
      }
    }

    // Determine result
    if (bestMatch) {
      // Simple confidence: 100 if exact match, 80 if keyword match
      const entryUpper = entry.productName.toUpperCase();
      const productUpper = bestMatch.name.toUpperCase();
      const confidenceScore = entryUpper === productUpper ? 100 : 80;
      
      return {
        id: `${entry.id}-${bestMatch.id}`,
        parsedEntry: entry,
        matchedProduct: bestMatch,
        confidenceScore,
        confidenceLevel: confidenceScore >= 80 ? 'high' : 'medium',
        status: 'pending',
        isManualMapping: false
      };
    } else {
      // No match found - check if we can detect brand for new product
      const detectedBrand = this.detectBrand(entry.productName);
      
      if (detectedBrand) {
        // Has brand detection - return as new product candidate
        return {
          id: entry.id,
          parsedEntry: entry,
          detectedBrand,
          status: 'pending'
        };
      } else {
        // No brand detection - return as unmatched
        return {
          id: entry.id,
          parsedEntry: entry,
          suggestedProducts: [] // FAST VERSION: skip suggestions
        };
      }
    }
  }

  /**
   * Match all entries with progress reporting
   * FAST VERSION: Batch processing for speed
   */
  async matchAll(
    entries: ParsedEntry[], 
    onProgress: (pct: number) => void
  ): Promise<MatchingResult> {
    const startTime = Date.now();
    const matches: MatchResult[] = [];
    const newProducts: NewProductCandidate[] = [];
    const unmatched: UnmatchedEntry[] = [];
    
    const batchSize = 50;
    const totalEntries = entries.length;
    
    for (let i = 0; i < totalEntries; i += batchSize) {
      const batch = entries.slice(i, Math.min(i + batchSize, totalEntries));
      
      for (const entry of batch) {
        const result = this.matchEntry(entry);
        
        if ('matchedProduct' in result) {
          matches.push(result);
        } else if ('detectedBrand' in result) {
          newProducts.push(result);
        } else {
          unmatched.push(result);
        }
      }
      
      // Report progress
      const progress = Math.min(i + batch.length, totalEntries) / totalEntries * 100;
      onProgress(progress);
      
      // Yield to main thread for UI updates
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    const processingTime = Date.now() - startTime;
    const matchRate = totalEntries > 0 ? (matches.length / totalEntries) * 100 : 0;
    
    return {
      matches,
      newProducts,
      unmatched,
      matchRate,
      processingTime
    };
  }
}