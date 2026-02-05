/**
 * @file index.ts
 * @description Embedding generation and vector store operations using Vertex AI
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import { PredictionServiceClient } from '@google-cloud/aiplatform';
import type { DocumentChunk, DocumentMetadata } from '../parsers/types.js';

// Re-export types
export type { DocumentChunk, DocumentMetadata };

/**
 * Vector store configuration
 */
export interface VectorStoreConfig {
  /** GCP Project ID */
  projectId: string;
  
  /** GCP Region */
  region: string;
  
  /** Vector Search Index Endpoint */
  indexEndpoint?: string;
  
  /** Deployed Index ID */
  deployedIndexId?: string;
  
  /** Embedding dimensions (768 for text-embedding-005) */
  dimensions: number;
}

/**
 * A chunk with its embedding vector
 */
export interface EmbeddedChunk {
  chunk: DocumentChunk;
  embedding: number[];
  metadata: Record<string, unknown>;
}

/**
 * Search result from vector store
 */
export interface SearchResult {
  id: string;
  chunk: DocumentChunk;
  score: number;
  metadata: Record<string, unknown>;
}

// Singleton client
let predictionClient: PredictionServiceClient | null = null;

/**
 * Get or create the Vertex AI prediction client
 */
function getClient(): PredictionServiceClient {
  if (!predictionClient) {
    predictionClient = new PredictionServiceClient({
      apiEndpoint: `${process.env.GCP_REGION || 'us-central1'}-aiplatform.googleapis.com`,
    });
  }
  return predictionClient;
}

/**
 * Generate embeddings for text using Vertex AI
 * 
 * Model: text-embedding-005 (768 dimensions)
 * 
 * @param texts - Array of text strings to embed
 * @returns Array of embedding vectors
 */
export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }
  
  const client = getClient();
  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION || 'us-central1';
  const model = process.env.VERTEX_AI_EMBEDDING_MODEL || 'text-embedding-005';
  
  if (!projectId) {
    throw new Error('GCP_PROJECT_ID environment variable not set');
  }
  
  const endpoint = `projects/${projectId}/locations/${region}/publishers/google/models/${model}`;
  
  // Process in batches of 250 (API limit)
  const batchSize = 250;
  const allEmbeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    
    // Prepare instances
    const instances = batch.map(text => ({
      structValue: {
        fields: {
          content: { stringValue: text },
          task_type: { stringValue: 'RETRIEVAL_DOCUMENT' },
        },
      },
    }));
    
    try {
      const [response] = await client.predict({
        endpoint,
        instances,
      });
      
      // Extract embeddings from response
      if (response.predictions) {
        for (const prediction of response.predictions) {
          if (prediction.structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values) {
            const embedding = prediction.structValue.fields.embeddings.structValue.fields.values.listValue.values
              .map((v: { numberValue?: number }) => v.numberValue || 0);
            allEmbeddings.push(embedding);
          }
        }
      }
    } catch (error) {
      console.error('Error generating embeddings:', error);
      throw error;
    }
  }
  
  return allEmbeddings;
}

/**
 * Generate embedding for a single text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const [embedding] = await generateEmbeddings([text]);
  return embedding;
}

/**
 * Generate query embedding (optimized for retrieval)
 */
export async function generateQueryEmbedding(query: string): Promise<number[]> {
  const client = getClient();
  const projectId = process.env.GCP_PROJECT_ID;
  const region = process.env.GCP_REGION || 'us-central1';
  const model = process.env.VERTEX_AI_EMBEDDING_MODEL || 'text-embedding-005';
  
  if (!projectId) {
    throw new Error('GCP_PROJECT_ID environment variable not set');
  }
  
  const endpoint = `projects/${projectId}/locations/${region}/publishers/google/models/${model}`;
  
  const instances = [{
    structValue: {
      fields: {
        content: { stringValue: query },
        task_type: { stringValue: 'RETRIEVAL_QUERY' },
      },
    },
  }];
  
  const [response] = await client.predict({
    endpoint,
    instances,
  });
  
  if (response.predictions && response.predictions[0]) {
    const prediction = response.predictions[0];
    if (prediction.structValue?.fields?.embeddings?.structValue?.fields?.values?.listValue?.values) {
      return prediction.structValue.fields.embeddings.structValue.fields.values.listValue.values
        .map((v: { numberValue?: number }) => v.numberValue || 0);
    }
  }
  
  throw new Error('Failed to generate query embedding');
}

