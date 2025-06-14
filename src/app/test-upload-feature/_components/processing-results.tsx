"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Separator } from "~/components/ui/separator";
import { CheckCircle, AlertTriangle, RefreshCw, FileText, User } from "lucide-react";
import { CVProfileDisplay } from "./cv-profile-display";
import { MarkdownRenderer } from "./markdown-renderer";
import { PDFViewer } from "./pdf-viewer";
import { getUserProfile, fetchMarkdownContent } from "../_actions/get-user-profile";

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

interface ProcessingResultsProps {
  result: ProcessingResult;
}

export function ProcessingResults({ result }: ProcessingResultsProps) {
  const [profileData, setProfileData] = useState<any>(null);
  const [markdownContent, setMarkdownContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch user profile data
        const profileResponse = await getUserProfile();
        if (profileResponse.success && profileResponse.profile) {
          setProfileData(profileResponse.profile);
        } else {
          setError("Failed to load profile data");
        }

        // Fetch markdown content if available
        if (result.markdownUrl) {
          const markdownResponse = await fetchMarkdownContent(result.markdownUrl);
          if (markdownResponse.success) {
            setMarkdownContent(markdownResponse.content);
          }
        }
      } catch (err) {
        setError(`Failed to load data: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    if (result.success) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [result]);

  if (!result.success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Processing Failed
          </CardTitle>
          <CardDescription>
            The PDF processing workflow encountered an error
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="font-medium text-red-800">Error Details</div>
              <div className="text-sm text-red-600 mt-1">{result.error}</div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin" />
            Loading Results...
          </CardTitle>
          <CardDescription>
            Fetching your processed CV data
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="w-5 h-5" />
            Error Loading Results
          </CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-6 h-6" />
                Processing Complete!
              </CardTitle>
              <CardDescription>
                Your CV has been successfully processed and your profile has been updated
              </CardDescription>
            </div>
            <div className="flex gap-4 text-center">
              {result.totalPages && (
                <div>
                  <div className="text-2xl font-bold text-blue-600">{result.totalPages}</div>
                  <div className="text-xs text-muted-foreground">Pages</div>
                </div>
              )}
              {result.fieldsExtracted && (
                <div>
                  <div className="text-2xl font-bold text-green-600">{result.fieldsExtracted.length}</div>
                  <div className="text-xs text-muted-foreground">Fields</div>
                </div>
              )}
              {result.processingTime && (
                <div>
                  <div className="text-2xl font-bold text-purple-600">{result.processingTime}s</div>
                  <div className="text-xs text-muted-foreground">Time</div>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Profile Display */}
      {profileData && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5" />
            <h2 className="text-xl font-semibold">Your Professional Profile</h2>
          </div>
          <CVProfileDisplay profileData={profileData} />
        </div>
      )}

      <Separator />

      {/* Document View */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Document Views</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* PDF Viewer */}
          {result.pdfUrl && (
            <PDFViewer pdfUrl={result.pdfUrl} title="Original PDF" />
          )}
          
          {/* Markdown Renderer */}
          {markdownContent && (
            <MarkdownRenderer content={markdownContent} title="Extracted Content" />
          )}
        </div>

        {/* Fallback if only one view is available */}
        {!result.pdfUrl && markdownContent && (
          <MarkdownRenderer content={markdownContent} title="Extracted Content" />
        )}
        
        {result.pdfUrl && !markdownContent && (
          <PDFViewer pdfUrl={result.pdfUrl} title="Original PDF" />
        )}
      </div>
    </div>
  );
} 