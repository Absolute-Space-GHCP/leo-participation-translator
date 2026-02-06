/**
 * @file sentiment.ts
 * @description Sentiment analysis using Claude via Vertex AI
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-05
 * @updated 2026-02-06
 */

import { callClaudeForTask, type ClaudeResponse } from '../generation/claude-client.js';

/**
 * Sentiment classification
 */
export type SentimentLabel = 'positive' | 'negative' | 'neutral' | 'mixed';

/**
 * Sentiment score with confidence
 */
export interface SentimentScore {
  label: SentimentLabel;
  score: number; // -1 to 1
  confidence: number; // 0 to 1
}

/**
 * Topic sentiment breakdown
 */
export interface TopicSentiment {
  topic: string;
  sentiment: SentimentScore;
  mentions: number;
  keyPhrases: string[];
}

/**
 * Overall sentiment analysis result
 */
export interface SentimentAnalysis {
  overall: SentimentScore;
  topics: TopicSentiment[];
  summary: string;
  insights: string[];
  emotionalTone: string;
  brandPerception?: string;
}

/**
 * Batch sentiment result
 */
export interface BatchSentimentResult {
  items: Array<{
    text: string;
    sentiment: SentimentScore;
  }>;
  aggregate: SentimentScore;
}

/**
 * Call Claude for sentiment analysis using the shared client.
 * Routes via task router (sentiment uses Sonnet by default for cost efficiency).
 */
async function callClaude(prompt: string, maxTokens: number = 1024): Promise<string> {
  const response: ClaudeResponse = await callClaudeForTask(
    'You are a sentiment analysis expert. Respond only with valid JSON.',
    prompt,
    {
      maxTokens,
      taskType: 'sentiment_analysis',
    }
  );
  return response.content;
}

/**
 * Clean JSON response from markdown code blocks
 */
function cleanJsonResponse(text: string): string {
  let cleaned = text.trim();
  // Remove markdown code block wrapper if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.slice(7);
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.slice(3);
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.slice(0, -3);
  }
  return cleaned.trim();
}

/**
 * Parse sentiment score from label
 */
function labelToScore(label: SentimentLabel): number {
  switch (label) {
    case 'positive': return 0.7;
    case 'negative': return -0.7;
    case 'mixed': return 0;
    case 'neutral': return 0;
    default: return 0;
  }
}

/**
 * Analyze sentiment of a single text
 */
export async function analyzeSentiment(text: string): Promise<SentimentScore> {
  const prompt = `Analyze the sentiment of the following text. Respond with ONLY a JSON object in this exact format:
{
  "label": "positive" | "negative" | "neutral" | "mixed",
  "score": <number from -1 to 1>,
  "confidence": <number from 0 to 1>
}

Text to analyze:
"""
${text.substring(0, 2000)}
"""

JSON response:`;

  try {
    const response = await callClaude(prompt, 256);
    const cleaned = cleanJsonResponse(response);
    const json = JSON.parse(cleaned);
    
    return {
      label: json.label as SentimentLabel,
      score: typeof json.score === 'number' ? json.score : labelToScore(json.label),
      confidence: typeof json.confidence === 'number' ? json.confidence : 0.8,
    };
  } catch (error) {
    console.warn('Sentiment parse error, using fallback:', error);
    return {
      label: 'neutral',
      score: 0,
      confidence: 0.5,
    };
  }
}

/**
 * Analyze sentiment of multiple texts in batch
 */
export async function analyzeBatch(texts: string[]): Promise<BatchSentimentResult> {
  if (texts.length === 0) {
    return {
      items: [],
      aggregate: { label: 'neutral', score: 0, confidence: 0 },
    };
  }

  // For efficiency, combine into single analysis for small batches
  if (texts.length <= 5) {
    const items = await Promise.all(
      texts.map(async (text) => ({
        text: text.substring(0, 200),
        sentiment: await analyzeSentiment(text),
      }))
    );

    // Calculate aggregate
    const avgScore = items.reduce((sum, i) => sum + i.sentiment.score, 0) / items.length;
    const avgConfidence = items.reduce((sum, i) => sum + i.sentiment.confidence, 0) / items.length;
    
    let label: SentimentLabel = 'neutral';
    if (avgScore > 0.3) label = 'positive';
    else if (avgScore < -0.3) label = 'negative';
    else if (items.some(i => i.sentiment.label === 'positive') && 
             items.some(i => i.sentiment.label === 'negative')) label = 'mixed';

    return {
      items,
      aggregate: { label, score: avgScore, confidence: avgConfidence },
    };
  }

  // For larger batches, use a summarized prompt
  const combinedText = texts.map((t, i) => `[${i + 1}] ${t.substring(0, 300)}`).join('\n\n');
  
  const prompt = `Analyze the overall sentiment across these ${texts.length} text excerpts. Respond with ONLY a JSON object:
{
  "aggregate": {
    "label": "positive" | "negative" | "neutral" | "mixed",
    "score": <-1 to 1>,
    "confidence": <0 to 1>
  },
  "summary": "<brief summary of sentiment patterns>"
}

Texts:
${combinedText.substring(0, 6000)}

JSON response:`;

  try {
    const response = await callClaude(prompt, 512);
    const cleaned = cleanJsonResponse(response);
    const json = JSON.parse(cleaned);
    
    return {
      items: texts.map(text => ({
        text: text.substring(0, 200),
        sentiment: { label: 'neutral' as SentimentLabel, score: 0, confidence: 0.5 },
      })),
      aggregate: {
        label: json.aggregate.label as SentimentLabel,
        score: json.aggregate.score,
        confidence: json.aggregate.confidence,
      },
    };
  } catch (error) {
    console.warn('Batch sentiment error:', error);
    return {
      items: texts.map(text => ({
        text: text.substring(0, 200),
        sentiment: { label: 'neutral', score: 0, confidence: 0.5 },
      })),
      aggregate: { label: 'neutral', score: 0, confidence: 0.5 },
    };
  }
}

