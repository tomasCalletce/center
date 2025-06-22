"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { uploadImage } from "../_actions/upload-image";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, Check } from "lucide-react";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import type { DetailsData } from "./submission-dialog";

const detailsSchema = formSubmissionSchema.pick({
  title: true,
  demo_url: true,
  repository_url: true,
  formImagesSchema: true,
});

type DetailsFormData = z.infer<typeof detailsSchema>;

interface SubmissionDetailsStepProps {
  handleOnSubmit: (data: DetailsData) => void;
}

export function SubmissionDetailsStep({
  handleOnSubmit,
}: SubmissionDetailsStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
  });

  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const result = await uploadImage(formData);
      if (result.success && result.blob) {
        form.setValue("formImagesSchema", {
          alt: file.name,
          formAssetsSchema: {
            url: result.blob.url,
            pathname: result.blob.pathname,
          },
        });
        setIsUploaded(true);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    form.setValue("formImagesSchema", {
      alt: "",
      formAssetsSchema: {
        url: "",
        pathname: "",
      },
    });
    setIsUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: DetailsFormData) => {
    handleOnSubmit({
      title: data.title,
      demo_url: data.demo_url,
      repository_url: data.repository_url,
      image: {
        alt: data.formImagesSchema.alt,
        url: data.formImagesSchema.formAssetsSchema.url,
        pathname: data.formImagesSchema.formAssetsSchema.pathname,
      },
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your project title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="demo_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Demo URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://your-demo.com"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="repository_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Repository URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username/repo"
                      type="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormField
              control={form.control}
              name="formImagesSchema"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Project Image
                  </FormLabel>
                  <FormControl>
                    <div
                      className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer min-h-[280px] flex flex-col items-center justify-center transition-all ${
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

                      {isUploaded && field.value ? (
                        <div className="space-y-4">
                          <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                            <Check className="w-8 h-8 text-white stroke-[2.5]" />
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
                                handleRemoveImage();
                              }}
                              className="text-xs text-muted-foreground hover:text-foreground cursor-pointer transition-colors mt-2"
                            >
                              Change image
                            </Button>
                          </div>
                        </div>
                      ) : isUploading ? (
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
                      ) : (
                        <div className="space-y-4">
                          <div className="p-3 rounded-lg bg-muted">
                            <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                          </div>
                          <div>
                            <p className="text-base font-medium text-foreground">
                              Drop image here or click to browse
                            </p>
                            <p className="text-sm text-muted-foreground">
                              PNG, JPG, WebP • Max 5MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" className="px-8">
            Continue
          </Button>
        </div>
      </form>
    </Form>
  );
}
