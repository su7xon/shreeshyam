/**
 * Simplified Audit Service for Bulk Price Update System
 * 
 * FAST VERSION: Basic logging only, no Firestore operations
 * 
 * @see Requirements 6.1, 6.2, 6.3, 7.1, 7.2 (SIMPLIFIED)
 */

import { AuditRecord, PriceChange, AuditFilters } from './types';

/**
 * Simplified audit service for logging price changes
 * 
 * This is a FAST VERSION implementation that only logs to console.
 * Firestore operations and complex filtering are skipped for now.
 */
export class AuditService {
  /**
   * Create audit record for price change (simplified - logs to console)
   */
  async createAuditRecord(
    change: PriceChange,
    sessionId: string,
    userId: string,
    userEmail: string
  ): Promise<AuditRecord> {
    console.log('[AuditService] Creating audit record:', {
      productId: change.productId,
      productName: change.productName,
      oldPrice: change.oldPrice,
      newPrice: change.newPrice,
      sessionId,
      userId,
      userEmail,
      timestamp: new Date()
    });

    // Return a mock audit record (FAST VERSION)
    return {
      id: `mock-audit-${Date.now()}`,
      productId: change.productId,
      productName: change.productName,
      oldPrice: change.oldPrice,
      newPrice: change.newPrice,
      priceDifference: change.newPrice - change.oldPrice,
      percentageChange: ((change.newPrice - change.oldPrice) / change.oldPrice) * 100,
      sessionId,
      userId,
      userEmail,
      timestamp: new Date(),
      isRollback: false
    };
  }

  /**
   * Get audit records with filters (simplified - returns empty array)
   */
  async getAuditRecords(filters?: AuditFilters): Promise<AuditRecord[]> {
    console.log('[AuditService] Getting audit records with filters:', filters);
    // FAST VERSION: Return empty array
    return [];
  }

  /**
   * Get all records for a session (simplified - returns empty array)
   */
  async getSessionRecords(sessionId: string): Promise<AuditRecord[]> {
    console.log('[AuditService] Getting session records for:', sessionId);
    // FAST VERSION: Return empty array
    return [];
  }

  /**
   * Create rollback audit records (simplified - logs to console)
   */
  async createRollbackRecords(
    originalRecords: AuditRecord[],
    userId: string,
    userEmail: string
  ): Promise<AuditRecord[]> {
    console.log('[AuditService] Creating rollback records for', originalRecords.length, 'original records');
    
    // FAST VERSION: Return mock rollback records
    return originalRecords.map(record => ({
      ...record,
      id: `mock-rollback-${Date.now()}-${record.id}`,
      oldPrice: record.newPrice,
      newPrice: record.oldPrice,
      priceDifference: record.oldPrice - record.newPrice,
      percentageChange: ((record.oldPrice - record.newPrice) / record.newPrice) * 100,
      timestamp: new Date(),
      isRollback: true,
      originalRecordId: record.id
    }));
  }
}