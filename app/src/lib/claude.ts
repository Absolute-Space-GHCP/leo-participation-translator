/**
 * @file claude.ts
 * @description Claude API client with dual-mode support (Direct API + Vertex AI)
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 * @updated 2026-02-11
 */

import Anthropic from "@anthropic-ai/sdk";
import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";

// ── Types ──

type ClaudeClient = Anthropic | AnthropicVertex;

type StreamEvent =
  | { type: "text"; text: string }
  | { type: "done"; model: string; inputTokens: number; outputTokens: number };

// ── Client Selection ──

let cachedClient: ClaudeClient | null = null;
let clientMode: "direct" | "vertex" | null = null;

/**
 * Returns the appropriate Claude client based on available credentials.
 * Priority: Direct Anthropic API (ANTHROPIC_API_KEY) > Vertex AI (GCP_PROJECT_ID)
 */
function getClient(): ClaudeClient {
  if (cachedClient) return cachedClient;

  // Priority 1: Direct Anthropic API (fastest to set up, no Model Garden needed)
  if (process.env.ANTHROPIC_API_KEY) {
    cachedClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    clientMode = "direct";
    console.log("[claude] Using direct Anthropic API");
    return cachedClient;
  }

  // Priority 2: Vertex AI
  const projectId = process.env.GCP_PROJECT_ID;
  if (projectId) {
    const region = process.env.VERTEX_AI_CLAUDE_REGION || "us-east5";
    cachedClient = new AnthropicVertex({ region, projectId });
    clientMode = "vertex";
    console.log(`[claude] Using Vertex AI (project=${projectId}, region=${region})`);
    return cachedClient;
  }

  throw new Error(
    "No Claude credentials configured. Set ANTHROPIC_API_KEY for direct API or GCP_PROJECT_ID for Vertex AI."
  );
}

/**
 * Resolves the model name based on client mode and configuration.
 * Direct API and Vertex AI may use different model ID formats.
 */
function resolveModel(overrideModel?: string): string {
  if (overrideModel) return overrideModel;

  if (clientMode === "direct") {
    return process.env.CLAUDE_MODEL || "claude-sonnet-4-5-20250929";
  }

  // Vertex AI model names
  return process.env.VERTEX_AI_CLAUDE_MODEL || "claude-sonnet-4-5@20250929";
}

// ── Streaming Generation ──

/**
 * Stream a Claude response, yielding text chunks as they arrive.
 * Works with both direct Anthropic API and Vertex AI.
 */
export async function* streamGeneration(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): AsyncGenerator<StreamEvent> {
  const client = getClient();
  const model = resolveModel(options.model);
  const maxTokens = options.maxTokens || 8192;
  const temperature = options.temperature || 0.7;

  const stream = client.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield { type: "text", text: event.delta.text };
    }
  }

  const finalMessage = await stream.finalMessage();

  yield {
    type: "done",
    model,
    inputTokens: finalMessage.usage.input_tokens,
    outputTokens: finalMessage.usage.output_tokens,
  };
}

/**
 * Non-streaming Claude call (for simpler use cases).
 */
export async function generate(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): Promise<{
  content: string;
  model: string;
  inputTokens: number;
  outputTokens: number;
}> {
  const client = getClient();
  const model = resolveModel(options.model);
  const maxTokens = options.maxTokens || 8192;
  const temperature = options.temperature || 0.7;

  const response = await client.messages.create({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  let content = "";
  for (const block of response.content) {
    if (block.type === "text") {
      content += block.text;
    }
  }

  return {
    content,
    model,
    inputTokens: response.usage.input_tokens,
    outputTokens: response.usage.output_tokens,
  };
}
