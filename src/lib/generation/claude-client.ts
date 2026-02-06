/**
 * @file claude-client.ts
 * @description Claude Opus 4.6 API client via Vertex AI
 * 
 *   This is the engine that sends our assembled prompts to Claude and gets
 *   structured responses back. It handles:
 *   - Authentication via GCP (service account or ADC)
 *   - Model selection via the task router (Opus for strategy, Sonnet for simpler tasks)
 *   - Streaming support (so the UI can show real-time generation progress)
 *   - Response parsing (converting raw text into typed ParticipationBlueprint data)
 *   - Retry logic (so a temporary API hiccup doesn't lose work)
 *   - Token tracking (for cost monitoring and optimization)
 * 
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-06
 * @updated 2026-02-06
 */

import { AnthropicVertex } from '@anthropic-ai/vertex-sdk';
import { config } from 'dotenv';
import { routeTask, estimateCost, type TaskRouterConfig, type RoutingResult } from '../router/task-router.js';

// Load environment variables
config();

// ─────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────

/**
 * Options for a Claude API call
 */
export interface ClaudeCallOptions {
  /** Maximum tokens in the response (default: 8192) */
  maxTokens?: number;

  /** Temperature: 0 = deterministic, 1 = creative (default: 0.7) */
  temperature?: number;

  /** Enable streaming for real-time UI updates */
  stream?: boolean;

  /** Explicit model override (bypasses task router) */
  model?: string;

  /** Task type for routing (e.g., 'blueprint_generation') */
  taskType?: string;

  /** Callback for streaming chunks */
  onChunk?: (chunk: string) => void;

  /** Callback for streaming progress (tokens generated so far) */
  onProgress?: (tokensGenerated: number) => void;
}

/**
 * Result from a Claude API call
 */
export interface ClaudeResponse {
  /** The generated text content */
  content: string;

  /** Which model was used */
  model: string;

  /** Token usage from the API */
  usage: {
    inputTokens: number;
    outputTokens: number;
    totalTokens: number;
  };

  /** Estimated cost in USD */
  estimatedCost: number;

  /** Routing decision (if task router was used) */
  routing?: RoutingResult;

  /** How long the API call took */
  durationMs: number;

  /** Stop reason from the API */
  stopReason: string;
}

// ─────────────────────────────────────────────────
// Client Singleton
// ─────────────────────────────────────────────────

/**
 * Singleton AnthropicVertex client.
 * 
 * We reuse a single client instance because:
 * - It caches the GCP auth token (avoids re-auth on every call)
 * - The SDK handles token refresh automatically
 * - Connection pooling reduces latency on subsequent calls
 */
let vertexClient: AnthropicVertex | null = null;

function getClient(): AnthropicVertex {
  if (!vertexClient) {
    const region = process.env.VERTEX_AI_CLAUDE_REGION || 'us-east5';
    const projectId = process.env.GCP_PROJECT_ID;

    if (!projectId) {
      throw new Error(
        'GCP_PROJECT_ID environment variable is required. ' +
        'Set it in .env or export GCP_PROJECT_ID=your-project-id'
      );
    }

    vertexClient = new AnthropicVertex({
      region,
      projectId,
    });

    console.log(`🤖 Claude client initialized (region: ${region}, project: ${projectId})`);
  }

  return vertexClient;
}

// ─────────────────────────────────────────────────
// Task Router Integration
// ─────────────────────────────────────────────────

/**
 * Determine which model to use based on the task.
 * 
 * The task router analyzes the prompt content and task type to select
 * the optimal model. Blueprint generation always uses Opus (complex),
 * while simpler tasks like formatting use Haiku (cheap + fast).
 */
