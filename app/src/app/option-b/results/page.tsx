"use client";

/**
 * @file page.tsx
 * @description Option B results page — generation progress + tabbed output
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Sparkles,
  Loader2,
  Copy,
  Download,
  RotateCcw,
  CheckCircle2,
  Search,
  Globe,
  Brain,
  FileText,
} from "lucide-react";
import { useGeneration } from "@/lib/use-generation";
import type { ProjectSeed } from "@/lib/types";

export default function OptionBResultsPage() {
  const router = useRouter();
  const gen = useGeneration();
  const [seed, setSeed] = useState<ProjectSeed | null>(null);
  const [started, setStarted] = useState(false);

  // Load seed from sessionStorage and start generation
  useEffect(() => {
    const stored = sessionStorage.getItem("participationSeed");
    if (!stored) {
      router.push("/option-b");
      return;
    }

    const parsed = JSON.parse(stored) as ProjectSeed;
    setSeed(parsed);

    if (!started) {
      setStarted(true);
      gen.generate(parsed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleCopy(): void {
    navigator.clipboard.writeText(gen.output);
  }

  function handleDownload(): void {
    const blob = new Blob([gen.output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(seed?.brand || "blueprint").toLowerCase().replace(/\s+/g, "-")}-blueprint.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleNewGeneration(): void {
    gen.reset();
    router.push("/option-b");
  }

  const steps = [
    { key: "retrieving", label: "Retrieve Context", icon: Search },
    { key: "cultural", label: "Cultural Intel", icon: Globe },
    { key: "assembling", label: "Assemble Prompt", icon: Brain },
    { key: "generating", label: "Generate", icon: Sparkles },
    { key: "complete", label: "Complete", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === gen.step);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/option-b" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">The Participation Translator</span>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Option B
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
              <Button variant="outline" size="sm" onClick={handleNewGeneration}>
                <RotateCcw className="mr-1 h-3 w-3" /> New
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto max-w-3xl px-6 py-8">
        {/* Seed Summary */}
        {seed && (
          <div className="mb-6 rounded-lg border bg-muted/30 p-4">
            <div className="flex flex-wrap gap-3 text-sm">
              <Badge variant="outline">{seed.brand}</Badge>
              <Badge variant="outline">{seed.category}</Badge>
              <Badge variant="outline">{seed.audience}</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {seed.passiveIdea}
            </p>
          </div>
        )}

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isActive = step.key === gen.step;
              const isDone = i < currentStepIndex;
              const isError = gen.step === "error" && i === currentStepIndex;

              return (
                <div key={step.key} className="flex flex-1 flex-col items-center gap-1">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm transition-colors ${
                      isDone
                        ? "bg-blue-600 text-white"
                        : isActive
                          ? "bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400"
                          : isError
                            ? "bg-red-100 text-red-600"
                            : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isActive && step.key !== "complete" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : isDone ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Icon className="h-4 w-4" />
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{step.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-2 h-1 rounded-full bg-muted">
            <div
              className="h-1 rounded-full bg-blue-600 transition-all duration-500"
              style={{ width: `${Math.max(0, (currentStepIndex / (steps.length - 1)) * 100)}%` }}
            />
          </div>
        </div>

        {/* Output */}
        {gen.output ? (
          <Tabs defaultValue="formatted">
            <TabsList className="mb-4">
              <TabsTrigger value="formatted">
                <FileText className="mr-1 h-3 w-3" />
                Blueprint
              </TabsTrigger>
              <TabsTrigger value="raw">Raw Output</TabsTrigger>
            </TabsList>
            <TabsContent value="formatted">
              <Card>
                <CardContent className="pt-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap">
                    {gen.output}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="raw">
              <Card>
                <CardContent className="pt-6">
                  <pre className="overflow-auto rounded-lg bg-muted p-4 text-xs">
                    {gen.output}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        ) : gen.step !== "idle" && gen.step !== "error" ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Loader2 className="mb-4 h-8 w-8 animate-spin text-blue-500" />
              <p className="text-lg font-medium">{gen.statusMessage}</p>
            </CardContent>
          </Card>
        ) : null}

        {/* Error */}
        {gen.step === "error" && (
          <Card className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30">
            <CardContent className="py-8 text-center">
              <p className="mb-2 font-medium text-red-600">Generation failed</p>
              <p className="mb-4 text-sm text-red-500">{gen.error}</p>
              <Button variant="outline" onClick={handleNewGeneration}>
                <RotateCcw className="mr-1 h-3 w-3" /> Start Over
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Metadata footer */}
        {gen.metadata && (
          <>
            <Separator className="my-4" />
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>Model: {gen.metadata.model}</span>
              <span>
                Tokens: {gen.metadata.usage.inputTokens.toLocaleString()} in +{" "}
                {gen.metadata.usage.outputTokens.toLocaleString()} out
              </span>
              <span>Duration: {(gen.metadata.durationMs / 1000).toFixed(1)}s</span>
              {gen.contextSummary && (
                <>
                  <span>RAG: {gen.contextSummary.institutionalCount} chunks</span>
                  <span>Cultural: {gen.contextSummary.culturalCount} results</span>
                </>
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Johannes Leonardo</p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          Built by Charley Scholz &middot; Co-authored: Claude Opus 4.6, Cursor IDE
        </p>
      </footer>
    </div>
  );
}
