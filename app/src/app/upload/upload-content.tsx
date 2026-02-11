"use client";

import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  FileText,
  Presentation,
  File,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FolderOpen,
  Cloud,
} from "lucide-react";

type FileStatus = "pending" | "uploading" | "processing" | "complete" | "error";

interface UploadedFile {
  file: File;
  status: FileStatus;
  progress: number;
  error?: string;
  chunks?: number;
}

const ACCEPTED_FORMATS: Record<string, { ext: string; icon: typeof File; label: string; color: string }> = {
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
    ext: ".pptx",
    icon: Presentation,
    label: "PowerPoint",
    color: "text-orange-500",
  },
  "application/vnd.ms-powerpoint": {
    ext: ".ppt",
    icon: Presentation,
    label: "PowerPoint",
    color: "text-orange-500",
  },
  "application/pdf": {
    ext: ".pdf",
    icon: FileText,
    label: "PDF",
    color: "text-red-500",
  },
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
    ext: ".docx",
    icon: FileText,
    label: "Word",
    color: "text-blue-500",
  },
  "application/msword": {
    ext: ".doc",
    icon: FileText,
    label: "Word",
    color: "text-blue-500",
  },
  "text/plain": {
    ext: ".txt",
    icon: File,
    label: "Text",
    color: "text-gray-500",
  },
};

const ACCEPT_STRING = Object.keys(ACCEPTED_FORMATS).join(",") + ",.pptx,.ppt,.pdf,.docx,.doc,.txt";

