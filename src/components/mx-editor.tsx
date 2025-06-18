"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";

interface EditorProps {
  markdown: string;
  onChange?: (markdown: string) => void;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
  placeholder?: string;
}

const EditorMdx: React.FC<EditorProps> = ({
  markdown,
  onChange,
  editorRef,
  placeholder = "Start writing...",
}) => {
  return (
    <div className="border rounded-md min-h-[200px]">
      <style jsx>{`
        :global(.mdxeditor h1) {
          font-size: 2rem;
          font-weight: bold;
          margin: 1rem 0;
        }
        :global(.mdxeditor h2) {
          font-size: 1.5rem;
          font-weight: bold;
          margin: 0.8rem 0;
        }
        :global(.mdxeditor h3) {
          font-size: 1.25rem;
          font-weight: bold;
          margin: 0.6rem 0;
        }
        :global(.mdxeditor ul) {
          list-style-type: disc;
          margin-left: 1.5rem;
        }
        :global(.mdxeditor ol) {
          list-style-type: decimal;
          margin-left: 1.5rem;
        }
      `}</style>
      <MDXEditor
        onChange={onChange}
        ref={editorRef}
        markdown={markdown}
        placeholder={placeholder}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default EditorMdx;
