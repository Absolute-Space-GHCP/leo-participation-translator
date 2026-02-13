/**
 * @file session-store.ts
 * @description Firestore-backed session logging for all user generations.
 *              Captures every input, output, and metadata for posterity,
 *              learning, and future reference.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-13
 * @updated 2026-02-13
 */

import { Firestore, FieldValue } from "@google-cloud/firestore";
import type { ProjectSeed, RetrievedChunk, CulturalResult } from "./types";

// ── Firestore Singleton ──

let firestoreClient: Firestore | null = null;

function getFirestore(): Firestore {
  if (!firestoreClient) {
    firestoreClient = new Firestore({
      projectId: process.env.GCP_PROJECT_ID,
    });
  }
  return firestoreClient;
}

// ── Types ──

/** A logged generation session stored in Firestore */
export interface GenerationSession {
  /** Auto-generated Firestore document ID */
  id?: string;
  /** User email from NextAuth session */
  userEmail: string;
  /** User display name (if available) */
  userName?: string;
  /** ISO timestamp of when the generation was initiated */
  timestamp: string;
  /** The full seed data submitted by the user */
  seed: ProjectSeed;
  /** Filenames of uploaded strategy decks / reference docs */
  uploadedDocNames: string[];
  /** The complete generated output text */
  output: string;
  /** Generation metadata */
  metadata: {
    model: string;
    inputTokens: number;
    outputTokens: number;
    durationMs: number;
  };
  /** Context retrieval summary */
  context: {
    ragChunkCount: number;
    ragTopScore: number;
    culturalResultCount: number;
    themes: string[];
  };
  /** Whether this was a refinement of a previous generation */
  isRefinement: boolean;
  /** Refinement notes (if any) */
  refinementNotes?: string;
  /** User feedback (populated later via feedback endpoint) */
  feedback?: {
    rating?: number;
    corrections?: string;
    suggestions?: string;
    feedbackTimestamp?: string;
  };
}

// ── Collection Name ──

const COLLECTION = "user-sessions";

// ── Write Operations ──

/**
 * Log a completed generation session to Firestore.
 * Called after Claude finishes streaming the full response.
 *
 * @param session - The generation session data to persist
 * @returns The Firestore document ID of the created session
 */
export async function logGenerationSession(
  session: Omit<GenerationSession, "id">
): Promise<string> {
  const firestore = getFirestore();

  const docRef = await firestore.collection(COLLECTION).add({
    ...session,
    // Ensure timestamp is set even if caller forgets
    timestamp: session.timestamp || new Date().toISOString(),
    // Index fields for efficient querying
    _userEmail: session.userEmail.toLowerCase(),
    _brand: session.seed.brand.toLowerCase(),
    _category: session.seed.category.toLowerCase(),
    _createdAt: FieldValue.serverTimestamp(),
  });

  console.log(
    `[session-store] Logged session ${docRef.id} for ${session.userEmail} (${session.seed.brand})`
  );

  return docRef.id;
}

// ── Read Operations (for future "Past Generations" UI) ──

/**
 * Get recent sessions for a specific user.
 */
export async function getUserSessions(
  userEmail: string,
  limit: number = 20
): Promise<GenerationSession[]> {
  const firestore = getFirestore();

  const snapshot = await firestore
    .collection(COLLECTION)
    .where("_userEmail", "==", userEmail.toLowerCase())
    .orderBy("_createdAt", "desc")
    .limit(limit)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GenerationSession[];
}

/**
 * Get all sessions (admin view), optionally filtered by brand.
 */
export async function getAllSessions(
  options: { brand?: string; limit?: number } = {}
): Promise<GenerationSession[]> {
  const firestore = getFirestore();
  const { brand, limit: queryLimit = 50 } = options;

  let query = firestore
    .collection(COLLECTION)
    .orderBy("_createdAt", "desc")
    .limit(queryLimit);

  if (brand) {
    query = query.where("_brand", "==", brand.toLowerCase());
  }

  const snapshot = await query.get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as GenerationSession[];
}

/**
 * Update a session with user feedback.
 */
export async function addSessionFeedback(
  sessionId: string,
  feedback: NonNullable<GenerationSession["feedback"]>
): Promise<void> {
  const firestore = getFirestore();

  await firestore.collection(COLLECTION).doc(sessionId).update({
    feedback: {
      ...feedback,
      feedbackTimestamp: new Date().toISOString(),
    },
  });

  console.log(`[session-store] Feedback added to session ${sessionId}`);
}
