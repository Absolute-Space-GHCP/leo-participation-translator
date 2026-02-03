/**
 * @file task-router.ts
 * @description Route tasks to optimal LLM based on complexity for cost optimization
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

// ===========================================
// Types
// ===========================================

/**
 * Task complexity levels
 */
export type TaskComplexity = 'simple' | 'medium' | 'complex';

/**
 * Model provider options
 */
export type ModelProvider = 'anthropic' | 'google';

/**
 * Result of routing decision
 */
export interface RoutingResult {
  provider: ModelProvider;
  model: string;
  complexity: TaskComplexity;
  estimatedCostPer1K: number;
  reasoning: string;
}

// ===========================================
// Model Definitions
// ===========================================

/**
 * Available models by complexity
 */
const MODELS = {
  anthropic: {
    simple: 'claude-3-haiku-20240307',
    medium: 'claude-sonnet-4-20250514',
    complex: 'claude-opus-4-5-20250131',
  },
  google: {
    simple: 'gemini-2.0-flash',
    medium: 'gemini-2.5-pro',
    complex: 'gemini-2.5-pro', // Gemini doesn't have an Opus equivalent
  },
} as const;

/**
 * Cost per 1K tokens (approximate, for estimation)
 */
const COSTS_PER_1K = {
  'claude-3-haiku-20240307': 0.00025,
  'claude-sonnet-4-20250514': 0.003,
  'claude-opus-4-5-20250131': 0.015,
  'gemini-2.0-flash': 0.0001,
  'gemini-2.5-pro': 0.00125,
} as const;

// ===========================================
// Complexity Detection
// ===========================================

/**
 * Patterns that indicate simple tasks
 */
const SIMPLE_PATTERNS = [
  /^(what|who|when|where|how many|how much|is|are|does|do|can|will)\b/i,
  /\b(lookup|find|search|get|list|show|display)\b/i,
  /\b(format|convert|parse|extract)\b/i,
  /\b(diff|compare|check|verify|validate)\b/i,
];

/**
 * Patterns that indicate complex tasks
 */
const COMPLEX_PATTERNS = [
  /\b(strategic|strategy|framework|architecture)\b/i,
  /\b(participation|cultural|brand credibility)\b/i,
  /\b(8-part|eight-part|framework application)\b/i,
  /\b(analyze|synthesize|reason|think through)\b/i,
  /\b(comprehensive|detailed|thorough|extensive)\b/i,
  /\b(transform|translate|reframe|reimagine)\b/i,
];

/**
 * Task types that should always use specific complexity
 */
const TASK_TYPE_OVERRIDES: Record<string, TaskComplexity> = {
  // Always complex - requires deep reasoning
  'framework_application': 'complex',
  'strategic_synthesis': 'complex',
  'cultural_analysis': 'complex',
  'blueprint_generation': 'complex',
  
  // Always simple - deterministic operations
  'embedding_generation': 'simple',
  'document_parsing': 'simple',
  'vector_search': 'simple',
  
  // Medium - requires some reasoning
  'pattern_extraction': 'medium',
  'context_assembly': 'medium',
  'retrieval_ranking': 'medium',
};

/**
 * Detect task complexity from prompt and optional task type
 */
export function detectComplexity(
  prompt: string, 
  taskType?: string
): TaskComplexity {
  // Check for explicit task type override
  if (taskType && taskType in TASK_TYPE_OVERRIDES) {
    return TASK_TYPE_OVERRIDES[taskType];
  }

  const promptLower = prompt.toLowerCase();
  const promptLength = prompt.length;

  // Check for complex patterns first (more specific)
  for (const pattern of COMPLEX_PATTERNS) {
    if (pattern.test(promptLower)) {
      return 'complex';
    }
  }

  // Check for simple patterns
  for (const pattern of SIMPLE_PATTERNS) {
    if (pattern.test(promptLower) && promptLength < 300) {
      return 'simple';
    }
  }

  // Long prompts with lots of context tend to be complex
  if (promptLength > 2000) {
    return 'complex';
  }

  // Default to medium
  return 'medium';
}

