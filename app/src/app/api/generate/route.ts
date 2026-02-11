/**
 * @file route.ts
 * @description API endpoint for generating Participation Blueprints via Vertex AI
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-10
 */

import { NextRequest, NextResponse } from "next/server";

interface ProjectSeed {
  brandName: string;
  category: string;
  passiveIdea: string;
  targetAudience: string;
  budget?: string;
  timeline?: string;
  additionalContext?: string;
}

const SYSTEM_PROMPT = `You are a strategic creative director at Johannes Leonardo, a world-class advertising agency known for transforming passive advertising ideas into participation-worthy platforms.

Your task is to take a "passive" advertising idea and transform it into a "participation-worthy" platform using the 8-Part Participation Framework. The framework should guide your thinking but remain INVISIBLE in the output - the result should flow naturally as strategic narrative.

## The 8-Part Participation Framework (Internal Reference Only)
1. Current Cultural Context - What's happening in culture that's relevant
2. Brand Credibility - Why this brand has permission to play here
3. The Shared Interest - Where brand goals and audience passions align
4. The Passive Trap - What to avoid (traditional advertising pitfalls)
5. The Participation Worthy Idea - The big concept that invites participation
6. Moments and Places - Where and when people will encounter this
7. Mechanics of Participation - How people actually engage
8. First Responders - Who activates first and spreads the word
9. The Ripple Effect - How it grows organically

## Output Format
Produce TWO tiers of output:

### TIER A: Strategic Summary (High-Level Narrative)
A flowing strategic narrative that covers the key insights and the participation-worthy idea. This should feel like a senior strategist presenting to a client - confident, insightful, and inspiring. About 500-800 words.

### TIER B: Participation Pack (Executional Recommendations)
- **The Big Audacious Act**: One headline-grabbing activation
- **Subculture Mini-Briefs**: 2-3 specific communities to target with tailored approaches
- **Mechanic Deep-Dives**: 3-5 specific ways people can participate
- **First Responders**: Who should be activated first
- **72-Hour Opportunities**: Any time-sensitive cultural moments to hijack

Remember: Sound like Johannes Leonardo - bold, culturally-aware, strategically rigorous, and creatively ambitious. Reference past JL work patterns where relevant.`;

async function retrieveContext(query: string): Promise<string> {
  try {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const execAsync = promisify(exec);
    const { join } = await import("path");
    
    const projectRoot = join(process.cwd(), "..");
    const cmd = `cd "${projectRoot}" && npx tsx src/cli/retrieve.ts --query "${query.replace(/"/g, '\\"')}" --top-k 5 --json 2>/dev/null`;
    
    const { stdout } = await execAsync(cmd, { timeout: 30000 });
    
    const result = JSON.parse(stdout);
    if (result.results && result.results.length > 0) {
      return result.results.map((r: { content: string; source: string; score: number }) => 
        `[From ${r.source}, relevance: ${(r.score * 100).toFixed(0)}%]\n${r.content}`
      ).join("\n\n---\n\n");
    }
  } catch (error) {
    console.error("Retrieval error:", error);
  }
  
  return "No specific past work retrieved. Generate based on JL's general strategic approach.";
}

async function generateWithVertexAI(systemPrompt: string, userPrompt: string): Promise<{ text: string; model: string; tokens: number }> {
  const { exec } = await import("child_process");
  const { promisify } = await import("util");
  const { join } = await import("path");
  const { writeFile, unlink } = await import("fs/promises");
  const execAsync = promisify(exec);
  
  // Create a temporary script to call Vertex AI
  const projectRoot = join(process.cwd(), "..");
  const tempScript = join(projectRoot, "temp-generate.ts");
  
  const scriptContent = `
import { VertexAI } from "@google-cloud/vertexai";

const projectId = process.env.GCP_PROJECT_ID || "participation-translator";
const location = process.env.VERTEX_AI_CLAUDE_REGION || "us-east5";
const model = process.env.VERTEX_AI_CLAUDE_MODEL || "claude-sonnet-4-5-20250514";

const vertexAI = new VertexAI({ project: projectId, location });

const generativeModel = vertexAI.getGenerativeModel({
  model,
  systemInstruction: ${JSON.stringify(systemPrompt)},
});

async function generate() {
  const request = {
    contents: [{ role: "user", parts: [{ text: ${JSON.stringify(userPrompt)} }] }],
    generationConfig: {
      maxOutputTokens: 4096,
      temperature: 0.7,
    },
  };
  
  const response = await generativeModel.generateContent(request);
  const text = response.response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const tokens = response.response.usageMetadata?.candidatesTokenCount || 0;
  
  console.log(JSON.stringify({ text, model, tokens }));
}

generate().catch(e => {
  console.error(JSON.stringify({ error: e.message }));
  process.exit(1);
});
`;

  await writeFile(tempScript, scriptContent);
  
  try {
    const { stdout, stderr } = await execAsync(
      `cd "${projectRoot}" && npx tsx "${tempScript}"`,
      { timeout: 120000, maxBuffer: 10 * 1024 * 1024 }
    );
    
    await unlink(tempScript).catch(() => {});
    
    const result = JSON.parse(stdout.trim());
    if (result.error) throw new Error(result.error);
    return result;
  } catch (error) {
    await unlink(tempScript).catch(() => {});
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const seed: ProjectSeed = await request.json();
    
    if (!seed.brandName || !seed.passiveIdea) {
      return NextResponse.json(
        { error: "Brand name and passive idea are required" },
        { status: 400 }
      );
    }

    // Build the query for retrieval
    const retrievalQuery = `${seed.category} ${seed.passiveIdea.slice(0, 200)} participation mechanics brand activation`;
    
    // Retrieve relevant context from the knowledge base
    const context = await retrieveContext(retrievalQuery);

    // Build the user prompt
    const userPrompt = `## Project Brief

**Brand:** ${seed.brandName}
**Category:** ${seed.category}
**Target Audience:** ${seed.targetAudience}
${seed.budget ? `**Budget:** ${seed.budget}` : ""}
${seed.timeline ? `**Timeline:** ${seed.timeline}` : ""}

## The Passive Idea (To Transform)
${seed.passiveIdea}

${seed.additionalContext ? `## Additional Context\n${seed.additionalContext}` : ""}

## Relevant JL Past Work & Patterns
${context}

---

Now transform this passive idea into a participation-worthy platform. Produce both Tier A (Strategic Summary) and Tier B (Participation Pack).`;

    // Generate using Vertex AI
    const result = await generateWithVertexAI(SYSTEM_PROMPT, userPrompt);

    return NextResponse.json({
      success: true,
      blueprint: result.text,
      seed,
      model: result.model,
      usage: { input_tokens: 0, output_tokens: result.tokens },
    });
  } catch (error) {
    console.error("Generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "POST a project seed to generate a Participation Blueprint",
    requiredFields: ["brandName", "category", "passiveIdea", "targetAudience"],
    optionalFields: ["budget", "timeline", "additionalContext"],
  });
}
