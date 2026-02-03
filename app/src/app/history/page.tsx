/**
 * @file history/page.tsx
 * @description History page showing past generations
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, FileSliders, Clock } from "lucide-react";

// Mock data - will be replaced with Firestore data
const mockGenerations = [
  {
    id: "1",
    brandName: "Volkswagen",
    category: "Automotive",
    createdAt: "2026-02-03T14:30:00Z",
    status: "complete",
  },
  {
    id: "2",
    brandName: "Adidas",
    category: "Sportswear",
    createdAt: "2026-02-02T10:15:00Z",
    status: "complete",
  },
];

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-rose-500" />
              <span className="font-semibold">Generation History</span>
            </div>
          </div>
          <Link href="/generate">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              New Generation
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        {mockGenerations.length === 0 ? (
          <div className="text-center py-16">
            <FileSliders className="h-12 w-12 mx-auto text-zinc-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No generations yet</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6">
              Start by creating your first Participation Blueprint
            </p>
            <Link href="/generate">
              <Button>Create Your First Blueprint</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockGenerations.map((gen) => (
              <Link key={gen.id} href={`/history/${gen.id}`}>
                <Card className="hover:border-rose-300 dark:hover:border-rose-700 transition-colors cursor-pointer">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{gen.brandName}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{gen.category}</Badge>
                        <span className="text-xs">
                          {new Date(gen.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </CardDescription>
                    </div>
                    <Badge
                      variant={gen.status === "complete" ? "default" : "secondary"}
                      className={gen.status === "complete" ? "bg-green-100 text-green-700" : ""}
                    >
                      {gen.status}
                    </Badge>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
