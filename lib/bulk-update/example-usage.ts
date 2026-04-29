/**
 * Example usage of Bulk Update Services FAST VERSION
 * Demonstrates simple keyword matching like the script logic
 */

import { MatchingEngineService } from './MatchingEngineService';
import { AuditService } from './AuditService';
import { SessionService } from './SessionService';
import { ParsedEntry, AdminProduct, ManualMapping, PriceChange } from './types';

// Example products from the catalog
const exampleProducts: AdminProduct[] = [
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
  }
];

// Example manual mappings
const exampleMappings: ManualMapping[] = [
  {
    id: 'mapping-1',
    sourcePattern: 'Samsung S24 Ultra',
    productId: '1',
    productName: 'Samsung Galaxy S24 Ultra',
    createdBy: 'admin',
    createdAt: new Date(),
    lastUsedAt: new Date(),
    useCount: 1
  }
];

// Example price list entries
const exampleEntries: ParsedEntry[] = [
  {
    id: 'entry-1',
    rawText: 'Samsung Galaxy S24 Ultra [Smartphones]: ₹134999',
    productName: 'Samsung Galaxy S24 Ultra',
    category: 'Smartphones',
    price: 134999,
    lineNumber: 1
  },
  {
    id: 'entry-2',
    rawText: 'Galaxy S24 [Smartphones]: ₹129999',
    productName: 'Galaxy S24',
    category: 'Smartphones',
    price: 129999,
    lineNumber: 2
  },
  {
    id: 'entry-3',
    rawText: 'New Samsung Phone [Smartphones]: ₹99999',
    productName: 'New Samsung Phone',
    category: 'Smartphones',
    price: 99999,
    lineNumber: 3
  },
  {
    id: 'entry-4',
    rawText: 'Unknown Brand Phone [Smartphones]: ₹49999',
    productName: 'Unknown Brand Phone',
    category: 'Smartphones',
    price: 49999,
    lineNumber: 4
  }
];

async function runExample() {
  console.log('=== Bulk Update Services FAST VERSION Example ===\n');
  
  // Initialize the services
  const matchingService = new MatchingEngineService();
  matchingService.initialize(exampleProducts, exampleMappings);
  
  const auditService = new AuditService();
  const sessionService = new SessionService();
  
  console.log('1. Testing brand detection:');
  console.log(`   "Samsung Galaxy S24 Ultra" -> ${matchingService.detectBrand('Samsung Galaxy S24 Ultra')}`);
  console.log(`   "Vivo V30 Pro" -> ${matchingService.detectBrand('Vivo V30 Pro')}`);
  console.log(`   "Unknown Phone" -> ${matchingService.detectBrand('Unknown Phone')}`);
  
  console.log('\n2. Testing single entry matching:');
  
  for (const entry of exampleEntries) {
    const result = matchingService.matchEntry(entry);
    
    if ('matchedProduct' in result) {
      console.log(`   "${entry.productName}" -> Matched to: ${result.matchedProduct.name} (Score: ${result.confidenceScore})`);
    } else if ('detectedBrand' in result) {
      console.log(`   "${entry.productName}" -> New product candidate (Brand: ${result.detectedBrand})`);
    } else {
      console.log(`   "${entry.productName}" -> Unmatched entry`);
    }
  }
  
  console.log('\n3. Testing batch matching with progress:');
  
  let lastProgress = 0;
  const onProgress = (pct: number) => {
    if (Math.floor(pct) > Math.floor(lastProgress)) {
      console.log(`   Progress: ${Math.floor(pct)}%`);
      lastProgress = pct;
    }
  };
  
  const batchResult = await matchingService.matchAll(exampleEntries, onProgress);
  
  console.log(`\n   Results:`);
  console.log(`   - Matched: ${batchResult.matches.length} products`);
  console.log(`   - New candidates: ${batchResult.newProducts.length} products`);
  console.log(`   - Unmatched: ${batchResult.unmatched.length} entries`);
  console.log(`   - Match rate: ${batchResult.matchRate.toFixed(1)}%`);
  console.log(`   - Processing time: ${batchResult.processingTime}ms`);
  
  console.log('\n4. Testing SessionService:');
  
  // Create a session
  const sessionId = await sessionService.createSession({
    createdBy: 'admin@example.com',
    userEmail: 'admin@example.com',
    status: 'in_progress',
    totalEntries: exampleEntries.length,
    matchedCount: batchResult.matches.length,
    newProductCount: batchResult.newProducts.length,
    unmatchedCount: batchResult.unmatched.length,
    appliedCount: 0,
    errorCount: 0,
    sourceFileName: 'example-prices.txt',
    sourceFileType: 'text'
  });
  
  console.log(`   Created session: ${sessionId}`);
  
  // Get the session
  const session = await sessionService.getSession(sessionId);
  console.log(`   Retrieved session: ${session?.id} (Status: ${session?.status})`);
  
  // Update session status
  await sessionService.updateSessionStatus(sessionId, 'completed');
  console.log(`   Updated session status to 'completed'`);
  
  // Complete session with results
  await sessionService.completeSession(sessionId, {
    matchedCount: batchResult.matches.length,
    newProductCount: batchResult.newProducts.length,
    appliedCount: batchResult.matches.length,
    errors: []
  });
  
  console.log(`   Completed session with results`);
  
  // Get recent sessions
  const recentSessions = await sessionService.getRecentSessions(5);
  console.log(`   Recent sessions: ${recentSessions.length} total`);
  
  console.log('\n5. Testing AuditService:');
  
  // Create audit records for price changes
  const priceChange: PriceChange = {
    productId: '1',
    productName: 'Samsung Galaxy S24 Ultra',
    oldPrice: 134999,
    newPrice: 139999
  };
  
  const auditRecord = await auditService.createAuditRecord(
    priceChange,
    sessionId,
    'user123',
    'admin@example.com'
  );
  
  console.log(`   Created audit record for: ${auditRecord.productName}`);
  console.log(`   Price change: ₹${auditRecord.oldPrice} → ₹${auditRecord.newPrice} (Difference: ₹${auditRecord.priceDifference})`);
  
  // Get audit records
  const auditRecords = await auditService.getAuditRecords();
  console.log(`   Total audit records: ${auditRecords.length}`);
  
  console.log('\n=== Example Complete ===');
}

// Note: This is just an example file, not meant to be executed directly
// To run: npx tsx lib/bulk-update/example-usage.ts