/**
 * Index document chunks into Firestore (for now, Vector Search later)
 * 
 * Note: Vertex AI Vector Search requires index creation via console/API
 * This function stores embeddings in Firestore as a fallback/interim solution
 * 
 * @param chunks - Document chunks to index
 * @param metadata - Document metadata to attach
 * @param config - Vector store configuration
 */
export async function indexChunks(
  chunks: DocumentChunk[],
  metadata: DocumentMetadata,
  config: VectorStoreConfig
): Promise<{ indexed: number; documentId: string }> {
  const { Firestore } = await import('@google-cloud/firestore');
  const firestore = new Firestore({
    projectId: config.projectId,
  });
  
  // Generate document ID
  const documentId = `${metadata.filename}-${Date.now()}`;
  
  // Generate embeddings for all chunks
  console.log(`Generating embeddings for ${chunks.length} chunks...`);
  const texts = chunks.map(c => c.content);
  const embeddings = await generateEmbeddings(texts);
  
  // Store document metadata first
  const docRef = firestore.collection('documents').doc(documentId);
  const docData: Record<string, unknown> = {
    filename: metadata.filename,
    fileType: metadata.fileType,
    documentType: metadata.documentType,
    chunkCount: metadata.chunkCount,
    fileSize: metadata.fileSize,
    ingestedAt: new Date(),
    status: 'indexed',
  };
  if (metadata.client) docData.client = metadata.client;
  if (metadata.campaign) docData.campaign = metadata.campaign;
  if (metadata.pageCount) docData.pageCount = metadata.pageCount;
  if (metadata.createdAt) docData.createdAt = metadata.createdAt;
  await docRef.set(docData);

  // Store chunks in batches (Firestore has payload size limits)
  const BATCH_SIZE = 50; // Safe batch size to avoid transaction limits
  
  for (let batchStart = 0; batchStart < chunks.length; batchStart += BATCH_SIZE) {
    const batch = firestore.batch();
    const batchEnd = Math.min(batchStart + BATCH_SIZE, chunks.length);
    
    for (let i = batchStart; i < batchEnd; i++) {
      const chunk = chunks[i];
      const embedding = embeddings[i];
      
      const chunkRef = firestore.collection('chunks').doc(chunk.id);
      const chunkData: Record<string, unknown> = {
        documentId,
        content: chunk.content,
        tokenCount: chunk.tokenCount,
        chunkIndex: chunk.chunkIndex,
        embedding, // Store embedding as array
        documentType: metadata.documentType,
        filename: metadata.filename,
        createdAt: new Date(),
      };
      // Only add optional fields if they have values
      if (chunk.page !== undefined) chunkData.page = chunk.page;
      if (chunk.section) chunkData.section = chunk.section;
      if (metadata.client) chunkData.client = metadata.client;
      if (metadata.campaign) chunkData.campaign = metadata.campaign;
      batch.set(chunkRef, chunkData);
    }
    
    await batch.commit();
  }
  
  console.log(`Indexed ${chunks.length} chunks for document: ${documentId}`);
  
  return { indexed: chunks.length, documentId };
}

/**
 * Search for similar documents using cosine similarity
 * 
 * Note: This is a Firestore-based implementation for development.
 * Production should use Vertex AI Vector Search for better performance.
 * 
 * @param query - Search query text
 * @param topK - Number of results to return (default: 10)
 * @param config - Vector store configuration
 * @param filters - Metadata filters (e.g., client, documentType)
 * @returns Ranked search results
 */
