"use client";

import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Badge } from "~/components/ui/badge";
import { Upload, FileText, CheckCircle, AlertCircle, Clock, Brain, Database, User } from "lucide-react";
import { testUploadPdf } from "../_actions/test-upload-pdf";
import { ProcessingResults } from "./processing-results";

interface ProcessingStage {
  name: string;
  icon: React.ReactNode;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  result?: any;
}

interface ProcessingResult {
  success: boolean;
  pdfUrl?: string;
  markdownUrl?: string;
  profileId?: string;
  totalPages?: number;
  fieldsExtracted?: string[];
  processingTime?: number;
  stages: {
    upload: { status: 'success' | 'failed'; message?: string };
    split: { status: 'success' | 'failed'; totalPages?: number; message?: string };
    llmProcessing: { status: 'success' | 'failed'; pagesProcessed?: number; message?: string };
    markdownGeneration: { status: 'success' | 'failed'; markdownUrl?: string; message?: string };
    jsonExtraction: { status: 'success' | 'failed'; fieldsExtracted?: number; message?: string };
    profileUpdate: { status: 'success' | 'failed'; profileId?: string; message?: string };
  };
  error?: string;
}

export function TestUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [stages, setStages] = useState<ProcessingStage[]>([
    {
      name: "Upload PDF",
      icon: <Upload className="w-5 h-5" />,
      status: 'pending',
      description: "Uploading PDF to blob storage"
    },
    {
      name: "Split to Images", 
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
      description: "Converting PDF pages to images"
    },
    {
      name: "AI Processing",
      icon: <Brain className="w-5 h-5" />,
      status: 'pending', 
      description: "Extracting text using AI vision"
    },
    {
      name: "Generate Markdown",
      icon: <FileText className="w-5 h-5" />,
      status: 'pending',
      description: "Creating consolidated markdown"
    },
    {
      name: "Extract Structure",
      icon: <Database className="w-5 h-5" />,
      status: 'pending',
      description: "Extracting structured data"
    },
    {
      name: "Update Profile",
      icon: <User className="w-5 h-5" />,
      status: 'pending',
      description: "Updating user profile"
    }
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setProcessingResult(null);
      // Reset stages
      setStages(stages.map(stage => ({ ...stage, status: 'pending' as const })));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsProcessing(true);
    setProcessingResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate real-time stage updates
      const stageOrder = ['upload', 'split', 'llmProcessing', 'markdownGeneration', 'jsonExtraction', 'profileUpdate'];
      let currentStageIndex = 0;

      // Start processing
      setStages(prev => prev.map((stage, idx) => 
        idx === 0 ? { ...stage, status: 'processing' } : stage
      ));

      const result = await testUploadPdf(formData);

      if (result.success) {
        // Update stages based on result
        const newStages = [...stages];
        
        Object.entries(result.stages).forEach(([stageKey, stageResult], index) => {
          if (index < newStages.length) {
            if (stageResult.status === 'success') {
              newStages[index] = { 
                name: newStages[index]!.name,
                icon: newStages[index]!.icon,
                description: newStages[index]!.description,
                status: 'completed' as const, 
                result: stageResult 
              };
            } else {
              newStages[index] = { 
                name: newStages[index]!.name,
                icon: newStages[index]!.icon,
                description: newStages[index]!.description,
                status: 'failed' as const, 
                result: stageResult 
              };
            }
          }
        });

        setStages(newStages);
        setProcessingResult(result);
      } else {
        // Handle failure
        setStages(prev => prev.map(stage => ({ ...stage, status: 'failed' })));
        setProcessingResult(result);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setStages(prev => prev.map(stage => ({ ...stage, status: 'failed' })));
      setProcessingResult({
        success: false,
        error: `Upload failed: ${error}`,
        stages: {
          upload: { status: 'failed', message: 'Upload failed' },
          split: { status: 'failed' },
          llmProcessing: { status: 'failed' },
          markdownGeneration: { status: 'failed' },
          jsonExtraction: { status: 'failed' },
          profileUpdate: { status: 'failed' }
        }
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getProgressPercentage = () => {
    const completedStages = stages.filter(stage => stage.status === 'completed').length;
    return (completedStages / stages.length) * 100;
  };

  const getStatusIcon = (status: ProcessingStage['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ProcessingStage['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 border-green-300';
      case 'processing':
        return 'bg-blue-100 border-blue-300';
      case 'failed':
        return 'bg-red-100 border-red-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload PDF Document</CardTitle>
          <CardDescription>
            Select a PDF file to process. The system will extract all information and update the user profile.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select PDF File
            </Button>
            {file && (
              <div className="text-sm text-gray-600">
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            )}
          </div>

          {file && (
            <Button
              onClick={handleUpload}
              disabled={isProcessing}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Start Processing
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Processing Status - Only show while processing */}
      {isProcessing && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Processing Your CV</CardTitle>
                <CardDescription>
                  Please wait while we analyze your document and extract your profile information
                </CardDescription>
              </div>
              <Badge variant="default">
                Processing...
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(getProgressPercentage())}%</span>
              </div>
              <Progress value={getProgressPercentage()} className="w-full" />
            </div>

            <div className="grid gap-3">
              {stages.map((stage, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${getStatusColor(stage.status)}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(stage.status)}
                      <div>
                        <div className="font-medium">{stage.name}</div>
                        <div className="text-sm text-gray-600">{stage.description}</div>
                      </div>
                    </div>
                    {stage.result && (
                      <div className="text-xs text-gray-500">
                        {stage.result.message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results - Show new component when processing is complete */}
      {processingResult && !isProcessing && (
        <ProcessingResults result={processingResult} />
      )}
    </div>
  );
} 