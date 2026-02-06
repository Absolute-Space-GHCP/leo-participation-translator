/**
 * @file index.ts
 * @description Learning/evolution system main exports
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

// Types
export * from './types.js';

// Observation Store
export {
  ObservationStore,
  getObservationStore,
  createObservationStore,
} from './observation-store.js';

// Pattern Analyzer
export {
  PatternAnalyzer,
  getPatternAnalyzer,
  createPatternAnalyzer,
} from './pattern-analyzer.js';

// Context Injector
export {
  ContextInjector,
  getContextInjector,
  createContextInjector,
} from './context-injector.js';

// ===========================================
// Convenience Functions
// ===========================================

import { getObservationStore } from './observation-store.js';
import { getPatternAnalyzer } from './pattern-analyzer.js';
import { getContextInjector } from './context-injector.js';
import type { SessionObservation, OutputFeedback, EvolutionContext } from './types.js';

/**
 * Record a session observation
 */
export async function recordObservation(
  observation: Omit<SessionObservation, 'id'>
): Promise<SessionObservation> {
  return getObservationStore().addObservation(observation);
}

/**
 * Record output feedback from user
 */
export async function recordFeedback(feedback: OutputFeedback): Promise<void> {
  return getObservationStore().addFeedback(feedback);
}

/**
 * Track an error occurrence
 */
export async function trackError(
  errorType: 'generation' | 'retrieval' | 'api' | 'parsing' | 'export' | 'validation',
  errorMessage: string,
  context: Record<string, unknown> = {}
): Promise<void> {
  await getObservationStore().trackError({
    errorType,
    errorMessage,
    context,
    timestamp: new Date(),
  });
}

/**
 * Get evolution context for a generation
 */
export async function getEvolutionContext(
  seed: { client?: string; category?: string }
): Promise<EvolutionContext> {
  return getContextInjector().getContext(seed);
}

/**
 * Run pattern analysis (typically called on a schedule)
 */
export async function runPatternAnalysis(): Promise<void> {
  const analyzer = getPatternAnalyzer();
  
  await analyzer.analyzeOutputPatterns(30);
  await analyzer.analyzeErrorPatterns(3);
  
  console.log(`Pattern analysis complete. Found ${analyzer.getPatterns().length} patterns.`);
}

/**
 * Get learning system health metrics
 */
export async function getHealthMetrics(): Promise<{
  observationCount: number;
  feedbackCount: number;
  patternCount: number;
  avgRating: number;
}> {
  const store = getObservationStore();
  const analyzer = getPatternAnalyzer();
  
  const observations = await store.queryObservations({});
  const feedback = await store.queryFeedback({});
  const avgRating = await store.getAverageRating(30);
  
  return {
    observationCount: observations.length,
    feedbackCount: feedback.length,
    patternCount: analyzer.getPatterns().length,
    avgRating,
  };
}
