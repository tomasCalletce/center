"use client";

import EditorMdxClient from "~/components/mx-editor-client";
import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { ImageUpload } from "./image-upload";
import {
  formBlogSchema,
  blogStatusValues,
} from "~/server/db/schemas/blogs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const formSchema = formBlogSchema;

export const BlogForm: React.FC = () => {
  const router = useRouter();

  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      content: "",
      author_name: "",
      author_bio: "",
      author_linkedin: "",
      author_avatar_url: "",
      status: blogStatusValues.DRAFT,
    },
  });

  const createBlogMutation = api.blog.create.useMutation({
    onSuccess: () => {
      toast.success("Blog post created successfully");
      router.push("/admin");
    },
    onError: () => {
      toast.error("Failed to create blog post");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!uploadedImageUrl) {
      toast.error("Please upload a blog image");
      return;
    }

    createBlogMutation.mutate({
      title: data.title,
      slug: data.slug,
      description: data.description,
      content: data.content,
      author_name: data.author_name,
      author_bio: data.author_bio,
      author_linkedin: data.author_linkedin,
      author_avatar_url: data.author_avatar_url,
      status: data.status,
      verifyAssetsImageSchema: {
        alt: data.title,
        verifyAssetsSchema: {
          pathname: uploadedImageUrl,
          url: uploadedImageUrl,
        },
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Create Blog Post</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Blog post title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="blog-post-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="Brief blog description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className="text-sm font-medium">Featured Image</label>
            <ImageUpload
              imageUrl={uploadedImageUrl}
              onImageUploaded={(url) => setUploadedImageUrl(url)}
              onImageRemoved={() => setUploadedImageUrl(null)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author LinkedIn (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="author_bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Bio (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Senior Developer at Company X" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_avatar_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Author Avatar URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Draft" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(blogStatusValues).map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <EditorMdxClient
                    markdown={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      form.trigger("content");
                    }}
                    placeholder="Write your blog post content..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4 pt-6">
            <Button
              className="cursor-pointer"
              type="submit"
              isLoading={createBlogMutation.isPending}
            >
              Create Blog Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};