"use client";

import dynamic from "next/dynamic";
import "@mdxeditor/editor/style.css";
import {
  MDXEditor,
  type MDXEditorMethods,
  headingsPlugin,
  listsPlugin,
  linkPlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  Separator,
} from "@mdxeditor/editor";
import { type FC, useRef } from "react";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange?: (markdown: string) => void;
  placeholder?: string;
}

const MDXEditorComponent: FC<EditorProps> = ({
  markdown,
  editorRef,
  onChange,
  placeholder,
}) => {
  const localEditorRef = useRef<MDXEditorMethods | null>(null);
  const ref = editorRef || localEditorRef;

  return (
    <div className="mdx-editor-wrapper border border-border rounded-lg overflow-hidden bg-background shadow-sm">
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .mdx-editor-wrapper .mdxeditor {
            min-height: 400px !important;
            border: none !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar {
            background-color: #fafafa !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding: 0.75rem 1rem !important;
            margin: 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-rich-text-editor {
            min-height: 350px !important;
            padding: 1.5rem !important;
            background-color: #ffffff !important;
            font-size: 15px !important;
            line-height: 1.6 !important;
          }
          .mdx-editor-wrapper .mdxeditor h1 {
            font-size: 2.25rem !important;
            font-weight: bold !important;
            line-height: 1.2 !important;
            margin: 1.5rem 0 1rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor h2 {
            font-size: 1.875rem !important;
            font-weight: bold !important;
            line-height: 1.3 !important;
            margin: 1.25rem 0 0.75rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor h3 {
            font-size: 1.5rem !important;
            font-weight: bold !important;
            line-height: 1.4 !important;
            margin: 1rem 0 0.5rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor h4 {
            font-size: 1.25rem !important;
            font-weight: bold !important;
            line-height: 1.4 !important;
            margin: 0.875rem 0 0.5rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor h5 {
            font-size: 1.125rem !important;
            font-weight: bold !important;
            line-height: 1.4 !important;
            margin: 0.75rem 0 0.5rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor h6 {
            font-size: 1rem !important;
            font-weight: bold !important;
            line-height: 1.4 !important;
            margin: 0.625rem 0 0.5rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar button {
            border-radius: 0.375rem !important;
            padding: 0.5rem !important;
            margin-right: 0.25rem !important;
            transition: all 0.15s ease !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar button:hover {
            background-color: #f1f5f9 !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar [data-state="on"] {
            background-color: #e2e8f0 !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar select {
            border-radius: 0.375rem !important;
            border: 1px solid #e2e8f0 !important;
            padding: 0.5rem !important;
            margin-right: 0.5rem !important;
          }
          .mdx-editor-wrapper .mdxeditor .mdxeditor-toolbar hr {
            margin: 0 0.5rem !important;
            border-color: #e2e8f0 !important;
          }
          .mdx-editor-wrapper .mdxeditor p {
            margin: 0.5rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor ul, .mdx-editor-wrapper .mdxeditor ol {
            margin: 0.75rem 0 !important;
            padding-left: 1.5rem !important;
          }
          .mdx-editor-wrapper .mdxeditor li {
            margin: 0.25rem 0 !important;
          }
          .mdx-editor-wrapper .mdxeditor blockquote {
            border-left: 4px solid #e2e8f0 !important;
            margin: 1rem 0 !important;
            padding-left: 1rem !important;
            color: #64748b !important;
          }
          .mdx-editor-wrapper .mdxeditor strong {
            font-weight: 600 !important;
          }
          .mdx-editor-wrapper .mdxeditor em {
            font-style: italic !important;
          }
          .mdx-editor-wrapper .mdxeditor a {
            color: #3b82f6 !important;
            text-decoration: underline !important;
          }
        `,
        }}
      />
      <MDXEditor
        onChange={onChange || (() => {})}
        ref={ref}
        markdown={markdown}
        placeholder={placeholder || "Write your content..."}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <BoldItalicUnderlineToggles />
                <Separator />
                <ListsToggle />
                <Separator />
                <BlockTypeSelect />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
};

export const SimpleEditor = dynamic(() => Promise.resolve(MDXEditorComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-[200px] w-full border rounded-md bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  ),
});