function getFileInfo(file: File) {
  const format = ACCEPTED_FORMATS[file.type];
  if (format) return format;

  const ext = file.name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pptx":
    case "ppt":
      return ACCEPTED_FORMATS["application/vnd.openxmlformats-officedocument.presentationml.presentation"];
    case "pdf":
      return ACCEPTED_FORMATS["application/pdf"];
    case "docx":
    case "doc":
      return ACCEPTED_FORMATS["application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    case "txt":
      return ACCEPTED_FORMATS["text/plain"];
    default:
      return { ext: `.${ext}`, icon: File, label: "Document", color: "text-gray-500" };
  }
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadContent() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [clientName, setClientName] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadFiles: UploadedFile[] = fileArray.map((file) => ({
      file,
      status: "pending" as FileStatus,
      progress: 0,
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length > 0) {
        addFiles(e.dataTransfer.files);
      }
    },
    [addFiles]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        addFiles(e.target.files);
      }
    },
    [addFiles]
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const processFile = async (index: number) => {
    setFiles((prev) =>
      prev.map((f, i) => (i === index ? { ...f, status: "uploading", progress: 10 } : f))
    );

    const uploadedFile = files[index];
    const formData = new FormData();
    formData.append("file", uploadedFile.file);
    formData.append("client", clientName || "Unknown");
    formData.append("campaign", campaignName || "");

    try {
      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, progress: 30 } : f))
      );

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      setFiles((prev) =>
        prev.map((f, i) => (i === index ? { ...f, status: "processing", progress: 60 } : f))
      );

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();

      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "complete", progress: 100, chunks: result.chunks }
            : f
        )
      );
    } catch (error) {
      setFiles((prev) =>
        prev.map((f, i) =>
          i === index
            ? { ...f, status: "error", error: error instanceof Error ? error.message : "Upload failed" }
            : f
        )
      );
    }
  };

  const processAllFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === "pending") {
        await processFile(i);
      }
    }
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const completeCount = files.filter((f) => f.status === "complete").length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Upload Presentations</h1>
            <p className="text-sm text-muted-foreground">Add to JL Knowledge Base</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <a href="/walkthrough">← Walkthrough</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/generate">Generate →</a>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Metadata Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Document Metadata</CardTitle>
            <CardDescription>Optional: Add context to help with retrieval</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input
                  id="client"
                  placeholder="e.g., Volkswagen, Adidas, Google"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  autoComplete="off"
                  data-form-type="other"
                />
              </div>
              <div>
                <Label htmlFor="query">Query / Idea to Transform</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Enter the passive advertising idea or concept you want to transform into a participation-worthy platform
                </p>
                <Textarea
                  id="query"
                  placeholder="e.g., A traditional TV spot showing product features and a call-to-action to visit the website. We want people to feel inspired by our brand story..."
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  autoComplete="off"
                  data-form-type="other"
                  className="min-h-[120px] resize-y"
                  rows={5}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Drop Zone */}
        <Card
          className={`mb-6 transition-all ${
            isDragging
              ? "border-primary border-2 bg-primary/5 scale-[1.02]"
              : "border-dashed border-2"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="py-12">
            <div className="text-center">
              <div
                className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                  isDragging ? "bg-primary/20" : "bg-muted"
                }`}
              >
                {isDragging ? (
                  <Cloud className="w-8 h-8 text-primary animate-bounce" />
                ) : (
                  <Upload className="w-8 h-8 text-muted-foreground" />
                )}
              </div>

              <h3 className="text-lg font-semibold mb-2">
                {isDragging ? "Drop files here" : "Drag & drop presentations"}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                or click to browse your computer
              </p>

              <div className="flex gap-2 justify-center mb-4">
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FolderOpen className="w-4 h-4 mr-2" />
                  Browse Files
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={ACCEPT_STRING}
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  { ext: ".pptx", label: "PowerPoint", color: "bg-orange-100 text-orange-700" },
                  { ext: ".pdf", label: "PDF", color: "bg-red-100 text-red-700" },
                  { ext: ".docx", label: "Word", color: "bg-blue-100 text-blue-700" },
                  { ext: ".txt", label: "Text", color: "bg-gray-100 text-gray-700" },
                ].map((format) => (
                  <Badge key={format.ext} variant="secondary" className={format.color}>
                    {format.ext}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Selected Files</CardTitle>
                <CardDescription>
                  {pendingCount} pending, {completeCount} complete
                </CardDescription>
              </div>
              {pendingCount > 0 && (
                <Button onClick={processAllFiles}>
                  <Upload className="w-4 h-4 mr-2" />
                  Process All ({pendingCount})
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((uploadedFile, index) => {
                  const info = getFileInfo(uploadedFile.file);
                  const Icon = info.icon;

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-lg border bg-card"
                    >
                      <div className={`shrink-0 ${info.color}`}>
                        <Icon className="w-8 h-8" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{uploadedFile.file.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{formatFileSize(uploadedFile.file.size)}</span>
                          <span>•</span>
                          <span>{info.label}</span>
                          {uploadedFile.chunks && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">{uploadedFile.chunks} chunks</span>
                            </>
                          )}
                        </div>

                        {(uploadedFile.status === "uploading" ||
                          uploadedFile.status === "processing") && (
                          <Progress value={uploadedFile.progress} className="mt-2 h-1" />
                        )}

                        {uploadedFile.error && (
                          <p className="text-sm text-red-500 mt-1">{uploadedFile.error}</p>
                        )}
                      </div>

                      <div className="shrink-0">
                        {uploadedFile.status === "pending" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => removeFile(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                        {uploadedFile.status === "uploading" && (
                          <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                        )}
                        {uploadedFile.status === "processing" && (
                          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
                        )}
                        {uploadedFile.status === "complete" && (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        )}
                        {uploadedFile.status === "error" && (
                          <AlertCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Tips for Best Results</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Speaker notes matter</strong> — We extract both slide content and speaker
                  notes for richer context
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Add client name</strong> — Helps filter retrieval by brand later
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Strategic decks work best</strong> — Campaign briefs, creative
                  presentations, and strategy documents are ideal
                </span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  <strong>Image-heavy slides</strong> — Slides with mostly images will have limited
                  searchable content
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          Files are processed locally and stored in the JL Knowledge Base
        </div>
      </footer>
    </div>
  );
}
