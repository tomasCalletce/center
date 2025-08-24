"use client";

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import Image from 'next/image';
import Link from 'next/link';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import matter from 'gray-matter';
import remarkGfm from 'remark-gfm';
import { useEffect, useState } from 'react';

interface MDXRendererClientProps {
  content: string;
}

const components = {
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
  
  p: ({ children, ...props }: any) => (
    <p className="mb-4 leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  
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
  
  a: ({ children, href, ...props }: any) => (
    <Link 
      href={href} 
      className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
      {...props}
    >
      {children}
    </Link>
  ),
  
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
  
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary pl-4 my-4 italic text-muted-foreground" {...props}>
      {children}
    </blockquote>
  ),
  
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
  
  hr: (props: any) => (
    <hr className="my-8 border-border" {...props} />
  ),
};

export function MDXRendererClient({ content }: MDXRendererClientProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function serializeMdx() {
      if (!content) {
        setError("No content provided");
        setIsLoading(false);
        return;
      }

      try {
        const { content: markdownContent } = matter(content);
        
        const mdx = await serialize(markdownContent, {
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          }
        });
        
        setMdxSource(mdx);
      } catch (err) {
        console.error('Error serializing MDX:', err);
        setError("Failed to load content");
      } finally {
        setIsLoading(false);
      }
    }

    serializeMdx();
  }, [content]);

  if (isLoading) {
    return (
      <div className="w-full max-w-none space-y-4 animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/5" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-6 bg-muted rounded w-2/3 mt-6" />
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-4/5" />
        </div>
      </div>
    );
  }

  if (error || !mdxSource) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {error || "No content available"}
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}



