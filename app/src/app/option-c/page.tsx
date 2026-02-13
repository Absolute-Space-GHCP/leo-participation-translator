"use client";

/**
 * @file page.tsx
 * @description THE PARTICIPATION TRANSLATOR — Engine Room Dashboard
 *              Full visual polish, tabbed output renderer, PDF/email export,
 *              regenerate/refine UX, and demo mode fallback.
 * @author Charley Scholz, JLIT
 * @coauthor Claude Opus 4.6, Claude Code (coding assistant), Cursor (IDE)
 * @created 2026-02-11
 * @updated 2026-02-11
 */

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  Loader2,
  Copy,
  Download,
  RotateCcw,
  Upload,
  FileText,
  X,
  AlertCircle,
  Check,
  Sparkles,
  Mail,
  RefreshCw,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { useGeneration, type GenerationStep } from "@/lib/use-generation";
import { parseOutput, getSectionsByTier, getTierCounts, type SectionTier } from "@/lib/parse-output";
import type { ProjectSeed, KnowledgeBaseStats, UploadedDocument } from "@/lib/types";
import { SAMPLE_OUTPUT, SAMPLE_SEED, DEMO_SCENARIOS } from "@/lib/sample-output";

// ── Pipeline Steps ──

const PIPELINE_STEPS = [
  { key: "retrieving", label: "RETRIEVE", short: "RAG" },
  { key: "cultural", label: "CULTURE", short: "CI" },
  { key: "assembling", label: "ASSEMBLE", short: "ASM" },
  { key: "generating", label: "GENERATE", short: "GEN" },
  { key: "complete", label: "COMPLETE", short: "OK" },
] as const;

function getStepIndex(step: GenerationStep): number {
  return PIPELINE_STEPS.findIndex((s) => s.key === step);
}

