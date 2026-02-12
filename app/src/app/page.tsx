"use client";

/**
 * @file page.tsx
 * @description Landing page with links to all three demo options
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 */

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles, Zap, Layout, Columns2 } from "lucide-react";

interface Stats {
  documentCount: number;
  chunkCount: number;
  clients: string[];
}

export default function LandingPage() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-rose-500" />
            <h1 className="text-xl font-bold">The Participation Translator</h1>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline">v1.2.0 Demo</Badge>
            {stats && (
              <Badge variant="secondary">
                {stats.chunkCount.toLocaleString()} chunks |{" "}
                {stats.documentCount} docs | {stats.clients.length} clients
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container mx-auto px-6 py-12 text-center">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">
          Transform Passive Ideas Into
          <br />
          <span className="text-rose-500">Participation-Worthy Platforms</span>
        </h2>
        <p className="mx-auto mb-6 max-w-2xl text-lg text-muted-foreground">
          Powered by JL&apos;s institutional knowledge ({stats?.chunkCount.toLocaleString() || "1,000+"}
          {" "}indexed chunks), real-time cultural intelligence (Exa + Tavily),
          and Claude via Vertex AI.
        </p>
        <Link href="/option-c">
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            <Sparkles className="mr-2 h-4 w-4" />
            Launch The Participation Translator
          </Button>
        </Link>
      </section>

      {/* Three Options */}
      <section className="container mx-auto px-6 pb-16">
        <h3 className="mb-6 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Choose a Demo Experience
        </h3>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {/* Option A */}
          <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                  <Zap className="h-5 w-5" />
                </div>
                <Badge>A</Badge>
              </div>
              <CardTitle>The Clean Sheet</CardTitle>
              <CardDescription>
                Single page. One form. One button. Results stream in below.
                Fastest and most reliable.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                <li>- Minimal input form</li>
                <li>- Streaming text output</li>
                <li>- Copy and download actions</li>
                <li>- Zero navigation friction</li>
              </ul>
              <Link href="/option-a">
                <Button className="w-full bg-rose-600 hover:bg-rose-700">
                  Launch Option A
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Option B */}
          <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Layout className="h-5 w-5" />
                </div>
                <Badge>B</Badge>
              </div>
              <CardTitle>The Guided Flow</CardTitle>
              <CardDescription>
                Two-page experience: input with context, then results with tabs.
                Polished and organized.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                <li>- Knowledge base stats bar</li>
                <li>- Multi-step progress states</li>
                <li>- Tabbed results display</li>
                <li>- Clean separation of input/output</li>
              </ul>
              <Link href="/option-b">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Launch Option B
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Option C */}
          <Card className="group relative overflow-hidden transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                  <Columns2 className="h-5 w-5" />
                </div>
                <Badge>C</Badge>
              </div>
              <CardTitle>The Engine Room</CardTitle>
              <CardDescription>
                Dashboard with RAG visibility. See the retrieval, context
                assembly, and generation in real time.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="mb-6 space-y-1 text-sm text-muted-foreground">
                <li>- Split-panel layout</li>
                <li>- Retrieved chunks with scores</li>
                <li>- Cultural intel preview</li>
                <li>- Full pipeline transparency</li>
              </ul>
              <Link href="/option-c">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  Launch Option C
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

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
