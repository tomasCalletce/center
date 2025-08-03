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
    <div className="relative py-16">
      <div className="absolute inset-x-0 top-0 h-32 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_90%_80%_at_50%_0%,#000_40%,transparent_100%)]" />
      <div className="relative max-w-4xl mx-auto">
        <div className="mb-8">
          <p className="text-muted-foreground">
            Latest updates and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="block h-full"
              >
                <div className="h-full flex flex-col p-4 border border-dashed rounded-xl hover:border-slate-300 bg-white">
                  <div className="flex-1 space-y-2">
                    {blog.published_at && (
                      <time className="text-sm text-muted-foreground">
                        {new Date(blog.published_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </time>
                    )}
                    <h3 className="text-xl font-medium leading-tight line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {blog.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground border-t pt-3 mt-4">
                    {blog.author_avatar_url ? (
                      <img
                        src={blog.author_avatar_url}
                        alt={blog.author_name}
                        className="w-6 h-6 rounded-full"
                      />
                    ) : (
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-3 h-3 text-gray-500" />
                      </div>
                    )}
                    <span className="font-medium">{blog.author_name}</span>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}