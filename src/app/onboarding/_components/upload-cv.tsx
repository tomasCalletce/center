"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  FileUp,
  ArrowRight,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { saveCv } from "~/app/onboarding/_actions/save-cv";
import { toast } from "sonner";

interface UploadCVProps {
  onComplete: (triggerTask: {
    publicAccessToken: string;
    runId: string;
  }) => void;
}

export const UploadCV = ({ onComplete }: UploadCVProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const response = await saveCv(formData);

      if (!response.documentMutation) {
        throw new Error("Failed to get public access token");
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";

      onComplete({
        publicAccessToken:
          response.documentMutation.triggerTask.publicAccessToken,
        runId: response.documentMutation.triggerTask.id,
      });
    } catch (error) {
      toast.error("Upload failed");
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-md">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FileUp className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold">Upload Your CV</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          We'll analyze your skills to personalize your experience
        </p>
      </div>

      <div
        className={`
          border border-dashed rounded-md p-6 text-center cursor-pointer
          ${
            selectedFile
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/20 hover:border-muted-foreground/40"
          }
        `}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0] || null;
          handleFileChange(file);
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
          className="hidden"
        />

        {!selectedFile ? (
          <div className="py-2">
            <Upload className="w-10 h-10 mx-auto text-primary/70 mb-3" />
            <p className="text-sm font-medium mb-1">
              Drop your CV here or click to browse
            </p>
            <p className="text-xs text-muted-foreground">
              <span className="font-bold">PDF format only</span> (Max 10MB)
            </p>
          </div>
        ) : (
          <div className="py-2 flex flex-col items-center">
            <FileText className="w-8 h-8 text-primary mb-2" />
            <p className="text-sm font-medium truncate max-w-[90%]">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="w-3.5 h-3.5" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 rounded-md bg-muted/50 p-3 border border-border space-y-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <CheckCircle className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Upload your cv?</p>
              <p className="text-xs text-muted-foreground">
                We'll analyze your skills to personalize your experience.
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            isLoading={isUploading}
            className="w-full cursor-pointer"
          >
            Get Started
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 backdrop-blur-sm">
            <div className="flex-shrink-0">
              <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                <Info className="w-3 h-3 text-blue-600" />
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              By clicking "Get Started", you agree to our{" "}
              <span className="font-semibold text-blue-700 hover:text-blue-800 cursor-pointer transition-colors">
                data policies
              </span>{" "}
              and consent to CV analysis for job matching.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