export default function EngineRoomPage() {
  const [stats, setStats] = useState<KnowledgeBaseStats | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const outputRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [seed, setSeed] = useState<ProjectSeed>({
    brand: "",
    category: "",
    passiveIdea: "",
    audience: "",
    budget: "",
    timeline: "",
    context: "",
  });

  // Active scenario (for visual highlighting)
  const [activeScenario, setActiveScenario] = useState<string | null>(null);

  // Upload state
  const [uploadedDocs, setUploadedDocs] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<SectionTier>("narrative");

  // Refine
  const [showRefine, setShowRefine] = useState(false);
  const [refineText, setRefineText] = useState("");

  // Email modal
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "success" | "error">("idle");
  const [emailError, setEmailError] = useState("");

  // Demo mode
  const [demoMode, setDemoMode] = useState(false);

  const gen = useGeneration();

  // Check for demo mode via URL param
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("demo") === "true") {
      setDemoMode(true);
    }
  }, []);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (outputRef.current && gen.step === "generating") {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [gen.output, gen.step]);

  // Parse output into sections
  const outputToRender = demoMode && gen.step === "idle" ? SAMPLE_OUTPUT : gen.output;
  const isDemoComplete = demoMode && gen.step === "idle" && outputToRender.length > 0;
  const isComplete = gen.step === "complete" || isDemoComplete;
  const sections = useMemo(() => parseOutput(outputToRender), [outputToRender]);
  const tierCounts = useMemo(() => getTierCounts(sections), [sections]);
  const activeSections = useMemo(
    () => getSectionsByTier(sections, activeTab),
    [sections, activeTab]
  );

  // Auto-switch to first tab with content during streaming
  useEffect(() => {
    if (sections.length > 0 && gen.step === "generating") {
      const firstTier = sections[0]?.tier;
      if (firstTier && firstTier !== activeTab) {
        setActiveTab(firstTier);
      }
    }
  }, [sections, gen.step, activeTab]);

  function updateSeed(field: keyof ProjectSeed, value: string): void {
    setSeed((prev) => ({ ...prev, [field]: value }));
  }

  const displayClients = stats?.clients ?? [];

  // ── File Upload ──

  const handleFileUpload = useCallback(async (file: File) => {
    setUploadError(null);
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await response.json();
      if (!response.ok) { setUploadError(data.error || "Upload failed"); return; }
      setUploadedDocs((prev) => [
        ...prev,
        { filename: data.filename, fileType: data.fileType, text: data.text, charCount: data.charCount, pageCount: data.pageCount },
      ]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }, []);

  function handleDrop(e: React.DragEvent): void {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  }

  // ── Generation ──

  function handleGenerate(): void {
    if (!seed.brand || !seed.category || !seed.passiveIdea || !seed.audience) return;
    setDemoMode(false);
    setShowRefine(false);
    setRefineText("");
    gen.generate({ ...seed, uploadedDocuments: uploadedDocs.length > 0 ? uploadedDocs : undefined });
  }

  function handleRegenerate(): void {
    setShowRefine(false);
    setRefineText("");
    gen.generate({ ...seed, uploadedDocuments: uploadedDocs.length > 0 ? uploadedDocs : undefined });
  }

  function handleRefine(): void {
    if (!refineText.trim()) return;
    gen.generate({
      ...seed,
      uploadedDocuments: uploadedDocs.length > 0 ? uploadedDocs : undefined,
      refinementNotes: refineText.trim(),
    });
    setShowRefine(false);
    setRefineText("");
  }

  function handleLoadDemo(): void {
    setSeed(SAMPLE_SEED);
    setDemoMode(true);
    setActiveTab("narrative");
  }

  // ── Copy / Download ──

  function handleCopy(): void {
    const textToCopy = activeSections.length > 0
      ? activeSections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n")
      : outputToRender;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDownloadPDF(): Promise<void> {
    const { generatePDF } = await import("@/lib/generate-pdf");
    const blob = generatePDF({ brand: seed.brand || "Blueprint", sections });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(seed.brand || "blueprint").toLowerCase().replace(/\s+/g, "-")}-participation-blueprint.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Email ──

  async function handleSendEmail(): Promise<void> {
    if (!emailAddress) return;
    setEmailSending(true);
    setEmailStatus("idle");
    try {
      const { generatePDFBase64 } = await import("@/lib/generate-pdf");
      const pdfBase64 = generatePDFBase64({ brand: seed.brand || "Blueprint", sections });
      const response = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: emailAddress, brandName: seed.brand || "Blueprint", pdfBase64 }),
      });
      const data = await response.json();
      if (!response.ok) {
        setEmailStatus("error");
        setEmailError(data.error || "Failed to send");
      } else {
        setEmailStatus("success");
        setTimeout(() => { setShowEmailModal(false); setEmailStatus("idle"); }, 2000);
      }
    } catch (error) {
      setEmailStatus("error");
      setEmailError(error instanceof Error ? error.message : "Failed to send");
    } finally {
      setEmailSending(false);
    }
  }

  const isGenerating = gen.step !== "idle" && gen.step !== "complete" && gen.step !== "error";
  const canGenerate = seed.brand && seed.category && seed.passiveIdea && seed.audience && !isGenerating;
  const currentStepIdx = getStepIndex(gen.step);
  const hasOutput = outputToRender.length > 0;

  return (
    <div className="flex h-screen flex-col overflow-hidden" style={{ background: "var(--jl-black)" }}>

      {/* ═══════════════ HEADER ═══════════════ */}
      <header className="flex-none" style={{ background: "var(--jl-black)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/40 hover:text-white/70 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="jl-title text-[13px] tracking-[0.15em]" style={{ color: "var(--jl-white)" }}>
                THE PARTICIPATION TRANSLATOR
              </h1>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white/85">
                Strategic Intelligence
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isComplete && (
              <>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-medium transition-all"
                  style={{
                    color: copied ? "var(--jl-emerald)" : "var(--jl-white)",
                    border: `1px solid ${copied ? "var(--jl-emerald)" : "rgba(255,255,255,0.15)"}`,
                  }}
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  {copied ? "COPIED" : "COPY"}
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-medium transition-all hover:border-[var(--jl-sapphire)] hover:text-[var(--jl-sapphire)]"
                  style={{ color: "var(--jl-white)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <Download className="h-3 w-3" /> PDF
                </button>
                <button
                  onClick={() => { setShowEmailModal(true); setEmailStatus("idle"); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-medium transition-all hover:border-[var(--jl-sapphire)] hover:text-[var(--jl-sapphire)]"
                  style={{ color: "var(--jl-white)", border: "1px solid rgba(255,255,255,0.15)" }}
                >
                  <Mail className="h-3 w-3" /> EMAIL
                </button>
              </>
            )}
            {isComplete && !isDemoComplete && (
              <button
                onClick={handleRegenerate}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-medium transition-all hover:border-[var(--jl-sapphire)] hover:text-[var(--jl-sapphire)]"
                style={{ color: "var(--jl-white)", border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <RefreshCw className="h-3 w-3" /> REGENERATE
              </button>
            )}
            {(gen.step !== "idle" || isDemoComplete) && (
              <button
                onClick={() => { gen.reset(); setDemoMode(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-medium text-white/80 hover:text-white transition-colors"
                style={{ border: "1px solid rgba(255,255,255,0.15)" }}
              >
                <RotateCcw className="h-3 w-3" /> RESET
              </button>
            )}
          </div>
        </div>

        {/* Pipeline Progress */}
        {gen.step !== "idle" && !isDemoComplete && (
          <div className="px-5 pb-3">
            <div className="flex items-center gap-1">
              {PIPELINE_STEPS.map((step, i) => {
                const isActive = step.key === gen.step;
                const isDone = i < currentStepIdx;
                return (
                  <div key={step.key} className="flex flex-1 items-center gap-1">
                    <div
                      className={`flex h-1.5 flex-1 rounded-full transition-all duration-700 ${isActive ? "jl-animate-glow" : ""}`}
                      style={{
                        background: isDone ? "var(--jl-sapphire)" : isActive ? "linear-gradient(90deg, var(--jl-sapphire), rgba(22,106,216,0.5))" : "rgba(255,255,255,0.06)",
                        opacity: 1,
                        transform: isDone ? "scaleY(1)" : isActive ? "scaleY(1.3)" : "scaleY(1)",
                        transformOrigin: "center",
                      }}
                    />
                    {i < PIPELINE_STEPS.length - 1 && <div className="h-px w-1" style={{ background: "rgba(255,255,255,0.06)" }} />}
                  </div>
                );
              })}
            </div>
            <div className="mt-1.5 flex items-center justify-between">
              {PIPELINE_STEPS.map((step, i) => {
                const isActive = step.key === gen.step;
                const isDone = i < currentStepIdx;
                return (
                  <span
                    key={step.key}
                    className="text-[9px] uppercase tracking-[0.15em] font-medium transition-colors"
                    style={{ color: isActive ? "var(--jl-sapphire)" : isDone ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)" }}
                  >
                    {step.label}
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════ MAIN SPLIT ═══════════════ */}
      <div className="flex flex-1 overflow-hidden">

        {/* ─────── LEFT PANEL: Command Center ─────── */}
        <div
          className="flex w-[400px] flex-none flex-col jl-scrollbar"
          style={{ background: "var(--jl-black)", borderRight: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex-none overflow-y-auto p-5 jl-scrollbar">
            <div className="space-y-4">

              {/* Knowledge Base Stats */}
              {stats && gen.step === "idle" && !isDemoComplete && (
                <div className="mb-5 flex items-baseline gap-4">
                  {[
                    { value: stats.chunkCount.toLocaleString(), label: "INDEXED CHUNKS", color: "var(--jl-sapphire)" },
                    { value: stats.documentCount.toString(), label: "DOCUMENTS", color: "var(--jl-emerald)" },
                    { value: displayClients.length.toString(), label: "CLIENTS", color: "var(--jl-gold)" },
                  ].map((stat, i) => (
                    <div
                      key={stat.label}
                      className="jl-stat-card jl-stagger-in px-3 py-2"
                      style={{
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderTop: `2px solid ${stat.color}`,
                        animationDelay: `${i * 120}ms`,
                      }}
                    >
                      <span className="jl-numeral jl-scale-pop text-2xl" style={{ color: stat.color, animationDelay: `${200 + i * 120}ms` }}>{stat.value}</span>
                      <p className="mt-0.5 text-[10px] uppercase tracking-[0.2em] text-white">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="jl-stagger-in" style={{ animationDelay: "50ms" }}>
                  <JLInput label="BRAND" placeholder="e.g. Nike" value={seed.brand} onChange={(v) => updateSeed("brand", v)} />
                </div>
                <div className="jl-stagger-in" style={{ animationDelay: "100ms" }}>
                  <JLInput label="CATEGORY" placeholder="e.g. Footwear" value={seed.category} onChange={(v) => updateSeed("category", v)} />
                </div>
              </div>

              <div className="jl-stagger-in" style={{ animationDelay: "150ms" }}>
                <JLInput label="AUDIENCE" placeholder="e.g. Gen Z sneaker culture" value={seed.audience} onChange={(v) => updateSeed("audience", v)} />
              </div>

              <div className="space-y-1.5 jl-stagger-in" style={{ animationDelay: "200ms" }}>
                <label className="text-[12px] uppercase tracking-[0.15em] font-medium" style={{ color: "rgba(22,106,216,1)" }}>THE PASSIVE IDEA</label>
                <textarea
                  placeholder="The traditional advertising concept to transform..."
                  rows={3}
                  value={seed.passiveIdea}
                  onChange={(e) => updateSeed("passiveIdea", e.target.value)}
                  className="jl-input-focus w-full resize-none border-0 border-b bg-transparent px-0 py-2 text-[15px] focus:outline-none focus:ring-0 placeholder:text-white/90"
                  style={{ color: "var(--jl-white)", borderColor: "rgba(255,255,255,0.50)" }}
                />
              </div>

              {/* Advanced Options */}
              <button
                type="button"
                onClick={() => setShowOptions(!showOptions)}
                className="text-[12px] uppercase tracking-[0.15em] text-white/95 hover:text-white transition-colors"
              >
                {showOptions ? "− HIDE OPTIONS" : "+ MORE OPTIONS"}
              </button>

              {showOptions && (
                <div className="space-y-3 jl-animate-fade-in" style={{ borderLeft: "2px solid rgba(255,255,255,0.12)", paddingLeft: "12px" }}>
                  <div className="grid grid-cols-2 gap-3">
                    <JLInput label="BUDGET" placeholder="$500K–$1M" value={seed.budget || ""} onChange={(v) => updateSeed("budget", v)} />
                    <JLInput label="TIMELINE" placeholder="Q3 2026" value={seed.timeline || ""} onChange={(v) => updateSeed("timeline", v)} />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] uppercase tracking-[0.15em] font-medium" style={{ color: "rgba(22,106,216,1)" }}>CONTEXT</label>
                    <textarea
                      placeholder="Brand considerations, past campaigns..."
                      rows={2}
                      value={seed.context}
                      onChange={(e) => updateSeed("context", e.target.value)}
                      className="jl-input-focus w-full resize-none border-0 border-b bg-transparent px-0 py-2 text-[15px] focus:outline-none focus:ring-0 placeholder:text-white/90"
                      style={{ color: "var(--jl-white)", borderColor: "rgba(255,255,255,0.50)" }}
                    />
                  </div>
                </div>
              )}

              {/* File Upload Zone */}
              <div className="space-y-2">
                <label className="text-[12px] uppercase tracking-[0.15em] font-medium" style={{ color: "rgba(22,106,216,1)" }}>REFERENCE DOCUMENTS</label>
                <div
                  className={`border border-dashed p-3 text-center transition-all ${dragOver ? "border-[var(--jl-sapphire)] bg-[rgba(22,106,216,0.05)]" : "border-white/20 hover:border-white/30"}`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <input ref={fileInputRef} type="file" accept=".pptx,.pdf,.docx,.txt,.md,.csv" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload(f); if (fileInputRef.current) fileInputRef.current.value = ""; }} className="hidden" />
                  {uploading ? (
                    <div className="flex items-center justify-center gap-2 py-1">
                      <Loader2 className="h-3 w-3 animate-spin text-white/70" />
                      <span className="text-[10px] uppercase tracking-[0.15em] text-white/70">EXTRACTING...</span>
                    </div>
                  ) : (
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="flex w-full items-center justify-center gap-2 py-1 text-white hover:text-white transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span className="text-[12px] uppercase tracking-[0.15em]">DROP OR BROWSE</span>
                    </button>
                  )}
                  <p className="mt-1 text-[11px] text-white/90 uppercase tracking-[0.1em]">PPTX &middot; PDF &middot; DOCX &middot; TXT &middot; MD</p>
                </div>

                {uploadError && (
                  <div className="flex items-start gap-2 p-2 text-[10px] jl-animate-slide-in" style={{ color: "var(--jl-ruby)", border: "1px solid var(--jl-ruby)", background: "rgba(255,65,51,0.05)" }}>
                    <AlertCircle className="mt-0.5 h-3 w-3 flex-none" /><span className="uppercase tracking-[0.1em]">{uploadError}</span>
                    <button onClick={() => setUploadError(null)} className="ml-auto flex-none"><X className="h-3 w-3" /></button>
                  </div>
                )}

                {uploadedDocs.map((doc, i) => (
                  <div key={`${doc.filename}-${i}`} className="flex items-center gap-2 p-2 jl-animate-slide-in jl-hover-lift" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                    <FileText className="h-3 w-3 flex-none" style={{ color: "var(--jl-sapphire)" }} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium" style={{ color: "var(--jl-white)" }}>{doc.filename}</p>
                      <p className="text-[11px] uppercase tracking-[0.1em] text-white/90">{doc.fileType.toUpperCase()}{doc.pageCount ? ` · ${doc.pageCount} PG` : ""} · {doc.charCount.toLocaleString()} CHARS</p>
                    </div>
                    <button onClick={() => setUploadedDocs((prev) => prev.filter((_, j) => j !== i))} className="flex-none text-white/55 hover:text-[var(--jl-ruby)] transition-colors"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>

              {/* Generate / Demo Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate}
                  className={`jl-btn-glow group w-full py-3.5 text-[13px] uppercase tracking-[0.2em] font-bold transition-all duration-300 disabled:opacity-20 disabled:cursor-not-allowed ${canGenerate && !isGenerating ? "jl-animate-glow" : ""}`}
                  style={{
                    background: canGenerate ? "linear-gradient(135deg, #1a7aef 0%, #166AD8 50%, #1260c0 100%)" : "transparent",
                    color: canGenerate ? "#fff" : "rgba(255,255,255,0.2)",
                    border: canGenerate ? "none" : "1px solid rgba(255,255,255,0.08)",
                    boxShadow: canGenerate ? "0 0 20px rgba(22,106,216,0.3)" : "none",
                  }}
                >
                  {isGenerating ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="h-3.5 w-3.5 animate-spin" /> GENERATING...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Sparkles className="h-3.5 w-3.5" /> GENERATE BLUEPRINT</span>
                  )}
                </button>

                {gen.step === "idle" && !isDemoComplete && (
                  <div className="space-y-2.5">
                    <button
                      onClick={handleLoadDemo}
                      className="w-full py-2 text-[12px] uppercase tracking-[0.15em] text-white/90 hover:text-white transition-colors"
                    >
                      LOAD SAMPLE DEMO
                    </button>
                    <div className="pt-1">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/90 mb-2">QUICK-LOAD SCENARIOS</p>
                      <div className="space-y-1.5">
                        {DEMO_SCENARIOS.map((scenario, idx) => {
                          const isActive = activeScenario === scenario.name;
                          return (
                            <button
                              key={scenario.name}
                              onClick={() => { setSeed(scenario.seed); setActiveScenario(scenario.name); setDemoMode(false); }}
                              className="jl-scenario-btn group w-full text-left rounded transition-all duration-300 jl-animate-slide-in"
                              style={{
                                animationDelay: `${idx * 80}ms`,
                                borderLeft: `3px solid ${isActive ? scenario.brandColor : `${scenario.brandColor}33`}`,
                                background: isActive ? scenario.brandColorLight : "transparent",
                                padding: "8px 10px",
                                boxShadow: isActive ? `0 0 12px ${scenario.brandColor}20` : "none",
                              }}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className="flex h-6 w-6 flex-none items-center justify-center rounded-sm text-[9px] font-black uppercase transition-all duration-300"
                                  style={{
                                    background: isActive ? scenario.brandColor : `${scenario.brandColor}20`,
                                    color: isActive ? "#fff" : `${scenario.brandColor}90`,
                                    boxShadow: isActive ? `0 0 8px ${scenario.brandColor}40` : "none",
                                  }}
                                >
                                  {scenario.icon}
                                </span>
                                <div className="min-w-0 flex-1">
                                  <span
                                    className="block text-[12px] font-semibold tracking-wide transition-colors duration-300"
                                    style={{ color: isActive ? scenario.brandColor : `${scenario.brandColor}ee` }}
                                  >
                                    {scenario.name}
                                  </span>
                                  <span className="block text-[10px] text-white/75 group-hover:text-white/90 transition-colors mt-0.5 line-clamp-1">
                                    {scenario.description}
                                  </span>
                                </div>
                                <ChevronRight
                                  className="h-3 w-3 flex-none transition-all duration-300"
                                  style={{
                                    color: isActive ? scenario.brandColor : "rgba(255,255,255,0.15)",
                                    transform: isActive ? "translateX(2px)" : "translateX(0)",
                                    opacity: isActive ? 1 : 0.5,
                                  }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ─── Context Panel ─── */}
          <div className="flex-1 overflow-y-auto border-t px-5 py-4 jl-scrollbar" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {gen.step === "idle" && !isDemoComplete && stats ? (
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "rgba(22,106,216,1)" }}>INDEXED CLIENTS</p>
                <div className="flex flex-wrap gap-1.5">
                  {displayClients.map((c) => {
                    // Highlight client tag if it matches the active scenario brand
                    const matchingScenario = DEMO_SCENARIOS.find(
                      (s) => s.seed.brand.toLowerCase() === c.toLowerCase()
                    );
                    const isHighlighted = matchingScenario && activeScenario === matchingScenario.name;
                    const tagColor = isHighlighted ? matchingScenario.brandColor : "rgba(22,106,216,1)";
                    const tagBorder = isHighlighted ? `${matchingScenario.brandColor}60` : "rgba(22,106,216,0.40)";
                    const tagBg = isHighlighted ? `${matchingScenario.brandColor}15` : "rgba(22,106,216,0.05)";

                    return (
                      <span
                        key={c}
                        className="jl-tag-hover px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] cursor-default transition-all duration-300"
                        style={{
                          color: tagColor,
                          border: `1px solid ${tagBorder}`,
                          background: tagBg,
                          boxShadow: isHighlighted ? `0 0 8px ${matchingScenario.brandColor}20` : "none",
                          transform: isHighlighted ? "scale(1.05)" : "scale(1)",
                        }}
                      >
                        {c}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : gen.chunks.length > 0 || gen.culturalResults.length > 0 ? (
              <div className="space-y-5">
                {gen.chunks.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--jl-sapphire)" }}>RETRIEVED — {gen.chunks.length} CHUNKS</p>
                    <div className="space-y-1.5">
                      {gen.chunks.map((chunk, i) => (
                        <div key={chunk.id || i} className="p-2 jl-animate-slide-in jl-hover-lift" style={{ background: "rgba(255,255,255,0.02)", borderLeft: `2px solid ${chunk.score > 0.7 ? "var(--jl-sapphire)" : chunk.score > 0.5 ? "var(--jl-gold)" : "rgba(255,255,255,0.08)"}`, animationDelay: `${i * 50}ms` }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[12px] font-medium truncate max-w-[220px]" style={{ color: "var(--jl-white)" }}>{chunk.metadata.filename || "Unknown"}</span>
                            <span className="jl-numeral text-[13px]" style={{ color: chunk.score > 0.7 ? "var(--jl-sapphire)" : chunk.score > 0.5 ? "var(--jl-gold)" : "rgba(255,255,255,0.3)" }}>{(chunk.score * 100).toFixed(0)}%</span>
                          </div>
                          {chunk.metadata.client && <span className="text-[10px] uppercase tracking-[0.15em] text-white/90">{chunk.metadata.client}</span>}
                          <p className="mt-1 text-[12px] text-white/95 line-clamp-2 leading-relaxed">{chunk.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {gen.culturalResults.length > 0 && (
                  <div>
                    <p className="mb-2 text-[11px] uppercase tracking-[0.2em] font-medium" style={{ color: "var(--jl-emerald)" }}>CULTURAL INTELLIGENCE — {gen.culturalResults.length} SIGNALS</p>
                    <div className="space-y-1.5">
                      {gen.culturalResults.map((result, i) => (
                        <div key={i} className="p-2 jl-animate-slide-in jl-hover-lift" style={{ background: "rgba(255,255,255,0.02)", borderLeft: "2px solid var(--jl-emerald)", animationDelay: `${i * 50}ms` }}>
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="text-[12px] font-medium truncate max-w-[250px]" style={{ color: "var(--jl-white)" }}>{result.title}</span>
                            <span className="text-[10px] uppercase tracking-[0.15em] text-white/90">{result.source}</span>
                          </div>
                          <span className="text-[10px] uppercase tracking-[0.15em]" style={{ color: "var(--jl-emerald)" }}>{result.sourceType}</span>
                          <p className="mt-1 text-[12px] text-white/95 line-clamp-2 leading-relaxed">{result.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : isGenerating ? (
              <div className="flex flex-col items-center justify-center py-16 jl-animate-fade-in">
                <div className="jl-ring-pulse mb-3" style={{ color: "var(--jl-sapphire)" }}>
                  <Loader2 className="h-5 w-5 animate-spin" style={{ color: "var(--jl-sapphire)" }} />
                </div>
                <p className="text-[12px] uppercase tracking-[0.2em] text-white">{gen.statusMessage}</p>
              </div>
            ) : null}

            {/* Footer */}
            <div className="mt-auto px-5 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[9px] uppercase tracking-[0.15em] text-white/70">
                &copy; {new Date().getFullYear()} Johannes Leonardo
              </p>
              <p className="mt-0.5 text-[8px] tracking-[0.1em] text-white/55">
                Built by Charley Scholz &middot; Co-authored: Claude Opus 4.6, Cursor IDE
              </p>
            </div>
          </div>
        </div>

        {/* ─────── RIGHT PANEL: Canvas ─────── */}
        <div className="flex flex-1 flex-col overflow-hidden" style={{ background: "var(--jl-white)" }}>

          {/* Tab Bar */}
          {hasOutput && sections.length > 0 && (
            <div className="flex-none flex items-center gap-6 px-10 pt-4 pb-0" style={{ borderBottom: "1px solid rgba(17,17,17,0.06)" }}>
              {tierCounts.map(({ tier, label, count }, idx) => (
                <button
                  key={tier}
                  onClick={() => setActiveTab(tier)}
                  className={`jl-tab pb-2 text-[10px] uppercase tracking-[0.15em] jl-stagger-in ${activeTab === tier ? "jl-tab-active" : ""}`}
                  style={{ color: activeTab === tier ? "var(--jl-black)" : "rgba(17,17,17,0.3)", animationDelay: `${idx * 80}ms` }}
                  disabled={count === 0}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className="ml-1.5 jl-numeral text-[9px] transition-colors duration-300"
                      style={{ color: activeTab === tier ? "var(--jl-sapphire)" : "rgba(17,17,17,0.2)" }}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Output Content */}
          {hasOutput ? (
            <div ref={outputRef} className="flex-1 overflow-y-auto px-10 py-6 jl-scrollbar-light">
              {activeSections.length > 0 ? (
                <div className="space-y-8">
                  {activeSections.map((section, idx) => (
                    <div key={section.key} className="jl-animate-slide-up" style={{ animationDelay: `${idx * 100}ms` }}>
                      <div className="jl-prose jl-body-serif text-[14px]" style={{ color: "var(--jl-black)" }}>
                        <ReactMarkdown>{section.content}</ReactMarkdown>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="jl-body-serif text-[14px] leading-[1.7] whitespace-pre-wrap" style={{ color: "var(--jl-black)" }}>
                  {outputToRender}
                </div>
              )}
              {isGenerating && (
                <span className="inline-block h-5 w-0.5 jl-cursor-blink mt-1" style={{ background: "var(--jl-sapphire)" }} />
              )}
            </div>
          ) : gen.step === "error" ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="max-w-sm p-8 text-center" style={{ border: "1px solid var(--jl-ruby)" }}>
                <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-2" style={{ color: "var(--jl-ruby)" }}>GENERATION FAILED</p>
                <p className="text-[12px] mb-4" style={{ color: "var(--jl-black)" }}>{gen.error}</p>
                <button onClick={gen.reset} className="px-4 py-2 text-[10px] uppercase tracking-[0.15em] font-bold transition-colors" style={{ background: "var(--jl-black)", color: "var(--jl-white)" }}>TRY AGAIN</button>
              </div>
            </div>
          ) : (
            <div className="jl-shimmer flex flex-1 flex-col items-center justify-center px-10 text-center">
              <p className="jl-title text-[40px] mb-4 jl-animate-slide-up" style={{ color: "var(--jl-black)", opacity: 0.06 }}>FROM PASSIVE<br />TO PARTICIPATION</p>
              <p className="text-[12px] uppercase tracking-[0.2em] jl-animate-slide-up" style={{ color: "var(--jl-black)", opacity: 0.25, animationDelay: "150ms" }}>Fill in the form. Click generate.</p>
              <p className="mt-1 text-[11px] jl-animate-slide-up" style={{ color: "var(--jl-black)", opacity: 0.15, animationDelay: "300ms" }}>RAG retrieval, cultural intelligence, and Claude&apos;s response stream in real time.</p>
            </div>
          )}

          {/* Refine Bar (after completion) */}
          {isComplete && !isDemoComplete && (
            <div className="flex-none px-10 py-3" style={{ borderTop: "1px solid rgba(17,17,17,0.06)", background: "rgba(17,17,17,0.02)" }}>
              {showRefine ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={refineText}
                    onChange={(e) => setRefineText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleRefine(); }}
                    placeholder="Make it bolder... Focus more on TikTok... Add a guerrilla activation..."
                    className="flex-1 border-0 border-b bg-transparent px-0 py-1 text-[13px] focus:outline-none focus:ring-0 placeholder:text-black/20"
                    style={{ color: "var(--jl-black)", borderColor: "rgba(17,17,17,0.1)" }}
                    autoFocus
                  />
                  <button onClick={handleRefine} disabled={!refineText.trim()} className="flex items-center gap-1 px-3 py-1.5 text-[10px] uppercase tracking-[0.15em] font-bold disabled:opacity-30 transition-all" style={{ background: "var(--jl-sapphire)", color: "#fff" }}>
                    <ChevronRight className="h-3 w-3" /> REFINE
                  </button>
                  <button onClick={() => setShowRefine(false)} className="text-black/30 hover:text-black/60 transition-colors"><X className="h-4 w-4" /></button>
                </div>
              ) : (
                <button onClick={() => setShowRefine(true)} className="flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-black/30 hover:text-black/50 transition-colors">
                  <MessageSquare className="h-3 w-3" /> REFINE THIS OUTPUT...
                </button>
              )}
            </div>
          )}

          {/* Metadata Footer */}
          {gen.metadata && (
            <div className="flex-none px-10 py-2" style={{ borderTop: "1px solid var(--jl-sapphire)", borderTopWidth: "1px", background: "rgba(17,17,17,0.02)" }}>
              <div className="flex flex-wrap gap-6">
                <MetaStat label="MODEL" value={gen.metadata.model} />
                <MetaStat label="INPUT" value={`${gen.metadata.usage.inputTokens.toLocaleString()} tk`} />
                <MetaStat label="OUTPUT" value={`${gen.metadata.usage.outputTokens.toLocaleString()} tk`} />
                <MetaStat label="DURATION" value={`${(gen.metadata.durationMs / 1000).toFixed(1)}s`} />
                {gen.contextSummary && (
                  <>
                    <MetaStat label="RAG" value={`${gen.contextSummary.institutionalCount} chunks`} />
                    <MetaStat label="CULTURAL" value={`${gen.contextSummary.culturalCount} signals`} />
                  </>
                )}
                <MetaStat label="SECTIONS" value={`${sections.length}`} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════ EMAIL MODAL ═══════════════ */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(17,17,17,0.7)" }}>
          <div className="w-full max-w-sm p-6 jl-animate-fade-in" style={{ background: "var(--jl-white)" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] uppercase tracking-[0.15em] font-bold" style={{ color: "var(--jl-black)" }}>EMAIL BLUEPRINT</h3>
              <button onClick={() => setShowEmailModal(false)} className="text-black/30 hover:text-black/60 transition-colors"><X className="h-4 w-4" /></button>
            </div>

            {emailStatus === "success" ? (
              <div className="flex items-center gap-2 py-4">
                <Check className="h-4 w-4" style={{ color: "var(--jl-emerald)" }} />
                <span className="text-[12px] font-medium" style={{ color: "var(--jl-emerald)" }}>SENT SUCCESSFULLY</span>
              </div>
            ) : (
              <>
                <p className="text-[11px] mb-3" style={{ color: "rgba(17,17,17,0.5)" }}>
                  PDF will be generated and sent as an attachment.
                </p>
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleSendEmail(); }}
                  placeholder="you@example.com"
                  className="w-full border-0 border-b bg-transparent px-0 py-2 text-[14px] focus:outline-none focus:ring-0 placeholder:text-black/20 mb-4"
                  style={{ color: "var(--jl-black)", borderColor: "rgba(17,17,17,0.15)" }}
                  autoFocus
                />
                {emailStatus === "error" && (
                  <p className="text-[10px] mb-3 uppercase tracking-[0.1em]" style={{ color: "var(--jl-ruby)" }}>{emailError}</p>
                )}
                <button
                  onClick={handleSendEmail}
                  disabled={!emailAddress || emailSending}
                  className="jl-btn-glow w-full py-2.5 text-[11px] uppercase tracking-[0.2em] font-bold disabled:opacity-30 transition-all"
                  style={{ background: "var(--jl-sapphire)", color: "#fff" }}
                >
                  {emailSending ? (
                    <span className="flex items-center justify-center gap-2"><Loader2 className="h-3 w-3 animate-spin" /> SENDING...</span>
                  ) : (
                    <span className="flex items-center justify-center gap-2"><Mail className="h-3 w-3" /> SEND PDF</span>
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-Components ──

function JLInput({ label, placeholder, value, onChange }: { label: string; placeholder: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[12px] uppercase tracking-[0.15em] font-medium" style={{ color: "rgba(22,106,216,1)" }}>{label}</label>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="jl-input-focus w-full border-0 border-b bg-transparent px-0 py-2 text-[15px] focus:outline-none focus:ring-0 placeholder:text-white/90"
        style={{ color: "var(--jl-white)", borderColor: "rgba(255,255,255,0.50)" }}
      />
    </div>
  );
}

function MetaStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[8px] uppercase tracking-[0.2em]" style={{ color: "rgba(17,17,17,0.3)" }}>{label}</span>
      <p className="jl-numeral text-[11px] mt-px" style={{ color: "var(--jl-black)" }}>{value}</p>
    </div>
  );
}
