import { MDXRemote } from 'next-mdx-remote/rsc';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
    <div className="my-6 overflow-x-auto">
      <table className="w-full border-collapse border border-border" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="border border-border bg-muted px-4 py-2 text-left font-semibold" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="border border-border px-4 py-2" {...props}>
      {children}
    </td>
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

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote source={content} components={components} />
    </div>
  );
} 