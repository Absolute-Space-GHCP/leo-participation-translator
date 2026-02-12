/**
 * @file claude.ts
 * @description Claude API client via Vertex AI with streaming support
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { AnthropicVertex } from "@anthropic-ai/vertex-sdk";

// ── Singleton ──

let vertexClient: AnthropicVertex | null = null;

function getClient(): AnthropicVertex {
  if (!vertexClient) {
    const region = process.env.VERTEX_AI_CLAUDE_REGION || "us-east5";
    const projectId = process.env.GCP_PROJECT_ID;

    if (!projectId) {
      throw new Error("GCP_PROJECT_ID environment variable is required");
    }

    vertexClient = new AnthropicVertex({ region, projectId });
  }
  return vertexClient;
}

// ── Streaming Generation ──

/**
 * Stream a Claude response, yielding text chunks as they arrive.
 * Returns an async generator that yields text deltas.
 */
export async function* streamGeneration(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string;
    maxTokens?: number;
    temperature?: number;
  } = {}
): AsyncGenerator<
  | { type: "text"; text: string }
  | {
      type: "done";
      model: string;
      inputTokens: number;
      outputTokens: number;
    }
> {
  const client = getClient();
  const model =
    options.model ||
    process.env.VERTEX_AI_CLAUDE_MODEL ||
    "claude-sonnet-4-5-20250514";
  const maxTokens = options.maxTokens || 8192;
  const temperature = options.temperature || 0.7;

  const stream = client.messages.stream({
    model,
    max_tokens: maxTokens,
    temperature,
    system: systemPrompt,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Yield text chunks as they arrive
  for await (const event of stream) {
    if (
      event.type === "content_block_delta" &&
      event.delta.type === "text_delta"
    ) {
      yield { type: "text", text: event.delta.text };
    }
  }

  // Get final message for usage stats
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
  const model =
    options.model ||
    process.env.VERTEX_AI_CLAUDE_MODEL ||
    "claude-sonnet-4-5-20250514";
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
