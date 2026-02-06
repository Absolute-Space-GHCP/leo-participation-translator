/**
 * @file page.tsx
 * @description Landing page for The Participation Translator
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Brain, TrendingUp, FileSliders } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-rose-500" />
            <span className="font-semibold text-lg">Participation Translator</span>
          </div>
          <Badge variant="outline" className="text-xs">
            v1.0.1 Beta
          </Badge>
        </div>
      </header>

      {/* Hero */}
      <main className="container mx-auto px-6 py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300">
            Johannes Leonardo Internal Tool
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-zinc-900 via-zinc-700 to-zinc-900 dark:from-zinc-100 dark:via-zinc-300 dark:to-zinc-100 bg-clip-text text-transparent">
            Transform Ideas Into Participation-Worthy Platforms
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
            Powered by JL&apos;s institutional memory, real-time cultural intelligence, and the 8-Part Participation Framework.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/generate">
              <Button size="lg" className="gap-2">
                Start Generating
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/history">
              <Button size="lg" variant="outline">
                View History
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <Brain className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>JL Institutional Memory</CardTitle>
              <CardDescription>
                Grounded in decades of award-winning work. VW, Adidas, and more.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                RAG pipeline retrieves relevant patterns, tactics, and voice from past presentations and case studies.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <TrendingUp className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>Cultural Intelligence</CardTitle>
              <CardDescription>
                Real-time trends, subcultures, and 72-hour opportunity windows.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Dual search (Exa + Tavily), Reddit monitoring, and Claude-powered sentiment analysis.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-zinc-900/50 backdrop-blur">
            <CardHeader>
              <FileSliders className="h-10 w-10 text-rose-500 mb-2" />
              <CardTitle>Presentation Ready</CardTitle>
              <CardDescription>
                Export directly to Google Slides or PPTX. No reformatting needed.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                JL-branded templates with the full 8-Part Framework applied systematically.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Framework Preview */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-semibold mb-4">The 8-Part Participation Framework</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Cultural Context",
              "Brand Credibility",
              "Shared Interest",
              "Passive Trap",
              "Participation Idea",
              "Moments & Places",
              "Mechanics",
              "First Responders",
              "Ripple Effect"
            ].map((section, i) => (
              <Badge key={section} variant="secondary" className="text-sm">
                {i + 1}. {section}
              </Badge>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
        <div className="container mx-auto px-6 py-6 text-center text-sm text-zinc-500">
          <p>Johannes Leonardo Internal Tool &bull; Powered by Claude Opus 4.6</p>
        </div>
      </footer>
    </div>
  );
}
