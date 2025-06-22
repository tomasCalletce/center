"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlignLeft, ChevronLeft } from "lucide-react";
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
import { Textarea } from "~/components/ui/textarea";

const markdownSchema = z.object({
  description: z.string().min(1, "Description is required"),
});

type MarkdownFormData = z.infer<typeof markdownSchema>;

interface MarkdownData {
  description: string;
}

interface SubmissionMarkdownStepProps {
  initialData: MarkdownData;
  onSubmit: (data: MarkdownData) => void;
  onBack: () => void;
  isLoading: boolean;
}

export function SubmissionMarkdownStep({
  initialData,
  onSubmit,
  onBack,
  isLoading,
}: SubmissionMarkdownStepProps) {
  const form = useForm<MarkdownFormData>({
    resolver: zodResolver(markdownSchema),
    defaultValues: {
      description: initialData.description,
    },
  });

  const handleSubmit = (data: MarkdownFormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium flex items-center gap-2">
                <AlignLeft className="w-4 h-4" />
                Project Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your project, the problem it solves, key features, and technology used..."
                  className="min-h-[200px] resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription className="text-sm">
                Explain what makes your project unique and valuable. You can use
                markdown formatting.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="bg-muted/50 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2">
            💡 Tips for a great description:
          </h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Explain the problem your project solves</li>
            <li>• Highlight key features and innovations</li>
            <li>• Mention technologies and tools used</li>
            <li>• Include any challenges overcome</li>
            <li>• Keep it concise but informative</li>
          </ul>
        </div>

        <div className="flex justify-between pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="cursor-pointer"
          >
            Submit Project
          </Button>
        </div>
      </form>
    </Form>
  );
}
