"use client";

import { useState, useRef } from "react";
import { Button } from "~/components/ui/button";
import { toast } from "sonner";
import { Upload, Loader2, X } from "lucide-react";
import { uploadBlogImage } from "../_actions/upload-image";

interface ImageUploadProps {
  onImageUploaded?: (url: string) => void;
  onImageRemoved?: () => void;
  imageUrl?: string | null;
}

export const ImageUpload = ({
  onImageUploaded,
  onImageRemoved,
  imageUrl,
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadBlogImage(formData);
      if (result.success && result.blob) {
        onImageUploaded?.(result.blob.url);
      } else {
        toast.error(result.error || "Upload failed");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    onImageRemoved?.();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (imageUrl) {
    return (
      <div className="relative">
        <img
          src={imageUrl}
          alt="Blog"
          className="w-full h-48 object-cover rounded-md"
        />
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="absolute top-2 right-2"
          onClick={removeImage}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className="border border-dashed border-muted-foreground/20 rounded-md p-6 text-center cursor-pointer hover:border-muted-foreground/40 transition-colors"
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleUpload(file);
        }}
        className="hidden"
      />

      {isUploading ? (
        <div className="py-4">
          <Loader2 className="w-10 h-10 mx-auto text-primary animate-spin mb-3" />
          <p className="text-sm text-muted-foreground">Uploading...</p>
        </div>
      ) : (
        <div className="py-4">
          <Upload className="w-10 h-10 mx-auto text-primary/70 mb-3" />
          <p className="text-sm font-medium">Drop image or click to browse</p>
        </div>
      )}
    </div>
  );
};