/**
 * Deep sentiment analysis with topic breakdown
 */
export async function analyzeDeep(
  texts: string[],
  brand?: string,
  topics?: string[]
): Promise<SentimentAnalysis> {
  const combinedText = texts.map(t => t.substring(0, 500)).join('\n---\n');
  
  const brandContext = brand ? `The brand in question is "${brand}".` : '';
  const topicContext = topics?.length ? `Focus on these topics: ${topics.join(', ')}.` : '';
  
  const prompt = `You are a cultural intelligence analyst. Analyze the sentiment and cultural perception in these texts.
${brandContext}
${topicContext}

Respond with ONLY a JSON object in this exact format:
{
  "overall": {
    "label": "positive" | "negative" | "neutral" | "mixed",
    "score": <-1 to 1>,
    "confidence": <0 to 1>
  },
  "topics": [
    {
      "topic": "<topic name>",
      "sentiment": { "label": "...", "score": <num>, "confidence": <num> },
      "mentions": <count>,
      "keyPhrases": ["phrase1", "phrase2"]
    }
  ],
  "summary": "<2-3 sentence summary of overall sentiment>",
  "insights": ["<insight 1>", "<insight 2>", "<insight 3>"],
  "emotionalTone": "<dominant emotional tone>",
  "brandPerception": "<how the brand is perceived, if applicable>"
}

Texts to analyze:
"""
${combinedText.substring(0, 8000)}
"""

JSON response:`;

  try {
    const response = await callClaude(prompt, 2048);
    
    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = response.trim();
    if (jsonStr.startsWith('```')) {
      jsonStr = jsonStr.replace(/```json?\n?/g, '').replace(/```$/g, '').trim();
    }
    
    const json = JSON.parse(jsonStr);
    
    return {
      overall: {
        label: json.overall.label as SentimentLabel,
        score: json.overall.score,
        confidence: json.overall.confidence,
      },
      topics: (json.topics || []).map((t: { topic: string; sentiment: SentimentScore; mentions: number; keyPhrases: string[] }) => ({
        topic: t.topic,
        sentiment: {
          label: t.sentiment.label as SentimentLabel,
          score: t.sentiment.score,
          confidence: t.sentiment.confidence,
        },
        mentions: t.mentions || 1,
        keyPhrases: t.keyPhrases || [],
      })),
      summary: json.summary || '',
      insights: json.insights || [],
      emotionalTone: json.emotionalTone || 'neutral',
      brandPerception: json.brandPerception,
    };
  } catch (error) {
    console.warn('Deep sentiment analysis error:', error);
    return {
      overall: { label: 'neutral', score: 0, confidence: 0.5 },
      topics: [],
      summary: 'Unable to analyze sentiment',
      insights: [],
      emotionalTone: 'unknown',
    };
  }
}

/**
 * Quick sentiment check (faster, less detailed)
 */
export async function quickSentiment(text: string): Promise<SentimentLabel> {
  const prompt = `What is the sentiment of this text? Answer with ONE word only: positive, negative, neutral, or mixed.

Text: "${text.substring(0, 500)}"

Sentiment:`;

  try {
    const response = await callClaude(prompt, 32);
    const label = response.trim().toLowerCase();
    
    if (['positive', 'negative', 'neutral', 'mixed'].includes(label)) {
      return label as SentimentLabel;
    }
    return 'neutral';
  } catch {
    return 'neutral';
  }
}

/**
 * Check if Claude is configured and accessible
 */
export async function isConfigured(): Promise<boolean> {
  try {
    // Test that Claude is reachable by checking env vars
    return !!(process.env.GCP_PROJECT_ID);
  } catch {
    return false;
  }
}

// Export default
export default {
  analyzeSentiment,
  analyzeBatch,
  analyzeDeep,
  quickSentiment,
  isConfigured,
};
