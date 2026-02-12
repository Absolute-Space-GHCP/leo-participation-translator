"use client";

/**
 * @file page.tsx
 * @description Option A: "The Clean Sheet" — single page, one form, streaming results
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useGeneration } from "@/lib/use-generation";
import type { ProjectSeed } from "@/lib/types";

export default function OptionAPage() {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [seed, setSeed] = useState<ProjectSeed>({
    brand: "",
    category: "",
    passiveIdea: "",
    audience: "",
    budget: "",
    timeline: "",
    context: "",
  });

  const gen = useGeneration();

  function updateSeed(field: keyof ProjectSeed, value: string): void {
    setSeed((prev) => ({ ...prev, [field]: value }));
  }

  function handleGenerate(): void {
    if (!seed.brand || !seed.category || !seed.passiveIdea || !seed.audience) return;
    gen.generate(seed);
  }

  function handleCopy(): void {
    navigator.clipboard.writeText(gen.output);
  }

  function handleDownload(): void {
    const blob = new Blob([gen.output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${seed.brand.toLowerCase().replace(/\s+/g, "-")}-blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const isGenerating = gen.step !== "idle" && gen.step !== "complete" && gen.step !== "error";
  const hasOutput = gen.output.length > 0;
  const canGenerate =
    seed.brand && seed.category && seed.passiveIdea && seed.audience && !isGenerating;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span className="font-semibold">The Participation Translator</span>
            <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400">
              Option A
            </Badge>
          </div>
          {gen.step === "complete" && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-1 h-3 w-3" /> Download
              </Button>
              <Button variant="outline" size="sm" onClick={gen.reset}>
                <RotateCcw className="mr-1 h-3 w-3" /> New
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-8">
        {/* Input Form */}
        {gen.step === "idle" && (
          <Card>
            <CardHeader>
              <CardTitle>Generate a Participation Blueprint</CardTitle>
              <CardDescription>
                Enter a passive advertising idea and we&apos;ll transform it into a
                participation-worthy platform using JL&apos;s institutional knowledge and
                real-time cultural intelligence.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand Name *</Label>
                  <Input
                    id="brand"
                    placeholder="e.g. Volkswagen"
                    value={seed.brand}
                    onChange={(e) => updateSeed("brand", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category / Industry *</Label>
                  <Input
                    id="category"
                    placeholder="e.g. Automotive"
                    value={seed.category}
                    onChange={(e) => updateSeed("category", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="audience">Target Audience *</Label>
                <Input
                  id="audience"
                  placeholder="e.g. Millennials and Gen Z urban professionals"
                  value={seed.audience}
                  onChange={(e) => updateSeed("audience", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="idea">The Passive Idea *</Label>
                <Textarea
                  id="idea"
                  placeholder="Describe the traditional advertising concept you want to transform into a participation-worthy platform..."
                  rows={4}
                  value={seed.passiveIdea}
                  onChange={(e) => updateSeed("passiveIdea", e.target.value)}
                />
              </div>

              {/* Advanced Options */}
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              >
                {showAdvanced ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
                Additional options
              </button>

              {showAdvanced && (
                <div className="space-y-4 rounded-lg border p-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="budget">Budget Range</Label>
                      <Input
                        id="budget"
                        placeholder="e.g. $500K - $1M"
                        value={seed.budget}
                        onChange={(e) => updateSeed("budget", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timeline">Timeline</Label>
                      <Input
                        id="timeline"
                        placeholder="e.g. Q3 2026 launch"
                        value={seed.timeline}
                        onChange={(e) => updateSeed("timeline", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="context">Additional Context</Label>
                    <Textarea
                      id="context"
                      placeholder="Any additional brand considerations, past campaigns, or strategic direction..."
                      rows={3}
                      value={seed.context}
                      onChange={(e) => updateSeed("context", e.target.value)}
                    />
                  </div>
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="w-full bg-rose-600 hover:bg-rose-700"
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Participation Blueprint
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Generation Status */}
        {isGenerating && !hasOutput && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-rose-500" />
              <p className="text-lg font-medium">{gen.statusMessage}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {gen.step === "retrieving" && "Searching 1,000+ indexed chunks..."}
                {gen.step === "cultural" && "Querying Exa.ai + Tavily..."}
                {gen.step === "assembling" && "Building strategic prompt..."}
                {gen.step === "generating" && "Claude is writing..."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Streaming Output */}
        {hasOutput && (
          <>
            {isGenerating && (
              <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>{gen.statusMessage}</span>
              </div>
            )}
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                  {gen.output}
                </div>
              </CardContent>
            </Card>
            {gen.metadata && (
              <>
                <Separator className="my-4" />
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <span>Model: {gen.metadata.model}</span>
                  <span>
                    Tokens: {gen.metadata.usage.inputTokens.toLocaleString()} in +{" "}
                    {gen.metadata.usage.outputTokens.toLocaleString()} out
                  </span>
                  <span>
                    Duration: {(gen.metadata.durationMs / 1000).toFixed(1)}s
                  </span>
                </div>
              </>
            )}
          </>
        )}

        {/* Error */}
        {gen.step === "error" && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="py-8 text-center">
              <p className="mb-2 font-medium text-red-600 dark:text-red-400">
                Generation failed
              </p>
              <p className="mb-4 text-sm text-red-500">{gen.error}</p>
              <Button variant="outline" onClick={gen.reset}>
                <RotateCcw className="mr-1 h-3 w-3" /> Try Again
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Catchfire. All rights reserved.</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          The Participation Translator &middot; Built by Charley Scholz
        </p>
      </footer>
    </div>
  );
}
