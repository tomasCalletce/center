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
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          <article className="space-y-8">
            <header className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-medium leading-tight tracking-tight">
                  {blog.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {blog.description}
                </p>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    {blog.author_avatar_url ? (
                      <img
                        src={blog.author_avatar_url}
                        alt={blog.author_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{blog.author_name}</div>
                      {blog.author_bio && (
                        <div className="text-sm text-muted-foreground">
                          {blog.author_bio}
                        </div>
                      )}
                    </div>
                  </div>

                  {blog.author_linkedin && (
                    <Link
                      href={blog.author_linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}
                </div>

                {blog.published_at && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <time dateTime={blog.published_at.toISOString()}>
                      {format(new Date(blog.published_at), "MMMM dd, yyyy")}
                    </time>
                  </div>
                )}
              </div>
            </header>

            {blog.image_url && (
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={blog.image_url}
                  alt={blog.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none">
              {blog.content ? (
                <MDXRenderer content={blog.content} />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No content available
                </div>
              )}
            </div>
          </article>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}