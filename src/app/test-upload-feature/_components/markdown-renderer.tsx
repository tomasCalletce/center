"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { FileText } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  title?: string;
}

export function MarkdownRenderer({ content, title = "CV Content" }: MarkdownRendererProps) {
  const processMarkdown = (text: string) => {
    // Simple markdown to HTML conversion for basic formatting
    let html = text;
    
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-4">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-4">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-4">$1</h1>');
    
    // Bold text
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>');
    
    // Italic text
    html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    html = html.replace(/_(.*?)_/g, '<em class="italic">$1</em>');
    
    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Lists
    html = html.replace(/^- (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>');
    html = html.replace(/^\* (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>');
    html = html.replace(/^\+ (.*$)/gim, '<li class="ml-4 mb-1">• $1</li>');
    
    // Numbered lists
    html = html.replace(/^\d+\. (.*$)/gim, '<li class="ml-4 mb-1 list-decimal">$1</li>');
    
    // Line breaks
    html = html.replace(/\n\n/g, '<br/><br/>');
    html = html.replace(/\n/g, '<br/>');
    
    // Code blocks (simple)
    html = html.replace(/```([^`]+)```/g, '<pre class="bg-gray-100 p-3 rounded-md my-2 overflow-x-auto"><code class="text-sm">$1</code></pre>');
    
    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');
    
    return html;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          className="prose prose-sm max-w-none text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ 
            __html: processMarkdown(content) 
          }}
        />
      </CardContent>
    </Card>
  );
} 