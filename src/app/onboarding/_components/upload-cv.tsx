"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, FileUp, ArrowRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import { SaveCV } from "~/app/onboarding/_actions/save-cv";

export const UploadCV = () => {
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
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      await SaveCV(formData);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
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
              PDF format only (Max 10MB)
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
              className="text-gray-500 hover:text-destructive hover:bg-transparent"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
            >
              <X className="w-3.5 h-3.5 mr-1" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 rounded-md bg-muted/50 p-3 border border-border space-y-2">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Next: AI Interview</p>
              <p className="text-xs text-muted-foreground">
                We'll ask you a few questions about your experience based on
                your CV
              </p>
            </div>
          </div>
          <Button
            onClick={handleUpload}
            disabled={isUploading}
            className="w-full cursor-pointer"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
};
