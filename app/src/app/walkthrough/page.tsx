"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Sparkles, Database, Brain, Search, FileText, Zap } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Welcome to The Participation Translator",
    subtitle: "For Jam & Leo - Johannes Leonardo",
    icon: Sparkles,
    content: (
      <div className="space-y-6">
        <p className="text-lg">
          The Participation Translator transforms <strong>"passive" advertising ideas</strong> into{" "}
          <strong>"participation-worthy" platforms</strong> by combining:
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="pt-6 text-center">
              <Database className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold">JL Institutional Memory</h4>
              <p className="text-sm text-muted-foreground">19+ presentations indexed</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="pt-6 text-center">
              <Brain className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold">8-Part Framework</h4>
              <p className="text-sm text-muted-foreground">Your strategic structure</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="pt-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold">Claude Sonnet 4.5</h4>
              <p className="text-sm text-muted-foreground">AI-powered reasoning</p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 2,
    title: "Your Knowledge Base",
    subtitle: "1,186 chunks from 23 documents",
    icon: Database,
    content: (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Indexed Clients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["196", "Adidas", "Google", "JL Internal", "MassMutual", "Oscar Mayer", "Philadelphia", "Roblox", "Uber"].map(
                  (client) => (
                    <Badge key={client} variant="secondary">
                      {client}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Document Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Presentations", "Creative Briefs", "Strategy Decks", "Influencer Plans", "Campaign Docs"].map(
                  (type) => (
                    <Badge key={type} variant="outline">
                      {type}
                    </Badge>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <p className="text-sm">
              <strong>How it works:</strong> Every slide and speaker note from your presentations has been 
              converted into searchable vectors. When you ask a question, the system finds the most 
              relevant past work to inform the response.
            </p>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: 3,
    title: "Semantic Search in Action",
    subtitle: "Finding relevant past work by meaning, not keywords",
    icon: Search,
    content: (
      <div className="space-y-6">
        <p>Unlike keyword search, semantic search understands the <em>meaning</em> of your query:</p>
        <div className="space-y-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-4">
              <p className="font-mono text-sm mb-2 text-muted-foreground">
                Query: "participation mechanics for consumer engagement"
              </p>
              <p className="text-sm">
                → Returns JL Master Toolkit content about{" "}
                <strong>"brand ideas worthy of participation"</strong> and{" "}
                <strong>"Consumer Instigation Model"</strong>
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="pt-4">
              <p className="font-mono text-sm mb-2 text-muted-foreground">
                Query: "first responder subcultures activation"
              </p>
              <p className="text-sm">
                → Returns content about <strong>"Instigator Armies"</strong> and{" "}
                <strong>"infiltrating culture"</strong>
              </p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="pt-4">
              <p className="font-mono text-sm mb-2 text-muted-foreground">
                Query: "brand credibility and cultural context"
              </p>
              <p className="text-sm">
                → Returns Philadelphia brief on <strong>brand personality</strong> and JL philosophy on{" "}
                <strong>making brands relevant</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 4,
    title: "The 8-Part Framework",
    subtitle: "Your strategic structure - invisible in output",
    icon: Brain,
    content: (
      <div className="space-y-6">
        <p>
          The framework guides generation but stays <strong>invisible</strong> in the final output.
          Leo specifically requested this - the output should flow naturally, not feel templated.
        </p>
        <div className="grid gap-2 md:grid-cols-3">
          {[
            { num: 1, name: "Cultural Context", desc: "What's happening in culture" },
            { num: 2, name: "Brand Credibility", desc: "Why the brand can play here" },
            { num: 3, name: "Shared Interest", desc: "Where brand & audience align" },
            { num: 4, name: "The Passive Trap", desc: "What to avoid" },
            { num: 5, name: "Participation Idea", desc: "The big concept" },
            { num: 6, name: "Moments & Places", desc: "Where it lives" },
            { num: 7, name: "Mechanics", desc: "How people participate" },
            { num: 8, name: "First Responders", desc: "Who activates first" },
            { num: 9, name: "Ripple Effect", desc: "How it spreads" },
          ].map((section) => (
            <Card key={section.num} className="border">
              <CardContent className="p-3">
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="shrink-0">
                    {section.num}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{section.name}</p>
                    <p className="text-xs text-muted-foreground">{section.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 5,
    title: "Two-Tier Output",
    subtitle: "Tier A (High-Level) + Tier B (Executional)",
    icon: FileText,
    content: (
      <div className="space-y-6">
        <p>Based on Leo's requirements, the system produces two types of output:</p>
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
            <CardHeader>
              <Badge className="w-fit bg-amber-500">Tier A</Badge>
              <CardTitle className="text-lg">Strategic Summary</CardTitle>
              <CardDescription>High-level narrative</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• Participation-worthy write-up</li>
                <li>• Cultural context analysis</li>
                <li>• Core insight and idea</li>
                <li>• Framework invisibly applied</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardHeader>
              <Badge className="w-fit bg-emerald-500">Tier B</Badge>
              <CardTitle className="text-lg">Participation Pack</CardTitle>
              <CardDescription>Executional recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-1">
                <li>• The Big Audacious Act</li>
                <li>• Subculture Mini-Briefs</li>
                <li>• Mechanic Deep-Dives (3-5)</li>
                <li>• Casting & Creators</li>
                <li>• Trend Hijacks (72-hour opps)</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    ),
  },
  {
    id: 6,
    title: "Ready to Try It?",
    subtitle: "Generate your first Participation Blueprint",
    icon: Sparkles,
    content: (
      <div className="space-y-6">
        <Card className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <h3 className="text-xl font-bold mb-4">Next Steps</h3>
            <ol className="space-y-3">
              <li className="flex items-start gap-2">
                <Badge className="bg-white/20 text-white shrink-0">1</Badge>
                <span>Go to <strong>/generate</strong> to start the wizard</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="bg-white/20 text-white shrink-0">2</Badge>
                <span>Enter a brand, category, and initial idea</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="bg-white/20 text-white shrink-0">3</Badge>
                <span>System retrieves relevant JL past work</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="bg-white/20 text-white shrink-0">4</Badge>
                <span>Claude applies framework to generate blueprint</span>
              </li>
              <li className="flex items-start gap-2">
                <Badge className="bg-white/20 text-white shrink-0">5</Badge>
                <span>Review, refine, export to Google Slides</span>
              </li>
            </ol>
          </CardContent>
        </Card>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" asChild>
            <a href="/generate">Start Generating →</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/upload">Upload Presentations</a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/history">View History</a>
          </Button>
        </div>
      </div>
    ),
  },
];

export default function WalkthroughPage() {
  const [currentStep, setCurrentStep] = useState(0);

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">The Participation Translator</h1>
            <p className="text-sm text-muted-foreground">Founders Walkthrough</p>
          </div>
          <Badge variant="outline" className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </Badge>
        </div>
      </header>

      {/* Progress */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex gap-1">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1 flex-1 rounded-full transition-colors ${
                index <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-2">{step.title}</h2>
          <p className="text-lg text-muted-foreground">{step.subtitle}</p>
        </div>

        <div className="mb-12">{step.content}</div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-8 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-primary" : "bg-muted hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          <Button
            onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
            disabled={currentStep === steps.length - 1}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Built for Johannes Leonardo by Charley Scholz · Powered by Claude Sonnet 4.5
        </div>
      </footer>
    </div>
  );
}
