"use client";

import EditorMdx from "~/components/mx-editor";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, FileText, Send } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
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

  const onSubmit = (data: z.infer<typeof schema>) => {
    handleOnSubmit({
      markdown: data.markdown,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="markdown"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex items-center justify-between">
                <FormLabel className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Project Description
                </FormLabel>
                <div className="text-xs text-muted-foreground">
                  Problem • Features • Tech Stack • Challenges
                </div>
              </div>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-between items-center pt-2">
          <Button
            type="button"
            className="cursor-pointer"
            variant="outline"
            onClick={onBack}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="cursor-pointer"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
