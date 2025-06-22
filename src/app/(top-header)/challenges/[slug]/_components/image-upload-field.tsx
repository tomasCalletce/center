"use client";

import { type UseFormReturn } from "react-hook-form";
import { type z } from "zod";
import { Upload, Loader2, ImageIcon, Check } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";

type FormData = z.infer<typeof formSubmissionSchema>;

interface ImageUploadFieldProps {
  form: UseFormReturn<FormData>;
  isUploading: boolean;
  isUploaded: boolean;
  onFileChange: (file: File | null) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ImageUploadField({
  form,
  isUploading,
  isUploaded,
  onFileChange,
  onRemoveImage,
  fileInputRef,
}: ImageUploadFieldProps) {
  return (
    <FormField
      control={form.control}
      name="formImagesSchema.formAssetsSchema.url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Project Image
          </FormLabel>
          <FormControl>
            <div className="space-y-4">
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
                  onFileChange(file);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onFileChange(e.target.files?.[0] || null)}
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
                          onRemoveImage();
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
            </div>
          </FormControl>
          <FormDescription className="text-sm">
            Upload a logo, screenshot, or representative image
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
