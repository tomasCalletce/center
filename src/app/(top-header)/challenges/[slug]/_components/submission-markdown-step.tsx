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
import type { MarkdownData } from "./create-submission/submission-dialog";
import { useEffect } from "react";

const schema = formSubmissionSchema.pick({
  markdown: true,
});

interface SubmissionMarkdownStepProps {
  handleOnSubmit: (data: MarkdownData) => void;
  onBack: () => void;
  isLoading: boolean;
  initialData?: MarkdownData;
}

export function SubmissionMarkdownStep({
  handleOnSubmit,
  onBack,
  isLoading,
  initialData,
}: SubmissionMarkdownStepProps) {
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      markdown: initialData?.markdown || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      form.reset({
        markdown: initialData.markdown,
      });
    }
  }, [initialData, form]);

  const onSubmit = (data: z.infer<typeof schema>) => {
    handleOnSubmit({
      markdown: data.markdown,
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center  pb-4 border-b border-dashed">
        <h3 className="text-lg font-semibold text-slate-900">
          Project Description
        </h3>
        <p className="text-sm text-slate-500">
          Share the story behind your build
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="markdown"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Tell your story
                  </FormLabel>
                  <div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                    Problem • Features • Tech Stack • Challenges
                  </div>
                </div>
                <FormControl>
                  <div className="border rounded-lg overflow-hidden">
                    <EditorMdx
                      markdown={field.value || ""}
                      onChange={(value) => {
                        field.onChange(value);
                        form.trigger("markdown");
                      }}
                      placeholder="Describe your project: What problem does it solve? What are the key features? What technology did you use? What challenges did you overcome?"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between items-center pt-6 border-t border-dashed">
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="text-xs text-slate-500">
                Step 2 of 2 • Final Submission
              </div>
            </div>
            <Button
              type="submit"
              isLoading={isLoading}
              className="cursor-pointer px-6 shadow-lg"
              size="lg"
            >
              <Send className="h-4 w-4 mr-2" />
              {initialData ? "Update Project" : "Submit Project"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