export async function searchSimilar(
  query: string,
  topK: number = 10,
  config: VectorStoreConfig,
  filters?: Record<string, string>
): Promise<SearchResult[]> {
  const { Firestore } = await import('@google-cloud/firestore');
  const firestore = new Firestore({
    projectId: config.projectId,
  });
  
  // Generate query embedding
  console.log('Generating query embedding...');
  const queryEmbedding = await generateQueryEmbedding(query);
  
  // Build query with filters
  let chunksQuery: FirebaseFirestore.Query = firestore.collection('chunks');
  
  if (filters) {
    if (filters.client) {
      chunksQuery = chunksQuery.where('client', '==', filters.client);
    }
    if (filters.documentType) {
      chunksQuery = chunksQuery.where('documentType', '==', filters.documentType);
    }
    if (filters.campaign) {
      chunksQuery = chunksQuery.where('campaign', '==', filters.campaign);
    }
  }
  
  // Fetch all matching chunks (Firestore doesn't support vector search natively)
  // This is inefficient for large datasets - use Vertex AI Vector Search in production
  const snapshot = await chunksQuery.limit(1000).get();
  
  // Calculate cosine similarity for each chunk
  const results: SearchResult[] = [];
  
  for (const doc of snapshot.docs) {
    const data = doc.data();
    const chunkEmbedding = data.embedding as number[];
    
    if (!chunkEmbedding || chunkEmbedding.length === 0) {
      continue;
    }
    
    const score = cosineSimilarity(queryEmbedding, chunkEmbedding);
    
    results.push({
      id: doc.id,
      chunk: {
        id: doc.id,
        content: data.content,
        tokenCount: data.tokenCount,
        chunkIndex: data.chunkIndex,
        page: data.page,
        section: data.section,
      },
      score,
      metadata: {
        client: data.client,
        campaign: data.campaign,
        documentType: data.documentType,
        filename: data.filename,
        documentId: data.documentId,
      },
    });
  }
  
  // Sort by score descending and return top K
  results.sort((a, b) => b.score - a.score);
  
  return results.slice(0, topK);
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error('Vectors must have same length');
  }
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  
  if (magnitude === 0) {
    return 0;
  }
  
  return dotProduct / magnitude;
}

/**
 * Delete chunks by document ID
 */
export async function deleteByDocument(
  documentId: string,
  config: VectorStoreConfig
): Promise<{ deleted: number }> {
  const { Firestore } = await import('@google-cloud/firestore');
  const firestore = new Firestore({
    projectId: config.projectId,
  });
  
  // Find all chunks for this document
  const snapshot = await firestore
    .collection('chunks')
    .where('documentId', '==', documentId)
    .get();
  
  // Delete in batch
  const batch = firestore.batch();
  
  for (const doc of snapshot.docs) {
    batch.delete(doc.ref);
  }
  
  // Also delete the document metadata
  batch.delete(firestore.collection('documents').doc(documentId));
  
  await batch.commit();
  
  return { deleted: snapshot.size };
}

/**
 * Get vector store stats
 */
export async function getStats(config: VectorStoreConfig): Promise<{
  documentCount: number;
  chunkCount: number;
  clients: string[];
}> {
  const { Firestore } = await import('@google-cloud/firestore');
  const firestore = new Firestore({
    projectId: config.projectId,
  });
  
  const documentsSnapshot = await firestore.collection('documents').count().get();
  const chunksSnapshot = await firestore.collection('chunks').count().get();
  
  // Get unique clients
  const clientsSnapshot = await firestore.collection('documents').select('client').get();
  const clients = [...new Set(
    clientsSnapshot.docs
      .map(d => d.data().client)
      .filter(Boolean)
  )] as string[];
  
  return {
    documentCount: documentsSnapshot.data().count,
    chunkCount: chunksSnapshot.data().count,
    clients,
  };
}
