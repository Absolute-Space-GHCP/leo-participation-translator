/**
 * @file pattern-analyzer.ts
 * @description Analyzes observations and feedback to extract learned patterns
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import { v4 as uuidv4 } from 'uuid';
import type {
  LearnedPattern,
  OutputFeedback,
  ErrorObservation,
  PatternType,
} from './types';
import { getObservationStore } from './observation-store';

// ===========================================
// Pattern Analyzer
// ===========================================

export class PatternAnalyzer {
  private patterns: Map<string, LearnedPattern> = new Map();

  /**
   * Analyze recent feedback to extract success/failure patterns
   */
  async analyzeOutputPatterns(days: number = 30): Promise<LearnedPattern[]> {
    const store = getObservationStore();
    
    // Get high and low rated feedback
    const highRated = await store.getHighRatedFeedback(days);
    const lowRated = await store.getLowRatedFeedback(days);
    
    const patterns: LearnedPattern[] = [];
    
    // Analyze high-rated outputs for success patterns
    if (highRated.length >= 3) {
      const successPatterns = this.extractSuccessPatterns(highRated);
      patterns.push(...successPatterns);
    }
    
    // Analyze low-rated outputs for failure patterns
    if (lowRated.length >= 3) {
      const failurePatterns = this.extractFailurePatterns(lowRated);
      patterns.push(...failurePatterns);
    }
    
    // Store patterns
    for (const pattern of patterns) {
      this.patterns.set(pattern.id, pattern);
    }
    
    return patterns;
  }

  /**
   * Extract success patterns from high-rated feedback
   */
  private extractSuccessPatterns(feedback: OutputFeedback[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];
    
    // Group by whether they had edits
    const noEdits = feedback.filter(f => !f.manualEdits || f.manualEdits.length === 0);
    const withEdits = feedback.filter(f => f.manualEdits && f.manualEdits.length > 0);
    
    // Pattern: High rating with no edits = strong success
    if (noEdits.length >= 2) {
      const avgRating = noEdits.reduce((acc, f) => acc + (f.rating || 0), 0) / noEdits.length;
      
      patterns.push({
        id: uuidv4(),
        type: 'success',
        name: 'Clean Output Success',
        description: 'Outputs that received high ratings without requiring manual edits',
        confidence: Math.min(noEdits.length / 10, 1),
        sampleSize: noEdits.length,
        avgRating,
        examples: noEdits.slice(0, 3).map(f => f.generationId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // Pattern: High rating after minor edits = good baseline
    const minorEditOnly = withEdits.filter(f => 
      f.manualEdits!.every(e => e.editType === 'minor')
    );
    
    if (minorEditOnly.length >= 2) {
      const avgRating = minorEditOnly.reduce((acc, f) => acc + (f.rating || 0), 0) / minorEditOnly.length;
      
      patterns.push({
        id: uuidv4(),
        type: 'success',
        name: 'Minor Polish Success',
        description: 'Outputs that achieved high ratings after only minor edits',
        confidence: Math.min(minorEditOnly.length / 10, 0.8),
        sampleSize: minorEditOnly.length,
        avgRating,
        examples: minorEditOnly.slice(0, 3).map(f => f.generationId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    return patterns;
  }

  /**
   * Extract failure patterns from low-rated feedback
   */
  private extractFailurePatterns(feedback: OutputFeedback[]): LearnedPattern[] {
    const patterns: LearnedPattern[] = [];
    
    // Pattern: Required regeneration
    const regenerated = feedback.filter(f => f.regenerationRequested);
    
    if (regenerated.length >= 2) {
      patterns.push({
        id: uuidv4(),
        type: 'failure',
        name: 'Regeneration Required',
        description: 'Outputs that required complete regeneration',
        confidence: Math.min(regenerated.length / 5, 1),
        sampleSize: regenerated.length,
        avgRating: regenerated.reduce((acc, f) => acc + (f.rating || 0), 0) / regenerated.length,
        examples: regenerated.slice(0, 3).map(f => f.generationId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // Pattern: Required major rewrites
    const majorRewrites = feedback.filter(f => 
      f.manualEdits?.some(e => e.editType === 'rewrite')
    );
    
    if (majorRewrites.length >= 2) {
      patterns.push({
        id: uuidv4(),
        type: 'failure',
        name: 'Major Rewrite Required',
        description: 'Outputs that required complete section rewrites',
        confidence: Math.min(majorRewrites.length / 5, 1),
        sampleSize: majorRewrites.length,
        avgRating: majorRewrites.reduce((acc, f) => acc + (f.rating || 0), 0) / majorRewrites.length,
        examples: majorRewrites.slice(0, 3).map(f => f.generationId),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    return patterns;
  }

  /**
   * Analyze recurring errors to extract fix patterns
   */
  async analyzeErrorPatterns(minOccurrences: number = 3): Promise<LearnedPattern[]> {
    const store = getObservationStore();
    const errors = await store.getRecurringErrors(minOccurrences);
    
    const patterns: LearnedPattern[] = [];
    
    for (const error of errors) {
      // Find successful fixes
      const successfulFixes = error.fixAttempts.filter(f => f.successful);
      
      if (successfulFixes.length > 0) {
        patterns.push({
          id: uuidv4(),
          type: 'fix',
          name: `Fix: ${error.errorType}`,
          description: successfulFixes[successfulFixes.length - 1].description,
          confidence: Math.min(error.recurrence / 10, 1),
          sampleSize: error.recurrence,
          examples: [error.id],
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    
    // Store patterns
    for (const pattern of patterns) {
      this.patterns.set(pattern.id, pattern);
    }
    
    return patterns;
  }

  /**
   * Analyze user editing patterns to extract preferences
   */
  async analyzeUserPreferences(userId: string, days: number = 90): Promise<LearnedPattern[]> {
    const store = getObservationStore();
    const feedback = await store.queryFeedback({
      userId,
      hasEdits: true,
      startDate: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
    });
    
    const patterns: LearnedPattern[] = [];
    
    // Group edits by section
    const editsBySection: Map<string, OutputFeedback['manualEdits']> = new Map();
    
    for (const fb of feedback) {
      if (!fb.manualEdits) continue;
      
      for (const edit of fb.manualEdits) {
        const existing = editsBySection.get(edit.section) || [];
        existing.push(edit);
        editsBySection.set(edit.section, existing);
      }
    }
    
    // Analyze each section for patterns
    for (const [section, edits] of editsBySection) {
      if (edits.length >= 3) {
        // TODO: Use Claude to analyze edit patterns and extract preferences
        // For now, just record that this section is frequently edited
        patterns.push({
          id: uuidv4(),
          type: 'preference',
          name: `Preference: ${section}`,
          description: `User frequently edits section: ${section}`,
          frameworkSection: this.sectionToNumber(section),
          confidence: Math.min(edits.length / 10, 0.9),
          sampleSize: edits.length,
          examples: feedback.slice(0, 3).map(f => f.generationId),
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    }
    
    // Store patterns
    for (const pattern of patterns) {
      this.patterns.set(pattern.id, pattern);
    }
    
    return patterns;
  }

  /**
   * Convert section name to framework number
   */
  private sectionToNumber(section: string): number | undefined {
    const mapping: Record<string, number> = {
      'cultural_context': 1,
      'brand_credibility': 2,
      'shared_interest': 3,
      'passive_trap': 4,
      'participation_idea': 5,
      'moments_places': 6,
      'mechanics': 7,
      'first_responders': 8,
      'ripple_effect': 9,
    };
    
    return mapping[section.toLowerCase().replace(/\s+/g, '_')];
  }

  /**
   * Get all learned patterns
   */
  getPatterns(): LearnedPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get patterns by type
   */
  getPatternsByType(type: PatternType): LearnedPattern[] {
    return Array.from(this.patterns.values()).filter(p => p.type === type);
  }

  /**
   * Get high-confidence patterns
   */
  getHighConfidencePatterns(minConfidence: number = 0.7): LearnedPattern[] {
    return Array.from(this.patterns.values())
      .filter(p => p.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence);
  }

  /**
   * Export patterns
   */
  export(): LearnedPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Import patterns
   */
  import(patterns: LearnedPattern[]): void {
    this.patterns.clear();
    for (const pattern of patterns) {
      this.patterns.set(pattern.id, pattern);
    }
  }
}

// ===========================================
// Factory
// ===========================================

let analyzerInstance: PatternAnalyzer | null = null;

export function getPatternAnalyzer(): PatternAnalyzer {
  if (!analyzerInstance) {
    analyzerInstance = new PatternAnalyzer();
  }
  return analyzerInstance;
}

export function createPatternAnalyzer(): PatternAnalyzer {
  return new PatternAnalyzer();
}
