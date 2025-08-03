"use client";

import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  markdownShortcutPlugin,
  toolbarPlugin,
  imagePlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  InsertImage,
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
  const uploadPastedImage = async (file: File): Promise<{ url: string; alt?: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await fetch('/api/upload-pasted-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const result = await response.json();
      return { url: result.url, alt: result.alt || 'Pasted image' };
    } catch (error) {
      console.error('Failed to upload pasted image:', error);
      throw error;
    }
  };

  const handlePaste = async (event: React.ClipboardEvent<HTMLDivElement>) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item?.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item?.getAsFile();
        if (file) {
          try {
            const { url, alt } = await uploadPastedImage(file);
            const imageMarkdown = `![${alt || 'Pasted image'}](${url})`;
            
            if (editorRef?.current) {
              const currentMarkdown = editorRef.current.getMarkdown();
              const newMarkdown = currentMarkdown + '\n\n' + imageMarkdown + '\n\n';
              editorRef.current.setMarkdown(newMarkdown);
              onChange?.(newMarkdown);
            }
          } catch (error) {
            console.error('Failed to upload pasted image:', error);
          }
        }
        break;
      }
    }
  };
  return (
    <div className="min-h-[400px]" onPaste={handlePaste}>
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
        :global(.mdxeditor img) {
          max-width: 100%;
          height: auto;
          margin: 1rem 0;
          border-radius: 0.5rem;
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
          imagePlugin({
            imageUploadHandler: async (image) => {
              const { url } = await uploadPastedImage(image);
              return url;
            },
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <BlockTypeSelect />
                <ListsToggle />
                <InsertImage />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
};

export default EditorMdx;
