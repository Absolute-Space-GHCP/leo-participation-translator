/**
 * @file embeddings.ts
 * @description Embedding generation and Firestore vector search for the demo
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { Firestore } from "@google-cloud/firestore";
import { GoogleAuth } from "google-auth-library";
import type { RetrievedChunk, KnowledgeBaseStats } from "./types";

// ── Singletons ──

let firestoreClient: Firestore | null = null;
let authClient: GoogleAuth | null = null;

function getFirestore(): Firestore {
  if (!firestoreClient) {
    firestoreClient = new Firestore({
      projectId: process.env.GCP_PROJECT_ID,
    });
  }
  return firestoreClient;
}

function getAuth(): GoogleAuth {
  if (!authClient) {
    authClient = new GoogleAuth({
      scopes: ["https://www.googleapis.com/auth/cloud-platform"],
    });
  }
  return authClient;
}

// ── Embedding Generation ──

/**
 * Generate a query embedding using Vertex AI REST API.
 * Uses RETRIEVAL_QUERY task type for optimal search performance.
 */
export async function generateQueryEmbedding(
  query: string
): Promise<number[]> {
  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION || "us-central1";
  const model = process.env.VERTEX_AI_EMBEDDING_MODEL || "text-embedding-005";

  if (!projectId) {
    throw new Error("GCP_PROJECT_ID environment variable not set");
  }

  const auth = getAuth();
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();

  const url = `https://${region}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${region}/publishers/google/models/${model}:predict`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tokenResponse.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      instances: [{ content: query, task_type: "RETRIEVAL_QUERY" }],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Vertex AI embedding error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  const embedding =
    data.predictions?.[0]?.embeddings?.values;

  if (!embedding) {
    throw new Error("No embedding returned from Vertex AI");
  }

  return embedding;
}

// ── Vector Search ──

/**
 * Cosine similarity between two vectors.
 */
function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const mag = Math.sqrt(normA) * Math.sqrt(normB);
  return mag === 0 ? 0 : dot / mag;
}

/**
 * Search the Firestore vector store for chunks similar to the query.
 * Generates a query embedding, fetches chunks, computes cosine similarity,
 * and returns the top-K results.
 */
export async function searchSimilar(
  query: string,
  topK: number = 10
): Promise<RetrievedChunk[]> {
  const firestore = getFirestore();

  // Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(query);

  // Fetch chunks from Firestore (limit 1000 for in-memory similarity)
  const snapshot = await firestore.collection("chunks").limit(1000).get();

  // Calculate similarity for each chunk
  const results: RetrievedChunk[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const chunkEmbedding = data.embedding as number[];

    if (!chunkEmbedding || chunkEmbedding.length === 0) {
      continue;
    }

    const score = cosineSimilarity(queryEmbedding, chunkEmbedding);

    results.push({
      id: doc.id,
      content: data.content,
      score,
      metadata: {
        client: data.client,
        filename: data.filename,
        documentType: data.documentType,
        campaign: data.campaign,
        page: data.page,
        section: data.section,
      },
    });
  }

  // Sort by score descending, return top K
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, topK);
}

// ── Stats ──

/**
 * Get knowledge base statistics from Firestore.
 */
export async function getStats(): Promise<KnowledgeBaseStats> {
  const firestore = getFirestore();

  const [docsSnap, chunksSnap, clientsSnap] = await Promise.all([
    firestore.collection("documents").count().get(),
    firestore.collection("chunks").count().get(),
    firestore.collection("documents").select("client").get(),
  ]);

  const clients = [
    ...new Set(
      clientsSnap.docs
        .map((d) => d.data().client)
        .filter(Boolean) as string[]
    ),
  ];

  return {
    documentCount: docsSnap.data().count,
    chunkCount: chunksSnap.data().count,
    clients,
  };
}
