/**
 * @file observation-store.ts
 * @description Firestore-backed store for session observations and feedback
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  SessionObservation,
  OutputFeedback,
  ErrorObservation,
  ObservationQuery,
  FeedbackQuery,
  ObservationType,
  ObservationOutcome,
} from './types';

// ===========================================
// Observation Store Class
// ===========================================

export class ObservationStore {
  private observations: Map<string, SessionObservation> = new Map();
  private feedback: Map<string, OutputFeedback> = new Map();
  private errors: Map<string, ErrorObservation> = new Map();
  
  // In production, these would be Firestore operations
  // For now, in-memory with persistence hooks

  // ===========================================
  // Observations
  // ===========================================

  /**
   * Add a new observation
   */
  async addObservation(
    observation: Omit<SessionObservation, 'id'>
  ): Promise<SessionObservation> {
    const obs: SessionObservation = {
      ...observation,
      id: uuidv4(),
    };
    
    this.observations.set(obs.id, obs);
    
    // TODO: Persist to Firestore
    // await firestore.collection('observations').doc(obs.id).set(obs);
    
    return obs;
  }

  /**
   * Get observation by ID
   */
  async getObservation(id: string): Promise<SessionObservation | undefined> {
    return this.observations.get(id);
  }

  /**
   * Query observations
   */
  async queryObservations(query: ObservationQuery): Promise<SessionObservation[]> {
    let results = Array.from(this.observations.values());
    
    if (query.sessionId) {
      results = results.filter(o => o.sessionId === query.sessionId);
    }
    
    if (query.type) {
      results = results.filter(o => o.type === query.type);
    }
    
    if (query.outcome) {
      results = results.filter(o => o.outcome === query.outcome);
    }
    
    if (query.startDate) {
      results = results.filter(o => o.timestamp >= query.startDate!);
    }
    
    if (query.endDate) {
      results = results.filter(o => o.timestamp <= query.endDate!);
    }
    
    if (query.tags && query.tags.length > 0) {
      results = results.filter(o => 
        query.tags!.some(tag => o.tags.includes(tag))
      );
    }
    
    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (query.limit) {
      results = results.slice(0, query.limit);
    }
    
    return results;
  }

  /**
   * Get observations by session
   */
  async getSessionObservations(sessionId: string): Promise<SessionObservation[]> {
    return this.queryObservations({ sessionId });
  }

  /**
   * Get recent observations of a specific type
   */
  async getRecentByType(
    type: ObservationType,
    days: number = 30
  ): Promise<SessionObservation[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.queryObservations({ type, startDate });
  }

  // ===========================================
  // Feedback
  // ===========================================

  /**
   * Add output feedback
   */
  async addFeedback(feedback: OutputFeedback): Promise<void> {
    this.feedback.set(feedback.generationId, feedback);
    
    // TODO: Persist to Firestore
    // await firestore.collection('feedback').doc(feedback.generationId).set(feedback);
  }

  /**
   * Get feedback for a generation
   */
  async getFeedback(generationId: string): Promise<OutputFeedback | undefined> {
    return this.feedback.get(generationId);
  }

  /**
   * Query feedback
   */
  async queryFeedback(query: FeedbackQuery): Promise<OutputFeedback[]> {
    let results = Array.from(this.feedback.values());
    
    if (query.userId) {
      results = results.filter(f => f.userId === query.userId);
    }
    
    if (query.minRating !== undefined) {
      results = results.filter(f => f.rating !== undefined && f.rating >= query.minRating!);
    }
    
    if (query.maxRating !== undefined) {
      results = results.filter(f => f.rating !== undefined && f.rating <= query.maxRating!);
    }
    
    if (query.startDate) {
      results = results.filter(f => f.timestamp >= query.startDate!);
    }
    
    if (query.endDate) {
      results = results.filter(f => f.timestamp <= query.endDate!);
    }
    
    if (query.hasEdits !== undefined) {
      results = results.filter(f => 
        query.hasEdits 
          ? f.manualEdits && f.manualEdits.length > 0
          : !f.manualEdits || f.manualEdits.length === 0
      );
    }
    
    // Sort by timestamp descending
    results.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    if (query.limit) {
      results = results.slice(0, query.limit);
    }
    
    return results;
  }

  /**
   * Get recent feedback
   */
  async getRecentFeedback(days: number = 30): Promise<OutputFeedback[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.queryFeedback({ startDate });
  }

  /**
   * Get high-rated feedback (rating >= 8)
   */
  async getHighRatedFeedback(days: number = 90): Promise<OutputFeedback[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.queryFeedback({ minRating: 8, startDate });
  }

  /**
   * Get low-rated feedback (rating <= 5)
   */
  async getLowRatedFeedback(days: number = 90): Promise<OutputFeedback[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    return this.queryFeedback({ maxRating: 5, startDate });
  }

  // ===========================================
  // Errors
  // ===========================================

  /**
   * Add or update error observation
   */
  async trackError(
    error: Omit<ErrorObservation, 'id' | 'recurrence' | 'resolved' | 'fixAttempts'>
  ): Promise<ErrorObservation> {
    // Check for existing similar error
    const existing = Array.from(this.errors.values()).find(
      e => e.errorType === error.errorType && e.errorMessage === error.errorMessage
    );
    
    if (existing) {
      // Update recurrence count
      existing.recurrence += 1;
      existing.timestamp = error.timestamp;
      this.errors.set(existing.id, existing);
      return existing;
    }
    
    // Create new error observation
    const newError: ErrorObservation = {
      ...error,
      id: uuidv4(),
      recurrence: 1,
      resolved: false,
      fixAttempts: [],
    };
    
    this.errors.set(newError.id, newError);
    return newError;
  }

  /**
   * Record a fix attempt for an error
   */
  async recordFixAttempt(
    errorId: string,
    fix: { description: string; successful: boolean }
  ): Promise<void> {
    const error = this.errors.get(errorId);
    if (!error) return;
    
    error.fixAttempts.push({
      ...fix,
      timestamp: new Date(),
    });
    
    if (fix.successful) {
      error.resolved = true;
    }
    
    this.errors.set(errorId, error);
  }

  /**
   * Get unresolved errors
   */
  async getUnresolvedErrors(): Promise<ErrorObservation[]> {
    return Array.from(this.errors.values())
      .filter(e => !e.resolved)
      .sort((a, b) => b.recurrence - a.recurrence);
  }

  /**
   * Get recurring errors (appeared 3+ times)
   */
  async getRecurringErrors(minOccurrences: number = 3): Promise<ErrorObservation[]> {
    return Array.from(this.errors.values())
      .filter(e => e.recurrence >= minOccurrences)
      .sort((a, b) => b.recurrence - a.recurrence);
  }

  // ===========================================
  // Analytics
  // ===========================================

  /**
   * Get observation counts by type
   */
  async getObservationStats(): Promise<Record<ObservationType, number>> {
    const stats: Partial<Record<ObservationType, number>> = {};
    
    for (const obs of this.observations.values()) {
      stats[obs.type] = (stats[obs.type] || 0) + 1;
    }
    
    return stats as Record<ObservationType, number>;
  }

  /**
   * Get success rate by observation type
   */
  async getSuccessRateByType(): Promise<Record<ObservationType, number>> {
    const totals: Partial<Record<ObservationType, number>> = {};
    const successes: Partial<Record<ObservationType, number>> = {};
    
    for (const obs of this.observations.values()) {
      totals[obs.type] = (totals[obs.type] || 0) + 1;
      if (obs.outcome === 'success') {
        successes[obs.type] = (successes[obs.type] || 0) + 1;
      }
    }
    
    const rates: Partial<Record<ObservationType, number>> = {};
    for (const type of Object.keys(totals) as ObservationType[]) {
      rates[type] = (successes[type] || 0) / totals[type]!;
    }
    
    return rates as Record<ObservationType, number>;
  }

  /**
   * Get average rating over time
   */
  async getAverageRating(days: number = 30): Promise<number> {
    const feedback = await this.getRecentFeedback(days);
    const rated = feedback.filter(f => f.rating !== undefined);
    
    if (rated.length === 0) return 0;
    
    const sum = rated.reduce((acc, f) => acc + f.rating!, 0);
    return sum / rated.length;
  }

  // ===========================================
  // Persistence
  // ===========================================

  /**
   * Export all data (for backup/migration)
   */
  export(): {
    observations: SessionObservation[];
    feedback: OutputFeedback[];
    errors: ErrorObservation[];
  } {
    return {
      observations: Array.from(this.observations.values()),
      feedback: Array.from(this.feedback.values()),
      errors: Array.from(this.errors.values()),
    };
  }

  /**
   * Import data (for restore/migration)
   */
  import(data: {
    observations: SessionObservation[];
    feedback: OutputFeedback[];
    errors: ErrorObservation[];
  }): void {
    this.observations.clear();
    this.feedback.clear();
    this.errors.clear();
    
    for (const obs of data.observations) {
      this.observations.set(obs.id, obs);
    }
    
    for (const fb of data.feedback) {
      this.feedback.set(fb.generationId, fb);
    }
    
    for (const err of data.errors) {
      this.errors.set(err.id, err);
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.observations.clear();
    this.feedback.clear();
    this.errors.clear();
  }
}

// ===========================================
// Factory
// ===========================================

let storeInstance: ObservationStore | null = null;

export function getObservationStore(): ObservationStore {
  if (!storeInstance) {
    storeInstance = new ObservationStore();
  }
  return storeInstance;
}

export function createObservationStore(): ObservationStore {
  return new ObservationStore();
}