// ===========================================
// Task Router
// ===========================================

export interface TaskRouterConfig {
  preferredProvider: ModelProvider;
  enableRouting: boolean;
  anthropicAvailable: boolean;
  googleAvailable: boolean;
}

/**
 * Route a task to the optimal model
 */
export function routeTask(
  prompt: string,
  config: TaskRouterConfig,
  taskType?: string
): RoutingResult {
  // If routing is disabled, use preferred provider with medium complexity
  const complexity = config.enableRouting 
    ? detectComplexity(prompt, taskType) 
    : 'medium';

  // Determine provider based on complexity and availability
  let provider: ModelProvider;
  
  if (complexity === 'complex') {
    // Complex tasks prefer Anthropic (Claude Opus)
    provider = config.anthropicAvailable ? 'anthropic' : 'google';
  } else if (complexity === 'simple') {
    // Simple tasks prefer Google (cheaper)
    provider = config.googleAvailable ? 'google' : 'anthropic';
  } else {
    // Medium tasks use preferred provider
    provider = config.preferredProvider;
    if (provider === 'anthropic' && !config.anthropicAvailable) {
      provider = 'google';
    }
    if (provider === 'google' && !config.googleAvailable) {
      provider = 'anthropic';
    }
  }

  const model = MODELS[provider][complexity];
  const cost = COSTS_PER_1K[model as keyof typeof COSTS_PER_1K] || 0.001;

  return {
    provider,
    model,
    complexity,
    estimatedCostPer1K: cost,
    reasoning: getRoutingReasoning(complexity, provider, taskType),
  };
}

/**
 * Get human-readable reasoning for the routing decision
 */
function getRoutingReasoning(
  complexity: TaskComplexity,
  provider: ModelProvider,
  taskType?: string
): string {
  if (taskType && taskType in TASK_TYPE_OVERRIDES) {
    return `Task type "${taskType}" requires ${complexity} complexity`;
  }

  switch (complexity) {
    case 'simple':
      return `Simple task routed to ${provider} for cost efficiency`;
    case 'medium':
      return `Medium complexity task using balanced model`;
    case 'complex':
      return `Complex strategic reasoning requires ${provider === 'anthropic' ? 'Claude Opus' : 'Gemini Pro'}`;
  }
}

/**
 * Estimate cost for a generation request
 */
export function estimateCost(
  inputTokens: number,
  outputTokens: number,
  model: string
): number {
  const costPer1K = COSTS_PER_1K[model as keyof typeof COSTS_PER_1K] || 0.001;
  const totalTokens = inputTokens + outputTokens;
  return (totalTokens / 1000) * costPer1K;
}

// ===========================================
// Participation Translator Specific Routing
// ===========================================

/**
 * Pre-defined routing for Participation Translator tasks
 */
export const PARTICIPATION_TASK_ROUTES = {
  // Phase 1: RAG Core
  documentParsing: { complexity: 'simple' as const, taskType: 'document_parsing' },
  embeddingGeneration: { complexity: 'simple' as const, taskType: 'embedding_generation' },
  vectorSearch: { complexity: 'simple' as const, taskType: 'vector_search' },
  patternExtraction: { complexity: 'medium' as const, taskType: 'pattern_extraction' },
  
  // Phase 2: Framework (Leo's guidance)
  frameworkApplication: { complexity: 'complex' as const, taskType: 'framework_application' },
  strategicSynthesis: { complexity: 'complex' as const, taskType: 'strategic_synthesis' },
  
  // Phase 3: Cultural Intel
  culturalAnalysis: { complexity: 'complex' as const, taskType: 'cultural_analysis' },
  trendAggregation: { complexity: 'medium' as const, taskType: 'context_assembly' },
  
  // Phase 4: Presentation
  slideGeneration: { complexity: 'medium' as const, taskType: 'context_assembly' },
  blueprintGeneration: { complexity: 'complex' as const, taskType: 'blueprint_generation' },
} as const;
