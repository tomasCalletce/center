"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import {
  Upload,
  Loader2,
  ImageIcon,
  Check,
  FileText,
  AlignLeft,
  ArrowRight,
  Play,
  Github,
} from "lucide-react";
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
import { Input } from "~/components/ui/input";
import { uploadImage } from "../_actions/upload-image";
import { toast } from "sonner";
import {
  formSubmissionSchema,
  submissionVisibilityValues,
} from "~/server/db/schemas/submissions";
import { api } from "~/trpc/react";
import { useRouter, useParams } from "next/navigation";

type FormData = z.infer<typeof formSubmissionSchema>;

export function MainSubmitBuildForm() {
  const params = useParams<{ _challenge: string }>();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSubmissionSchema),
    defaultValues: {
      status: submissionVisibilityValues.VISIBLE,
      formImagesSchema: {
        formAssetsSchema: {
          url: "",
          pathname: "",
        },
      },
    },
  });

  const submitMutation = api.submission.create.useMutation({
    onSuccess: () => {
      toast.success("Submission created successfully");
      form.reset();
    },
    onError: () => {
      toast.error("Failed to create submission");
    },
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(formData);

      if (result.error) {
        toast.error(result.error);
        setIsUploaded(false);
      } else if (result.success && result.blob) {
        form.setValue("formImagesSchema.formAssetsSchema.url", result.blob.url);
        form.setValue(
          "formImagesSchema.formAssetsSchema.pathname",
          result.blob.pathname || ""
        );
        form.setValue(
          "formImagesSchema.alt",
          form.getValues("title") || "Project image"
        );
        setIsUploaded(true);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setIsUploaded(false);
    form.setValue("formImagesSchema.formAssetsSchema.url", "");
    form.setValue("formImagesSchema.formAssetsSchema.pathname", "");
    form.setValue("formImagesSchema.alt", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: FormData) => {
    submitMutation.mutate({
      _challenge: params._challenge,
      title: data.title,
      description: data.description,
      demo_url: data.demo_url,
      repository_url: data.repository_url,
      status: data.status,
      verifyImagesSchema: {
        alt: data.formImagesSchema.alt,
        verifyAssetsSchema: {
          url: data.formImagesSchema.formAssetsSchema.url,
          pathname: data.formImagesSchema.formAssetsSchema.pathname,
        },
      },
    });
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Project Info */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Project Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter project name"
                        className="h-10"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      A clear, descriptive name for your project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <AlignLeft className="w-4 h-4" />
                      Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Describe your project, the problem it solves, key features, and technology used..."
                        className="w-full min-h-[120px] p-3 text-sm border border-input bg-background rounded-md resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Explain what makes your project unique and valuable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="demo_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Demo Video URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter YouTube video URL"
                        className="h-10"
                        {...field}
                        value={field.value}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      YouTube link showcasing your project in action
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-6">
              <FormField
                control={form.control}
                name="repository_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      Repository URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter GitHub repository URL"
                        className="h-10"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Link to your project's source code repository
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="formImagesSchema"
                render={() => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      Project Image
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        <div
                          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer min-h-[200px] flex flex-col items-center justify-center transition-all ${
                            isUploaded
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 hover:bg-accent/50"
                          }`}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={(e) => {
                            e.preventDefault();
                            const file = e.dataTransfer.files[0] || null;
                            handleFileChange(file);
                          }}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileChange(e.target.files?.[0] || null)
                            }
                            className="hidden"
                          />

                          {isUploaded && (
                            <div className="space-y-4">
                              <div className="w-14 h-14 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                <Check className="w-7 h-7 text-white stroke-[2.5]" />
                              </div>
                              <div className="text-center space-y-2">
                                <p className="text-sm font-semibold text-foreground">
                                  Upload Complete
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Image ready for submission
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage();
                                  }}
                                  className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors mt-2"
                                >
                                  Change image
                                </Button>
                              </div>
                            </div>
                          )}

                          {isUploading && (
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-primary/10">
                                <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Uploading image...
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Please wait
                                </p>
                              </div>
                            </div>
                          )}

                          {!isUploaded && !isUploading && (
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-muted">
                                <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  Drop image here or click to browse
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, WebP • Max 5MB
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription className="text-sm">
                      Upload a logo, screenshot, or representative image
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t">
            <Button
              isLoading={submitMutation.isPending}
              type="submit"
              className="px-8 cursor-pointer"
            >
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
