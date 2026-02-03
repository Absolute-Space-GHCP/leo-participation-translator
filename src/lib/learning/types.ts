/**
 * @file types.ts
 * @description Type definitions for the learning/evolution system
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

// ===========================================
// Observation Types
// ===========================================

export type ObservationType = 
  | 'file_edit'
  | 'shell_command'
  | 'tool_use'
  | 'decision'
  | 'discovery'
  | 'bugfix'
  | 'feature';

export type ObservationOutcome = 'success' | 'failure' | 'partial';

export interface SessionObservation {
  id: string;
  sessionId: string;
  timestamp: Date;
  type: ObservationType;
  context: {
    file?: string;
    command?: string;
    tool?: string;
    rationale?: string;
    errorMessage?: string;
    relatedObservations?: string[];
  };
  outcome: ObservationOutcome;
  tags: string[];
  tokenCost?: number;
}

// ===========================================
// Feedback Types
// ===========================================

export type EditIntensity = 'minor' | 'major' | 'rewrite';
export type ExportFormat = 'pptx' | 'pdf' | 'slides' | 'none';

export interface OutputEdit {
  section: string;
  originalText: string;
  editedText: string;
  editType: EditIntensity;
}

export interface OutputFeedback {
  generationId: string;
  userId: string;
  timestamp: Date;
  rating?: number;                    // 1-10
  manualEdits?: OutputEdit[];
  regenerationRequested: boolean;
  regenerationReason?: string;
  exportFormat: ExportFormat;
  timeToExport?: number;              // Seconds
  comments?: string;
}

// ===========================================
// Error Types
// ===========================================

export type ErrorType = 
  | 'generation'
  | 'retrieval'
  | 'api'
  | 'parsing'
  | 'export'
  | 'validation';

export interface FixAttempt {
  description: string;
  successful: boolean;
  timestamp: Date;
}

export interface ErrorObservation {
  id: string;
  timestamp: Date;
  errorType: ErrorType;
  errorCode?: string;
  errorMessage: string;
  stackTrace?: string;
  context: Record<string, unknown>;
  fixAttempts: FixAttempt[];
  recurrence: number;
  resolved: boolean;
}

// ===========================================
// Pattern Types
// ===========================================

export type PatternType = 
  | 'success'       // Approach that works
  | 'failure'       // Approach to avoid
  | 'preference'    // User preference
  | 'fix';          // Recurring fix pattern

export interface LearnedPattern {
  id: string;
  type: PatternType;
  name: string;
  description: string;
  frameworkSection?: number;          // 1-9 for framework sections
  confidence: number;                 // 0-1
  sampleSize: number;                 // How many observations support this
  avgRating?: number;                 // For success/failure patterns
  examples: string[];
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// Evolution Context
// ===========================================

export interface SimilarCampaign {
  campaignId: string;
  client: string;
  name: string;
  similarity: number;                 // 0-1
  topPatterns: string[];
}

export interface UserPreference {
  preferenceType: string;
  preferredApproach: string;
  avoidApproach?: string;
  observedCount: number;
}

export interface EvolutionContext {
  similarCampaigns: SimilarCampaign[];
  successPatterns: LearnedPattern[];
  userPreferences: UserPreference[];
  warnings: LearnedPattern[];         // Failure patterns to avoid
  injectedAt: Date;
}

// ===========================================
// Analytics Types
// ===========================================

export interface LearningMetrics {
  period: {
    start: Date;
    end: Date;
  };
  avgRating: number;
  ratingTrend: 'improving' | 'stable' | 'declining';
  regenerationRate: number;           // 0-1
  avgTimeToExport: number;            // Seconds
  avgEditsPerOutput: number;
  patternsLearned: number;
  rulesEvolved: number;
}

// ===========================================
// Store Types
// ===========================================

export interface ObservationQuery {
  sessionId?: string;
  type?: ObservationType;
  outcome?: ObservationOutcome;
  startDate?: Date;
  endDate?: Date;
  tags?: string[];
  limit?: number;
}

export interface FeedbackQuery {
  userId?: string;
  minRating?: number;
  maxRating?: number;
  startDate?: Date;
  endDate?: Date;
  hasEdits?: boolean;
  limit?: number;
}
