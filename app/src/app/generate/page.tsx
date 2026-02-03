/**
 * @file generate/page.tsx
 * @description Generation wizard for creating Participation Blueprints
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.5, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-03
 * @updated 2026-02-03
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ArrowRight, Sparkles, Loader2 } from "lucide-react";

interface ProjectSeed {
  brandName: string;
  category: string;
  passiveIdea: string;
  targetAudience: string;
  budget?: string;
  timeline?: string;
  additionalContext?: string;
}

const steps = [
  { id: 1, name: "Brand & Category", description: "Tell us about the brand" },
  { id: 2, name: "The Passive Idea", description: "What's the starting point?" },
  { id: 3, name: "Audience & Context", description: "Who are we reaching?" },
  { id: 4, name: "Review & Generate", description: "Confirm and create" },
];

export default function GeneratePage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [seed, setSeed] = useState<ProjectSeed>({
    brandName: "",
    category: "",
    passiveIdea: "",
    targetAudience: "",
    budget: "",
    timeline: "",
    additionalContext: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const updateSeed = (field: keyof ProjectSeed, value: string) => {
    setSeed((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Call generation API
    setTimeout(() => {
      setIsGenerating(false);
      // TODO: Navigate to results
    }, 3000);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return seed.brandName.trim() !== "" && seed.category.trim() !== "";
      case 2:
        return seed.passiveIdea.trim() !== "";
      case 3:
        return seed.targetAudience.trim() !== "";
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-black">
      {/* Header */}
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span className="font-semibold">Generate Blueprint</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 max-w-3xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`text-sm ${
                  step.id === currentStep
                    ? "text-rose-600 font-medium"
                    : step.id < currentStep
                    ? "text-zinc-600 dark:text-zinc-400"
                    : "text-zinc-400 dark:text-zinc-600"
                }`}
              >
                {step.name}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].name}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Step 1: Brand & Category */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="brandName">Brand Name *</Label>
                  <Input
                    id="brandName"
                    placeholder="e.g., Volkswagen, Adidas, Nike"
                    value={seed.brandName}
                    onChange={(e) => updateSeed("brandName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category / Industry *</Label>
                  <Input
                    id="category"
                    placeholder="e.g., Automotive, Sportswear, Technology"
                    value={seed.category}
                    onChange={(e) => updateSeed("category", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Passive Idea */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="passiveIdea">The Passive Idea *</Label>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Describe the traditional advertising approach or &quot;passive&quot; idea that needs transformation.
                  </p>
                  <Textarea
                    id="passiveIdea"
                    placeholder="e.g., A TV commercial showing the car's features and performance specifications..."
                    value={seed.passiveIdea}
                    onChange={(e) => updateSeed("passiveIdea", e.target.value)}
                    rows={5}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Audience & Context */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Target Audience *</Label>
                  <Textarea
                    id="targetAudience"
                    placeholder="e.g., Gen Z urban professionals, environmentally conscious millennials..."
                    value={seed.targetAudience}
                    onChange={(e) => updateSeed("targetAudience", e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range (optional)</Label>
                    <Input
                      id="budget"
                      placeholder="e.g., $500K - $2M"
                      value={seed.budget}
                      onChange={(e) => updateSeed("budget", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Timeline (optional)</Label>
                    <Input
                      id="timeline"
                      placeholder="e.g., Q2 2026 launch"
                      value={seed.timeline}
                      onChange={(e) => updateSeed("timeline", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalContext">Additional Context (optional)</Label>
                  <Textarea
                    id="additionalContext"
                    placeholder="Any other relevant information..."
                    value={seed.additionalContext}
                    onChange={(e) => updateSeed("additionalContext", e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <Tabs defaultValue="summary">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="options">Generation Options</TabsTrigger>
                  </TabsList>
                  <TabsContent value="summary" className="space-y-4 mt-4">
                    <div className="grid gap-4">
                      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 mb-1">Brand</p>
                        <p className="font-medium">{seed.brandName}</p>
                        <Badge className="mt-2">{seed.category}</Badge>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 mb-1">Passive Idea</p>
                        <p className="text-sm">{seed.passiveIdea}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                        <p className="text-sm text-zinc-500 mb-1">Target Audience</p>
                        <p className="text-sm">{seed.targetAudience}</p>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="options" className="space-y-4 mt-4">
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <p className="font-medium mb-2">Output Format</p>
                      <div className="flex gap-2">
                        <Badge variant="secondary">Google Slides</Badge>
                        <Badge variant="outline">PPTX</Badge>
                        <Badge variant="outline">PDF</Badge>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-900">
                      <p className="font-medium mb-2">Cultural Intelligence</p>
                      <p className="text-sm text-zinc-500">
                        Will fetch real-time trends from Exa, Tavily, and Reddit
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="bg-rose-600 hover:bg-rose-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Blueprint
                </>
              )}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
