import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { formatDistanceToNow, format } from "date-fns";
import { ArrowLeft, Calendar, User, ExternalLink } from "lucide-react";
import { MDXRenderer } from "~/components/mdx-renderer";
import { Button } from "~/components/ui/button";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const blog = await api.public.blog.details({ slug });
    
    return {
      title: `${blog.title} | ACC Blog`,
      description: blog.description,
      openGraph: {
        title: blog.title,
        description: blog.description,
        images: blog.image_url ? [blog.image_url] : [],
      },
    };
  } catch {
    return {
      title: "Blog Post | ACC",
      description: "Read our latest blog post",
    };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const blog = await api.public.blog.details({ slug });

  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <article>
            <header className="mb-8">
              <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-4">
                  {blog.title}
                </h1>
                {blog.description && (
                  <p className="text-lg text-gray-600 leading-relaxed">
                    {blog.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500 pb-6 border-b border-gray-200">
                {blog.author_linkedin ? (
                  <Link
                    href={blog.author_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-gray-700 transition-colors"
                  >
                    {blog.author_avatar_url ? (
                      <img
                        src={blog.author_avatar_url}
                        alt={blog.author_name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900 hover:text-gray-700">{blog.author_name}</span>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    {blog.author_avatar_url ? (
                      <img
                        src={blog.author_avatar_url}
                        alt={blog.author_name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-gray-900">{blog.author_name}</span>
                  </div>
                )}

                {blog.published_at && (
                  <>
                    <span>•</span>
                    <time dateTime={blog.published_at.toISOString()}>
                      {format(new Date(blog.published_at), "MMMM dd, yyyy")}
                    </time>
                  </>
                )}
              </div>
            </header>

            <div className="prose prose-lg max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-p:text-gray-700 prose-p:leading-7">
              {blog.content ? (
                <MDXRenderer content={blog.content} />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No content available
                </div>
              )}
            </div>
          </article>

          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href="/blog">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
    </div>
  );
}