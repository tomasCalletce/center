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
import { Upload, Loader2, ImageIcon, X, ChevronRight } from "lucide-react";
import type { DetailsData } from "./submission-dialog";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import { formAssetsImageSchema } from "~/server/db/schemas/assets-images";

const schema = formSubmissionSchema.pick({
  title: true,
  demo_url: true,
  repository_url: true,
});

interface SubmissionDetailsStepProps {
  handleOnSubmit: (data: DetailsData) => void;
}

export function SubmissionDetailsStep({
  handleOnSubmit,
}: SubmissionDetailsStepProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [uploadedImage, setUploadedImage] = useState<z.infer<
    typeof formAssetsImageSchema
  > | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const result = await uploadImage(formData);

      if (result.success && result.blob) {
        setUploadedImage({
          alt: file.name,
          formAssetsSchema: {
            url: result.blob.url,
            pathname: result.blob.pathname,
          },
        });
        toast.success("Image uploaded successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
      resetImage();
    } finally {
      setIsUploading(false);
    }
  };

  const resetImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setPreview("");
    setSelectedFile(null);
    setUploadedImage(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const onSubmit = (data: z.infer<typeof schema>) => {
    if (!uploadedImage) {
      toast.error("Please upload an image");
      return;
    }

    handleOnSubmit({
      title: data.title,
      demo_url: data.demo_url,
      repository_url: data.repository_url,
      image: {
        alt: uploadedImage.alt,
        url: uploadedImage.formAssetsSchema.url,
        pathname: uploadedImage.formAssetsSchema.pathname,
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
            <div className="mb-2">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4" />
                <span className="text-sm font-medium">Project Image</span>
              </div>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WebP • Max 5MB
              </p>
            </div>

            <div
              className={`
                relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer min-h-[280px] 
                flex flex-col items-center justify-center transition-all
                ${
                  selectedFile
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-accent/50"
                }
              `}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange(file);
              }}
              onClick={() => !isUploading && fileRef.current?.click()}
            >
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileChange(file);
                }}
                className="hidden"
                disabled={isUploading}
              />

              {isUploading ? (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
                  </div>
                  <p className="text-sm font-medium">Uploading image...</p>
                </div>
              ) : selectedFile && preview ? (
                <div className="space-y-4 w-full flex flex-col items-center">
                  <img
                    src={preview}
                    alt={selectedFile.name}
                    className="w-40 h-40 object-cover rounded-lg border-2 border-primary/20 shadow-sm"
                  />
                  <div className="text-center space-y-2">
                    <p className="text-sm font-medium truncate max-w-[240px]">
                      {selectedFile.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetImage();
                      }}
                      className="text-xs cursor-pointer"
                    >
                      <X className="w-3 h-3" />
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <Upload className="w-8 h-8 text-muted-foreground mx-auto" />
                  </div>
                  <div>
                    <p className="text-base font-medium">
                      Drop image here or click to browse
                    </p>
                    <p className="text-sm text-muted-foreground">
                      PNG, JPG, WebP • Max 5MB
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" className="px-8 cursor-pointer">
            Continue
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
