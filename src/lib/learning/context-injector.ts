/**
 * @file context-injector.ts
 * @description Injects learned evolution context into generation requests
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import type {
  EvolutionContext,
  SimilarCampaign,
  UserPreference,
  LearnedPattern,
} from './types';
import { getPatternAnalyzer } from './pattern-analyzer';
import { KnowledgeGraph, createKnowledgeGraph } from '../memory/knowledge-graph';

// ===========================================
// Context Injector
// ===========================================

export class ContextInjector {
  private knowledgeGraph: KnowledgeGraph;

  constructor() {
    this.knowledgeGraph = createKnowledgeGraph();
  }

  /**
   * Get evolution context for a generation request
   */
  async getContext(seed: {
    client?: string;
    category?: string;
  }): Promise<EvolutionContext> {
    const analyzer = getPatternAnalyzer();
    
    // Get similar campaigns from knowledge graph
    const similarCampaigns = await this.findSimilarCampaigns(seed);
    
    // Get success patterns (what works)
    const successPatterns = analyzer.getPatternsByType('success')
      .filter(p => p.confidence >= 0.5)
      .slice(0, 5);
    
    // Get user preferences
    const userPreferences = await this.getUserPreferences();
    
    // Get warnings (failure patterns to avoid)
    const warnings = analyzer.getPatternsByType('failure')
      .filter(p => p.confidence >= 0.5)
      .slice(0, 3);
    
    return {
      similarCampaigns,
      successPatterns,
      userPreferences,
      warnings,
      injectedAt: new Date(),
    };
  }

  /**
   * Find similar campaigns from knowledge graph
   */
  private async findSimilarCampaigns(seed: {
    client?: string;
    category?: string;
  }): Promise<SimilarCampaign[]> {
    const campaigns = this.knowledgeGraph.getCampaigns();
    
    // Filter by client if provided
    let relevant = campaigns;
    if (seed.client) {
      relevant = campaigns.filter(c => 
        c.data.client?.toLowerCase() === seed.client!.toLowerCase()
      );
    }
    
    // If no client match, return most effective campaigns
    if (relevant.length === 0) {
      relevant = campaigns
        .filter(c => c.data.effectiveness !== undefined)
        .sort((a, b) => (b.data.effectiveness || 0) - (a.data.effectiveness || 0))
        .slice(0, 3);
    }
    
    return relevant.map(c => ({
      campaignId: c.id,
      client: c.data.client || 'Unknown',
      name: c.label,
      similarity: c.data.client?.toLowerCase() === seed.client?.toLowerCase() ? 1.0 : 0.5,
      topPatterns: this.knowledgeGraph.getPatternsForCampaign(c.id)
        .map(p => p.label)
        .slice(0, 3),
    }));
  }

  /**
   * Get user preferences (Leo's editing patterns)
   */
  private async getUserPreferences(): Promise<UserPreference[]> {
    const analyzer = getPatternAnalyzer();
    const preferencePatterns = analyzer.getPatternsByType('preference');
    
    return preferencePatterns.map(p => ({
      preferenceType: p.name.replace('Preference: ', ''),
      preferredApproach: p.description,
      observedCount: p.sampleSize,
    }));
  }

  /**
   * Format context for injection into prompts
   */
  formatForPrompt(context: EvolutionContext): string {
    const parts: string[] = [];
    
    // Similar campaigns
    if (context.similarCampaigns.length > 0) {
      parts.push('## Relevant Past Campaigns');
      for (const campaign of context.similarCampaigns) {
        parts.push(`- **${campaign.name}** (${campaign.client})`);
        if (campaign.topPatterns.length > 0) {
          parts.push(`  Patterns used: ${campaign.topPatterns.join(', ')}`);
        }
      }
      parts.push('');
    }
    
    // Success patterns
    if (context.successPatterns.length > 0) {
      parts.push('## What Works (Learned Patterns)');
      for (const pattern of context.successPatterns) {
        parts.push(`- **${pattern.name}**: ${pattern.description}`);
        if (pattern.avgRating) {
          parts.push(`  (Avg rating: ${pattern.avgRating.toFixed(1)}/10)`);
        }
      }
      parts.push('');
    }
    
    // User preferences
    if (context.userPreferences.length > 0) {
      parts.push('## User Preferences');
      for (const pref of context.userPreferences) {
        parts.push(`- ${pref.preferenceType}: ${pref.preferredApproach}`);
      }
      parts.push('');
    }
    
    // Warnings
    if (context.warnings.length > 0) {
      parts.push('## ⚠️ Patterns to Avoid');
      for (const warning of context.warnings) {
        parts.push(`- **${warning.name}**: ${warning.description}`);
      }
      parts.push('');
    }
    
    return parts.join('\n');
  }

  /**
   * Should context be injected? (Check if we have meaningful learnings)
   */
  shouldInjectContext(): boolean {
    const analyzer = getPatternAnalyzer();
    const patterns = analyzer.getPatterns();
    
    // Only inject if we have at least 3 patterns with reasonable confidence
    const highConfidence = patterns.filter(p => p.confidence >= 0.5);
    return highConfidence.length >= 3;
  }

  /**
   * Set the knowledge graph (for testing or custom initialization)
   */
  setKnowledgeGraph(graph: KnowledgeGraph): void {
    this.knowledgeGraph = graph;
  }
}

// ===========================================
// Factory
// ===========================================

let injectorInstance: ContextInjector | null = null;

export function getContextInjector(): ContextInjector {
  if (!injectorInstance) {
    injectorInstance = new ContextInjector();
  }
  return injectorInstance;
}

export function createContextInjector(): ContextInjector {
  return new ContextInjector();
}
