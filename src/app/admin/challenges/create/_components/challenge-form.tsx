"use client";

import { useState, useRef } from "react";
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
  formChallengesSchema,
  challengeVisibilityValues,
  challengePricePoolCurrencyValues,
} from "~/server/db/schemas/challenges";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { api } from "~/trpc/react";
import { SimpleEditor } from "~/app/admin/_components/mdx-editor";
import type { MDXEditorMethods } from "@mdxeditor/editor";

const formSchema = formChallengesSchema;

export const ChallengeForm: React.FC = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const editorRef = useRef<MDXEditorMethods | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price_pool_currency: challengePricePoolCurrencyValues.USD,
      visibility: challengeVisibilityValues.VISIBLE,
    },
  });

  const createChallengeMutation = api.challenge.create.useMutation({
    onSuccess: () => {
      toast.success("Challenge created successfully");
      form.reset();
      setUploadedImageUrl(null);
      // Reset the MDX editor
      if (editorRef.current) {
        editorRef.current.setMarkdown("");
      }
    },
    onError: () => {
      toast.error("Failed to create challenge");
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!uploadedImageUrl) {
      toast.error("Please upload a challenge image");
      return;
    }

    createChallengeMutation.mutate({
      title: data.title,
      slug: data.slug,
      markdown: data.markdown,
      price_pool: data.price_pool,
      price_pool_currency: data.price_pool_currency,
      visibility: data.visibility,
      deadline_at: data.deadline_at,
      verifyImagesSchema: {
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
      <h1 className="text-2xl font-bold mb-6">Create Challenge</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Challenge title" {...field} />
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
                  <Input placeholder="challenge-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <label className="text-sm font-medium">Image</label>
            <ImageUpload
              imageUrl={uploadedImageUrl}
              onImageUploaded={(url) => setUploadedImageUrl(url)}
              onImageRemoved={() => setUploadedImageUrl(null)}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="price_pool"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prize</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price_pool_currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="USD" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(challengePricePoolCurrencyValues).map(
                        (currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="deadline_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deadline</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    value={
                      field.value ? field.value.toISOString().slice(0, 16) : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="visibility"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visibility</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {Object.values(challengeVisibilityValues).map((value) => (
                      <option key={value} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="markdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <SimpleEditor
                    markdown={field.value || ""}
                    onChange={(value: string) => field.onChange(value)}
                    placeholder="Describe the challenge..."
                    editorRef={editorRef}
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
              isLoading={createChallengeMutation.isPending}
            >
              Create Challenge
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
