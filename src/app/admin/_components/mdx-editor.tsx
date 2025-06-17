"use client";

import { 
  MDXEditor, 
  type MDXEditorMethods,
  // Plugins
  headingsPlugin,
  quotePlugin,
  listsPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  thematicBreakPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  sandpackPlugin,
  codeMirrorPlugin,
  directivesPlugin,
  diffSourcePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  // Toolbar components
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  StrikeThroughSupSubToggles,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  BlockTypeSelect,
  DiffSourceToggleWrapper,
  Separator,
  // Directives
  AdmonitionDirectiveDescriptor
} from "@mdxeditor/editor";
import { type FC, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import '@mdxeditor/editor/style.css';

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  onChange?: (markdown: string) => void;
}

/**
 * Full-featured MDX Editor with toolbar and plugins
 */
const MDXEditorComponent: FC<EditorProps> = ({ markdown, editorRef, onChange }) => {
  const localEditorRef = useRef<MDXEditorMethods | null>(null);
  const ref = editorRef || localEditorRef;

  // Update editor content when markdown prop changes
  useEffect(() => {
    if (ref.current && markdown !== ref.current.getMarkdown()) {
      ref.current.setMarkdown(markdown);
    }
  }, [markdown, ref]);
  return (
    <div className="mdx-editor-wrapper">
      <style dangerouslySetInnerHTML={{
        __html: `
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
        `
      }} />
      <MDXEditor
        onChange={onChange || ((e) => console.log(e))}
        ref={ref}
        markdown={markdown}
        plugins={[
        // Core text formatting
        headingsPlugin(),
        quotePlugin(),
        listsPlugin(),
        
        // Links
        linkPlugin(),
        linkDialogPlugin(),
        
        // Media
        imagePlugin({
          imageUploadHandler: async (image) => {
            // You can implement your own image upload logic here
            return Promise.resolve(`/uploads/${image.name}`);
          },
          imageAutocompleteSuggestions: [
            'https://picsum.photos/200/300',
            'https://picsum.photos/200/400',
          ]
        }),
        
        // Tables and layout
        tablePlugin(),
        thematicBreakPlugin(),
        
        // Code
        codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
        codeMirrorPlugin({ 
          codeBlockLanguages: {
            txt: 'Plain Text',
            js: 'JavaScript',
            ts: 'TypeScript',
            tsx: 'TypeScript (React)',
            jsx: 'JavaScript (React)',
            css: 'CSS',
            html: 'HTML',
            json: 'JSON',
            md: 'Markdown',
            bash: 'Bash',
            sh: 'Shell',
            python: 'Python',
            py: 'Python',
            sql: 'SQL',
            yaml: 'YAML',
            yml: 'YAML'
          }
        }),
        
        // Advanced features
        frontmatterPlugin(),
        directivesPlugin({
          directiveDescriptors: [AdmonitionDirectiveDescriptor]
        }),
        
        // Diff/Source view
        diffSourcePlugin({ 
          viewMode: 'rich-text',
          diffMarkdown: markdown 
        }),
        
        // Shortcuts
        markdownShortcutPlugin(),
        
        // Toolbar
        toolbarPlugin({
          toolbarContents: () => (
            <DiffSourceToggleWrapper>
              <UndoRedo />
              <Separator />
              <BoldItalicUnderlineToggles />
              <CodeToggle />
              <StrikeThroughSupSubToggles />
              <Separator />
              <ListsToggle />
              <Separator />
              <BlockTypeSelect />
              <Separator />
              <CreateLink />
              <InsertImage />
              <Separator />
              <InsertTable />
              <InsertThematicBreak />
              <Separator />
              <InsertCodeBlock />
            </DiffSourceToggleWrapper>
          )
        })
      ]}
    />
    </div>
  );
};

// Dynamic import with SSR disabled to prevent hydration issues
const Editor = dynamic(() => Promise.resolve(MDXEditorComponent), {
  ssr: false,
  loading: () => (
    <div className="min-h-[400px] w-full border rounded-md bg-gray-50 flex items-center justify-center">
      <div className="text-gray-500">Loading editor...</div>
    </div>
  )
});

export default Editor;