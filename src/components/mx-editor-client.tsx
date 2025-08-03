"use client";

import { useEffect, useState } from "react";
import EditorMdx from "./mx-editor";

interface EditorClientProps {
  markdown: string;
  onChange?: (markdown: string) => void;
  placeholder?: string;
}

const EditorMdxClient: React.FC<EditorClientProps> = ({
  markdown,
  onChange,
  placeholder = "Start writing...",
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-[400px] border border-muted-foreground/20 rounded-md p-4 bg-muted/5">
        <div className="animate-pulse">
          <div className="h-4 bg-muted-foreground/10 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-muted-foreground/10 rounded w-1/2 mb-3"></div>
          <div className="h-4 bg-muted-foreground/10 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  return (
    <EditorMdx
      markdown={markdown}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
};

export default EditorMdxClient;