function selectModel(
  systemPrompt: string,
  taskType?: string,
  explicitModel?: string
): RoutingResult | null {
  // Explicit model override — bypass router
  if (explicitModel) return null;

  const routerConfig: TaskRouterConfig = {
    preferredProvider: 'anthropic',
    enableRouting: true,
    anthropicAvailable: true,
    googleAvailable: false, // Vertex SDK only supports Anthropic models
  };

  return routeTask(systemPrompt, routerConfig, taskType);
}

// ─────────────────────────────────────────────────
// Core API Call
// ─────────────────────────────────────────────────

/**
 * Call Claude via Vertex AI.
 * 
 * This is the core function that everything flows through. It:
 * 1. Selects the right model via the task router (or uses an explicit override)
 * 2. Sends the system + user prompt to Claude via the Vertex AI SDK
 * 3. Handles streaming (if enabled) by calling onChunk for each text delta
 * 4. Tracks token usage and estimates cost
 * 5. Returns structured response with content, usage, and metadata
 * 
 * @param systemPrompt - The system prompt (persona + framework + format instructions)
 * @param userPrompt - The user prompt (seed + context + task)
 * @param options - Call configuration (model, temperature, streaming, etc.)
 * @returns Structured response with content and metadata
 */
export async function callClaude(
  systemPrompt: string,
  userPrompt: string,
  options: ClaudeCallOptions = {}
): Promise<ClaudeResponse> {
  const startTime = Date.now();

  const {
    maxTokens = 8192,
    temperature = 0.7,
    stream = false,
    model: explicitModel,
    taskType,
    onChunk,
    onProgress,
  } = options;

  // ── Step 1: Select model ──
  const routing = selectModel(systemPrompt, taskType, explicitModel);
  const model = explicitModel || routing?.model || 'claude-opus-4-6';

  console.log(`🤖 Calling Claude (model: ${model}, maxTokens: ${maxTokens}, temp: ${temperature})`);
  if (routing) {
    console.log(`   Routing: ${routing.reasoning}`);
  }

  // ── Step 2: Get the client ──
  const client = getClient();

  // ── Step 3: Make the API call ──
  let content = '';
  let inputTokens = 0;
  let outputTokens = 0;
  let stopReason = 'end_turn';

  if (stream && (onChunk || onProgress)) {
    // ── Streaming mode ──
    //
    //   Streaming lets the UI show generation in real-time.
    //   Each chunk arrives as it's generated, so the user sees
    //   text appearing progressively rather than waiting for
    //   the full response. This is critical for a good UX when
    //   generation takes 30-60 seconds.
    //
    const response = client.messages.stream({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });

    let tokensGenerated = 0;

    response.on('text', (text) => {
      content += text;
      tokensGenerated++;
      if (onChunk) onChunk(text);
      if (onProgress) onProgress(tokensGenerated);
    });

    const finalMessage = await response.finalMessage();

    inputTokens = finalMessage.usage.input_tokens;
    outputTokens = finalMessage.usage.output_tokens;
    stopReason = finalMessage.stop_reason || 'end_turn';
  } else {
    // ── Non-streaming mode ──
    //
    //   Used for background generation or when streaming isn't needed.
    //   Simpler code path, waits for the full response.
    //   Includes a 5-minute timeout to prevent indefinite hangs
    //   (Vertex AI can silently hang on large maxTokens values).
    //
    const TIMEOUT_MS = 300_000; // 5 minutes
    const apiCall = client.messages.create({
      model,
      max_tokens: maxTokens,
      temperature,
      system: systemPrompt,
      messages: [
        { role: 'user', content: userPrompt },
      ],
    });

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Claude API call timed out after ${TIMEOUT_MS / 1000}s`)), TIMEOUT_MS)
    );

    const response = await Promise.race([apiCall, timeout]);

    // Extract text from content blocks
    for (const block of response.content) {
      if (block.type === 'text') {
        content += block.text;
      }
    }

    inputTokens = response.usage.input_tokens;
    outputTokens = response.usage.output_tokens;
    stopReason = response.stop_reason || 'end_turn';
  }

  // ── Step 4: Calculate cost and metadata ──
  const durationMs = Date.now() - startTime;
  const cost = estimateCost(inputTokens, outputTokens, model);

  console.log(`✅ Claude responded in ${(durationMs / 1000).toFixed(1)}s`);
  console.log(`   Tokens: ${inputTokens} in + ${outputTokens} out = ${inputTokens + outputTokens} total`);
  console.log(`   Estimated cost: $${cost.toFixed(4)}`);
  console.log(`   Stop reason: ${stopReason}`);

  return {
    content,
    model,
    usage: {
      inputTokens,
      outputTokens,
      totalTokens: inputTokens + outputTokens,
    },
    estimatedCost: cost,
    routing: routing || undefined,
    durationMs,
    stopReason,
  };
}

// ─────────────────────────────────────────────────
// Response Parsing
// ─────────────────────────────────────────────────

/**
 * Parse Claude's response into typed JSON.
 * 
 * Claude returns text that should contain JSON. This function:
 * 1. Extracts JSON from markdown code fences (if present)
 * 2. Parses the JSON
 * 3. Returns a typed result
 * 
 * If parsing fails, it returns the raw text in an error wrapper
 * so we don't lose the generation — the UI can still display it
 * and the user can manually extract value from it.
 */
export function parseClaudeResponse<T>(
  response: ClaudeResponse
): { success: true; data: T } | { success: false; rawText: string; error: string } {
  let jsonText = response.content.trim();

  // Strip markdown code fences if present
  // Claude sometimes wraps JSON in ```json ... ```
  // Handle both complete fences and truncated ones (no closing ```)
  const completeFence = jsonText.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (completeFence) {
    jsonText = completeFence[1].trim();
  } else {
    // Handle unclosed fence (truncated response hit max_tokens)
    const openFence = jsonText.match(/^```(?:json)?\s*\n?([\s\S]*)$/);
    if (openFence) {
      jsonText = openFence[1].trim();
    }
  }

  try {
    const parsed = JSON.parse(jsonText) as T;
    return { success: true, data: parsed };
  } catch (error) {
    // Don't throw — return the raw text so it's not lost
    console.warn('⚠️  Failed to parse Claude response as JSON');
    console.warn(`   Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    console.warn(`   First 200 chars: ${jsonText.substring(0, 200)}`);

    return {
      success: false,
      rawText: response.content,
      error: error instanceof Error ? error.message : 'Unknown parse error',
    };
  }
}

// ─────────────────────────────────────────────────
// Convenience Functions
// ─────────────────────────────────────────────────

/**
 * Call Claude for blueprint generation (always uses Opus).
 * 
 * This is the primary function for the Participation Translator.
 * It forces the 'blueprint_generation' task type so the router
 * always selects Opus — strategic reasoning needs the best model.
 */
export async function callClaudeForBlueprint(
  systemPrompt: string,
  userPrompt: string,
  options: Omit<ClaudeCallOptions, 'taskType'> = {}
): Promise<ClaudeResponse> {
  return callClaude(systemPrompt, userPrompt, {
    ...options,
    taskType: 'blueprint_generation',
    maxTokens: options.maxTokens || 8192,
    temperature: options.temperature || 0.7,
  });
}

/**
 * Call Claude for a simpler task (uses router to select cheaper model).
 * 
 * Used for non-strategic tasks like formatting, summarization,
 * or metadata extraction where Opus would be overkill.
 */
export async function callClaudeForTask(
  systemPrompt: string,
  userPrompt: string,
  taskType: string,
  options: Omit<ClaudeCallOptions, 'taskType'> = {}
): Promise<ClaudeResponse> {
  return callClaude(systemPrompt, userPrompt, {
    ...options,
    taskType,
  });
}

/**
 * Reset the client (for testing or re-initialization).
 */
export function resetClient(): void {
  vertexClient = null;
}
