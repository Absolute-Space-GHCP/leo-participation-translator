"use client";

/**
 * @file use-generation.ts
 * @description React hook for streaming generation via SSE
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { useState, useCallback, useRef } from "react";
import type {
  ProjectSeed,
  RetrievedChunk,
  CulturalResult,
  SSEDoneEvent,
} from "./types";

export type GenerationStep =
  | "idle"
  | "retrieving"
  | "cultural"
  | "assembling"
  | "generating"
  | "complete"
  | "error";

export interface GenerationState {
  step: GenerationStep;
  statusMessage: string;
  output: string;
  chunks: RetrievedChunk[];
  culturalResults: CulturalResult[];
  contextSummary: {
    institutionalCount: number;
    culturalCount: number;
    themes: string[];
  } | null;
  metadata: SSEDoneEvent | null;
  error: string | null;
}

const initialState: GenerationState = {
  step: "idle",
  statusMessage: "",
  output: "",
  chunks: [],
  culturalResults: [],
  contextSummary: null,
  metadata: null,
  error: null,
};

export function useGeneration() {
  const [state, setState] = useState<GenerationState>(initialState);
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (seed: ProjectSeed) => {
    // Reset state
    setState({ ...initialState, step: "retrieving", statusMessage: "Starting..." });

    // Create abort controller
    abortRef.current = new AbortController();

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(seed),
        signal: abortRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        setState((prev) => ({
          ...prev,
          step: "error",
          error: errorData.error || `HTTP ${response.status}`,
        }));
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setState((prev) => ({
          ...prev,
          step: "error",
          error: "No response stream",
        }));
        return;
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Parse SSE events from buffer
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        let eventType = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            eventType = line.slice(7).trim();
          } else if (line.startsWith("data: ") && eventType) {
            try {
              const data = JSON.parse(line.slice(6));

              switch (eventType) {
                case "status":
                  setState((prev) => ({
                    ...prev,
                    step: data.step as GenerationStep,
                    statusMessage: data.message,
                  }));
                  break;

                case "context":
                  setState((prev) => ({
                    ...prev,
                    chunks: data.chunks || [],
                    culturalResults: data.culturalResults || [],
                    contextSummary: data.summary || null,
                  }));
                  break;

                case "chunk":
                  setState((prev) => ({
                    ...prev,
                    output: prev.output + data.text,
                  }));
                  break;

                case "done":
                  setState((prev) => ({
                    ...prev,
                    step: "complete",
                    metadata: data,
                  }));
                  break;

                case "error":
                  setState((prev) => ({
                    ...prev,
                    step: "error",
                    error: data.message,
                  }));
                  break;
              }
            } catch {
              // Skip malformed JSON
            }
            eventType = "";
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return; // User cancelled
      }
      setState((prev) => ({
        ...prev,
        step: "error",
        error: error instanceof Error ? error.message : "Unknown error",
      }));
    }
  }, []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState(initialState);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setState((prev) => ({
      ...prev,
      step: "idle",
      statusMessage: "Cancelled",
    }));
  }, []);

  return { ...state, generate, reset, cancel };
}
