"use client";

/**
 * @file page.tsx
 * @description Option B: "The Guided Flow" — input page with stats bar
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Database,
  Globe,
  Brain,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { ProjectSeed } from "@/lib/types";

interface Stats {
  documentCount: number;
  chunkCount: number;
  clients: string[];
}

export default function OptionBInputPage() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
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

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  function updateSeed(field: keyof ProjectSeed, value: string): void {
    setSeed((prev) => ({ ...prev, [field]: value }));
  }

  function handleGenerate(): void {
    if (!seed.brand || !seed.category || !seed.passiveIdea || !seed.audience) return;
    // Store seed in sessionStorage and navigate to results
    sessionStorage.setItem("participationSeed", JSON.stringify(seed));
    router.push("/option-b/results");
  }

  const canGenerate = seed.brand && seed.category && seed.passiveIdea && seed.audience;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <Sparkles className="h-5 w-5 text-blue-500" />
            <span className="font-semibold">The Participation Translator</span>
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
              Option B
            </Badge>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto flex items-center justify-center gap-8 px-6 py-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>
              {stats ? (
                <>
                  <strong className="text-foreground">{stats.chunkCount.toLocaleString()}</strong> chunks
                  from <strong className="text-foreground">{stats.documentCount}</strong> documents
                </>
              ) : (
                "Loading..."
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Globe className="h-4 w-4" />
            <span>
              {stats ? (
                <>
                  <strong className="text-foreground">{stats.clients.length}</strong> clients indexed
                </>
              ) : (
                "..."
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Brain className="h-4 w-4" />
            <span>Powered by Claude via Vertex AI</span>
          </div>
        </div>
      </div>

      <main className="container mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Transform Your Idea
          </h2>
          <p className="mt-2 text-muted-foreground">
            Enter a passive advertising concept and we&apos;ll generate a
            participation-worthy platform grounded in JL&apos;s institutional knowledge.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Project Seed</CardTitle>
            <CardDescription>
              All fields marked with * are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand Name *</Label>
                <Input
                  id="brand"
                  placeholder="e.g. Adidas"
                  value={seed.brand}
                  onChange={(e) => updateSeed("brand", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category / Industry *</Label>
                <Input
                  id="category"
                  placeholder="e.g. Athletic Footwear"
                  value={seed.category}
                  onChange={(e) => updateSeed("category", e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="audience">Target Audience *</Label>
              <Input
                id="audience"
                placeholder="e.g. Gen Z sneaker enthusiasts and streetwear community"
                value={seed.audience}
                onChange={(e) => updateSeed("audience", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idea">The Passive Idea *</Label>
              <Textarea
                id="idea"
                placeholder="Describe the traditional advertising concept you want transformed..."
                rows={5}
                value={seed.passiveIdea}
                onChange={(e) => updateSeed("passiveIdea", e.target.value)}
              />
            </div>

            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              {showAdvanced ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
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
                    placeholder="Brand considerations, past campaigns, strategic direction..."
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
              className="w-full bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              Generate Blueprint
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
