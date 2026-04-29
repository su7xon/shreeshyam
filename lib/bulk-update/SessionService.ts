/**
 * Simplified Session Service for Bulk Price Update System
 * 
 * FAST VERSION: Basic session tracking only, no Firestore operations
 * 
 * @see Requirements 6.3, 7.1, 7.2 (SIMPLIFIED)
 */

import { PriceUpdateSession, SessionStatus, SessionResults } from './types';

/**
 * Simplified session service for tracking price update sessions
 * 
 * This is a FAST VERSION implementation that tracks sessions in memory.
 * Firestore operations are skipped for now.
 */
export class SessionService {
  private sessions: Map<string, PriceUpdateSession> = new Map();
  private sessionCounter = 0;

  /**
   * Create new price update session (simplified - stores in memory)
   */
  async createSession(
    data: Omit<PriceUpdateSession, 'id' | 'createdAt'>
  ): Promise<string> {
    const sessionId = `session-${Date.now()}-${++this.sessionCounter}`;
    
    const session: PriceUpdateSession = {
      id: sessionId,
      createdAt: new Date(),
      ...data
    };

    this.sessions.set(sessionId, session);
    
    console.log('[SessionService] Created session:', {
      id: sessionId,
      createdBy: data.createdBy,
      totalEntries: data.totalEntries,
      status: data.status
    });

    return sessionId;
  }

  /**
   * Get session by ID (simplified - from memory)
   */
  async getSession(sessionId: string): Promise<PriceUpdateSession | null> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.log('[SessionService] Session not found:', sessionId);
      return null;
    }
    
    console.log('[SessionService] Retrieved session:', sessionId);
    return session;
  }

  /**
   * Get recent sessions (simplified - from memory)
   */
  async getRecentSessions(limit: number = 10): Promise<PriceUpdateSession[]> {
    const allSessions = Array.from(this.sessions.values());
    const sortedSessions = allSessions.sort((a, b) => {
      const dateA = this.getDateFromTimestamp(a.createdAt);
      const dateB = this.getDateFromTimestamp(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });
    
    const recentSessions = sortedSessions.slice(0, limit);
    console.log('[SessionService] Retrieved', recentSessions.length, 'recent sessions');
    
    return recentSessions;
  }

  /**
   * Helper to convert Timestamp or Date to Date
   */
  private getDateFromTimestamp(timestamp: Date | any): Date {
    if (timestamp instanceof Date) {
      return timestamp;
    }
    // Handle Firebase Timestamp
    if (timestamp && typeof timestamp.toDate === 'function') {
      return timestamp.toDate();
    }
    // Fallback: try to create Date
    return new Date(timestamp);
  }

  /**
   * Update session status (simplified - in memory)
   */
  async updateSessionStatus(sessionId: string, status: SessionStatus): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error('[SessionService] Cannot update status: session not found:', sessionId);
      throw new Error(`Session ${sessionId} not found`);
    }
    
    session.status = status;
    this.sessions.set(sessionId, session);
    
    console.log('[SessionService] Updated session status:', {
      sessionId,
      newStatus: status
    });
  }

  /**
   * Complete session with results (simplified - in memory)
   */
  async completeSession(sessionId: string, results: SessionResults): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      console.error('[SessionService] Cannot complete: session not found:', sessionId);
      throw new Error(`Session ${sessionId} not found`);
    }
    
    // Update session with results
    session.matchedCount = results.matchedCount;
    session.newProductCount = results.newProductCount;
    session.appliedCount = results.appliedCount;
    session.errorCount = results.errors.length;
    session.status = 'completed';
    
    this.sessions.set(sessionId, session);
    
    console.log('[SessionService] Completed session:', {
      sessionId,
      matchedCount: results.matchedCount,
      newProductCount: results.newProductCount,
      appliedCount: results.appliedCount,
      errorCount: results.errors.length
    });
  }
}