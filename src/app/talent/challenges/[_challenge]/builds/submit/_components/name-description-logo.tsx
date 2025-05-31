"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { Upload, X, Loader2, ImageIcon, Check } from "lucide-react";
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
import Image from "next/image";
import { toast } from "sonner";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";

type FormData = z.infer<typeof formSubmissionSchema>;

interface NameDescriptionLogoProps {
  onComplete?: (data: FormData) => void;
}

export function NameDescriptionLogo({ onComplete }: NameDescriptionLogoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSubmissionSchema),
    defaultValues: {
      title: "",
      description: "",
      _logo_image: "",
    },
  });

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setSelectedFile(file);
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const result = await uploadImage(formData);

      if (result.error) {
        toast.error(result.error);
      } else if (result.success && result.blob) {
        setUploadedImageUrl(result.blob.url);
        form.setValue("_logo_image", result.blob.url);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setUploadedImageUrl("");
    form.setValue("_logo_image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = (data: FormData) => {
    toast.success("Project details saved successfully");
    onComplete?.(data);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground mb-2">
          Project Details
        </h1>
        <p className="text-muted-foreground">
          Provide the basic information about your project submission
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Form Fields */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
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
                    <FormLabel className="text-sm font-medium">
                      Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        placeholder="Describe your project, the problem it solves, key features, and technology used..."
                        className="w-full min-h-[120px] p-3 text-sm border border-input bg-background rounded-md resize-none focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-sm">
                      Explain what makes your project unique and valuable
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Right Column - Image Upload */}
            <div>
              <FormField
                control={form.control}
                name="_logo_image"
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
                            selectedFile || uploadedImageUrl
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

                          {uploadedImageUrl ? (
                            <div className="space-y-3">
                              <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden border-2 border-primary/20">
                                <Image
                                  src={uploadedImageUrl}
                                  alt="Project preview"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex items-center justify-center gap-2">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-sm font-medium text-green-600">
                                  Image uploaded
                                </span>
                              </div>
                            </div>
                          ) : selectedFile ? (
                            <div className="space-y-3">
                              <div className="p-3 rounded-lg bg-primary/10">
                                <ImageIcon className="w-8 h-8 text-primary mx-auto" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-foreground truncate max-w-[200px] mx-auto">
                                  {selectedFile.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {(selectedFile.size / 1024 / 1024).toFixed(2)}{" "}
                                  MB
                                </p>
                              </div>
                            </div>
                          ) : (
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

                          {(selectedFile || uploadedImageUrl) && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full hover:bg-destructive hover:text-destructive-foreground"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {selectedFile && !uploadedImageUrl && (
                          <Button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={isUploading}
                            className="w-full"
                            size="sm"
                          >
                            {isUploading ? (
                              <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-4 h-4 mr-2" />
                                Upload Image
                              </>
                            )}
                          </Button>
                        )}
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

          {/* Submit */}
          <div className="flex justify-end pt-6 border-t">
            <Button type="submit" className="px-8">
              Continue
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
