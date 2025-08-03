import Image from "next/image";
import Link from "next/link";
import { api } from "~/trpc/server";
import { formatDistanceToNow } from "date-fns";
import { Calendar, User } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | ACC",
  description: "Insights, tutorials, and updates from our community",
};

export default async function BlogPage() {
  const blogs = await api.public.blog.all();

  if (blogs.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-6 py-24">
          <div className="max-w-md mx-auto text-center space-y-8">
            <div className="w-20 h-20 mx-auto border border-dashed rounded-full flex items-center justify-center">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-medium tracking-tight">
                No blog posts yet
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We're working on exciting content for you. Check back soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h1 className="text-4xl font-medium tracking-tight">Blog</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Insights, tutorials, and updates from our community
            </p>
          </div>

          <div className="space-y-16">
            {blogs.map((blog) => (
              <article key={blog.id} className="group">
                <Link href={`/blog/${blog.slug}`} className="block">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                    <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-gray-100">
                      {blog.image_url && (
                        <Image
                          src={blog.image_url}
                          alt={blog.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl font-medium leading-tight group-hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {blog.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          {blog.author_avatar_url ? (
                            <img
                              src={blog.author_avatar_url}
                              alt={blog.author_name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <User className="w-4 h-4" />
                          )}
                          <span>{blog.author_name}</span>
                        </div>
                        
                        {blog.published_at && (
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDistanceToNow(new Date(blog.published_at), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}