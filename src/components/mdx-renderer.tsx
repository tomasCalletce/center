import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';

interface MDXRendererProps {
  content: string;
}

const components = {
  // Custom heading components
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold mb-6 mt-8 text-foreground" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-semibold mb-4 mt-6 text-foreground" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-2xl font-semibold mb-3 mt-5 text-foreground" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: any) => (
    <h5 className="text-lg font-semibold mb-2 mt-3 text-foreground" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: any) => (
    <h6 className="text-base font-semibold mb-1 mt-2 text-foreground" {...props}>
      {children}
    </h6>
  ),
  
  // Paragraph with proper spacing
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  
  // Lists
  ul: ({ children, ...props }: any) => (
    <ul className="mb-4 ml-6 list-disc space-y-1 text-muted-foreground" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="mb-4 ml-6 list-decimal space-y-1 text-muted-foreground" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  
  // Links
  a: ({ children, href, ...props }: any) => (
    <Link 
      href={href} 
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </Link>
  ),
  
  // Images
  img: ({ src, alt, ...props }: any) => (
    <div className="my-6 rounded-lg overflow-hidden">
      <Image
        src={src}
        alt={alt || ''}
        width={800}
        height={400}
        className="w-full h-auto object-cover"
        {...props}
      />
    </div>
  ),
  
  // Code blocks
  pre: ({ children }: any) => (
    <div className="my-6 rounded-lg overflow-hidden">
      {children}
    </div>
  ),
  code: ({ children, className, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const language = match ? match[1] : '';
    
    if (language) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={language}
          PreTag="div"
          className="rounded-lg"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
    
    return (
      <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-foreground" {...props}>
        {children}
      </code>
    );
  },
  
  // Blockquotes
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  
  // Tables
  table: ({ children, ...props }: any) => (
    <div className="my-8 overflow-x-auto rounded-lg border border-border shadow-sm">
      <table className="w-full border-collapse bg-card" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }: any) => (
    <thead className="bg-muted/50" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }: any) => (
    <tbody className="divide-y divide-border" {...props}>
      {children}
    </tbody>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground border-b border-border" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap" {...props}>
      {children}
    </td>
  ),
  tr: ({ children, ...props }: any) => (
    <tr className="hover:bg-muted/30 transition-colors" {...props}>
      {children}
    </tr>
  ),
  
  // Horizontal rule
  hr: (props: any) => (
    <hr className="my-8 border-border" {...props} />
  ),
};

export async function MDXRenderer({ content }: MDXRendererProps) {
  if (!content) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No content available
      </div>
    );
  }

  try {
    const { content: markdownContent } = matter(content);
    
    const cleanContent = markdownContent
      .replace(/^import\s+.*$/gm, '')
      .replace(/^export\s+.*$/gm, '')
      .replace(/^\s*$/gm, '')
      .trim();

    if (!cleanContent) {
      return (
        <div className="prose prose-lg max-w-none">
          <p>No content to display.</p>
        </div>
      );
    }

    return (
      <div className="prose prose-lg max-w-none">
        <MDXRemote 
          source={cleanContent} 
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
            parseFrontmatter: false,
          }}
        />
      </div>
    );
  } catch (error) {
    console.error('MDX parsing error:', error);
    console.error('Content that failed to parse:', content);
    
    try {
      const { content: markdownContent } = matter(content);
      const simpleContent = markdownContent
        .replace(/^import\s+.*$/gm, '')
        .replace(/^export\s+.*$/gm, '')
        .replace(/^\s*<[^>]*>\s*$/gm, '')
        .trim();
      
      return (
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap font-mono text-sm bg-gray-50 p-4 rounded">
            {simpleContent || 'Content could not be rendered'}
          </div>
        </div>
      );
    } catch (fallbackError) {
      console.error('Fallback parsing also failed:', fallbackError);
      return (
        <div className="prose prose-lg max-w-none">
          <div className="text-center py-8 text-red-600">
            Error rendering content. Please check the console for details.
          </div>
        </div>
      );
    }
  }
} 