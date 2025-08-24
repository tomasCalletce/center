"use client";

import { useState, useRef } from "react";
import {
  Upload,
  FileText,
  X,
  ArrowRight,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { toast } from "sonner";
import { saveCv } from "~/app/onboarding/_actions/save-cv";
import { api } from "~/trpc/react";

export const ProfileCVUpload = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const userProfile = api.user.getProfile.useQuery();

  const hasCV = Boolean(userProfile.data?.skills && userProfile.data.skills.length > 0);

  const handleFileChange = (file: File | null) => {
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
    } else if (file) {
      toast.error("Please select a PDF file");
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
        throw new Error("Failed to process CV");
      }

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setIsProcessing(true);
      toast.success("CV uploaded successfully! Processing in background...");
      
      setTimeout(() => {
        userProfile.refetch();
        setIsProcessing(false);
        toast.success("CV processed successfully!");
      }, 5000);

    } catch (error) {
      toast.error("Failed to upload CV. Please try again.");
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          <CardTitle className="text-base">
            {isProcessing ? "Processing CV..." : "CV Upload"}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasCV && (
          <div className="flex items-center gap-2 text-green-600 mb-4">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">CV uploaded and processed</span>
          </div>
        )}

        <div
          className={`
            border border-dashed rounded-md p-6 text-center cursor-pointer transition-colors
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
                {hasCV ? "Upload new CV" : "Drop your CV here or click to browse"}
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
          <div className="space-y-4">
            <Button
              onClick={handleUpload}
              isLoading={isUploading || isProcessing}
              className="w-full cursor-pointer"
              disabled={isUploading || isProcessing}
            >
              {isUploading ? "Uploading..." : isProcessing ? "Processing..." : "Upload & Process"}
              {!isUploading && !isProcessing && <ArrowRight className="w-4 h-4 ml-1" />}
            </Button>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/50 border border-blue-100/60 backdrop-blur-sm">
              <div className="flex-shrink-0">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                  <Info className="w-3 h-3 text-blue-600" />
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                By uploading, you consent to CV analysis for profile enhancement.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
