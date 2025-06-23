"use client";

import EditorMdx from "~/components/mx-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import type { MarkdownData } from "./submission-dialog";

const schema = formSubmissionSchema.pick({
  markdown: true,
});

interface SubmissionMarkdownStepProps {
  handleOnSubmit: (data: MarkdownData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function SubmissionMarkdownStep({
  handleOnSubmit,
  onBack,
  isLoading,
}: SubmissionMarkdownStepProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleSubmit = (data: z.infer<typeof schema>) => {
    handleOnSubmit({
      markdown: data.markdown,
    });
  };

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="markdown"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Description</FormLabel>
                <FormControl>
                  <EditorMdx
                    markdown={field.value || ""}
                    onChange={(value) => {
                      field.onChange(value);
                      form.trigger("markdown");
                    }}
                    placeholder="Describe your project, the problem it solves, key features, and technology used..."
                  />
                </FormControl>
                <FormDescription>
                  Explain what makes your project unique and valuable using the
                  markdown editor.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="bg-accent/50 rounded-lg p-4 space-y-2">
            <h4 className="text-sm font-medium">
              💡 Tips for a great description
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Explain the problem your project solves</li>
              <li>• Highlight key features and innovations</li>
              <li>• Mention technologies and tools used</li>
              <li>• Include any challenges overcome</li>
              <li>• Keep it concise but informative</li>
            </ul>
          </div>

          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button type="submit" isLoading={isLoading}>
              Submit Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
