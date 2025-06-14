"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "~/components/ui/button";

interface PDFViewerProps {
  pdfUrl: string;
  title?: string;
}

export function PDFViewer({ pdfUrl, title = "Original PDF" }: PDFViewerProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {title}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="w-4 h-4 mr-1" />
                Download
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Open
              </a>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="w-full h-[600px] rounded-b-lg overflow-hidden">
          <iframe
            src={`${pdfUrl}#view=FitH`}
            className="w-full h-full border-0"
            title="PDF Viewer"
          />
        </div>
      </CardContent>
    </Card>
  );
} 