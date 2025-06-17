"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "~/trpc/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Calendar } from "~/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { challengeVisibilityValues } from "~/server/db/schemas/challenges";
import { uploadImage } from "~/app/(top-header)/challenges/[challenge]/submissions/submit/_actions/upload-image";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, Check, X, CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import Editor from "./mdx-editor";

interface ChallengeFormProps {
  challengeId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const ChallengeForm = ({ challengeId, onSuccess, onCancel }: ChallengeFormProps) => {
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [pricePool, setPricePool] = useState<number>(100);
  const [deadline, setDeadline] = useState<Date>();
  const [deadlineTime, setDeadlineTime] = useState<string>("23:59");
  const [loading, setLoading] = useState(false);
  
  // Image upload states
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePathname, setImagePathname] = useState<string>("");
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = !!challengeId;

  // Fetch challenge data if editing
  const { data: challengeData, isLoading: isFetchingChallenge } = api.challenge.details.useQuery(
    { _challenge: challengeId! },
    { 
      enabled: isEditing && !!challengeId,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    }
  );

  const utils = api.useUtils();

  // Reset form when challengeId changes or when switching to create mode
  useEffect(() => {
    if (!isEditing) {
      // Reset form for create mode
      setTitle("");
      setMarkdown("");
      setPricePool(100);
      setDeadline(undefined);
      setDeadlineTime("23:59");
      setImageUrl("");
      setImagePathname("");
      setIsImageUploaded(false);
    }
  }, [challengeId, isEditing]);

  // Populate form when editing and data is loaded
  useEffect(() => {
    if (isEditing && challengeData) {
      setTitle(challengeData.title);
      setMarkdown(challengeData.markdown || "");
      setPricePool(challengeData.price_pool);
      // Set deadline date and time
      if (challengeData.deadline_at) {
        const deadlineDate = new Date(challengeData.deadline_at);
        setDeadline(deadlineDate);
        setDeadlineTime(format(deadlineDate, "HH:mm"));
      }
      // Set image data
      if (challengeData.image) {
        setImageUrl(challengeData.image.url);
        setImagePathname(challengeData.image.pathname);
        setIsImageUploaded(true);
      }
    }
  }, [isEditing, challengeData]);

  const createChallengeMutation = api.challenge.create.useMutation({
    onSuccess: () => {
      // Clear form state
      setMarkdown("");
      setTitle("");
      setPricePool(100);
      setDeadline(undefined);
      setDeadlineTime("23:59");
      setImageUrl("");
      setImagePathname("");
      setIsImageUploaded(false);
      // Invalidate challenge list to show new challenge
      utils.challenge.all.invalidate();
      onSuccess?.();
    },
  });

  const updateChallengeMutation = api.challenge.update.useMutation({
    onSuccess: () => {
      // Invalidate and refetch challenge details and list
      utils.challenge.details.invalidate({ _challenge: challengeId! });
      utils.challenge.all.invalidate();
      onSuccess?.();
    },
  });

  // Handle image upload
  const handleImageUpload = async (file: File | null) => {
    if (!file) {
      toast.error("Please select an image file");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsImageUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const result = await uploadImage(formData);

      if (result.error) {
        toast.error(result.error);
        setIsImageUploaded(false);
      } else if (result.success && result.blob) {
        setImageUrl(result.blob.url);
        setImagePathname(result.blob.pathname || "");
        setIsImageUploaded(true);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      setIsImageUploaded(false);
    } finally {
      setIsImageUploading(false);
    }
  };

  // Handle paste from clipboard
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item && item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          e.preventDefault();
          await handleImageUpload(file);
          break;
        }
      }
    }
  };

  // Remove image
  const removeImage = () => {
    setImageUrl("");
    setImagePathname("");
    setIsImageUploaded(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !markdown.trim() || !deadline) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!isImageUploaded) {
      toast.error("Please upload a challenge image");
      return;
    }

    setLoading(true);

    // Combine date and time
    const [hours, minutes] = deadlineTime.split(':').map(num => parseInt(num, 10));
    const finalDeadline = new Date(deadline);
    finalDeadline.setHours(hours || 23, minutes || 59, 0, 0);

    try {
      if (isEditing) {
        await updateChallengeMutation.mutateAsync({
          id: challengeId,
          title: title.trim(),
          markdown: markdown.trim(),
          visibility: challengeVisibilityValues.VISIBLE,
          price_pool: pricePool,
          price_pool_currency: "USD",
          deadline_at: finalDeadline,
          imageData: {
            url: imageUrl,
            pathname: imagePathname,
            alt: title.trim(),
          },
        });
      } else {
        await createChallengeMutation.mutateAsync({
          title: title.trim(),
          markdown: markdown.trim(),
          visibility: challengeVisibilityValues.VISIBLE,
          price_pool: pricePool,
          price_pool_currency: "USD",
          deadline_at: finalDeadline,
          imageData: {
            url: imageUrl,
            pathname: imagePathname,
            alt: title.trim(),
          },
        });
      }
    } catch (error) {
      console.error("Failed to save challenge:", error);
      toast.error("Failed to save challenge");
    } finally {
      setLoading(false);
    }
  };

  const isPending = createChallengeMutation.isPending || updateChallengeMutation.isPending || loading;

  if (isEditing && isFetchingChallenge) {
    return (
      <div className="min-h-[400px] w-full flex items-center justify-center">
        <div className="text-gray-500">Loading challenge data...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header with title and actions */}
      <div className="flex items-center justify-between pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {isEditing ? "Edit Challenge" : "Create New Challenge"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isEditing ? "Update your challenge details" : "Set up a new coding challenge"}
          </p>
        </div>
        <div className="flex gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={isPending}
            className="min-w-[120px]"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Updating..." : "Creating..."}
              </>
            ) : (
              isEditing ? "Update Challenge" : "Create Challenge"
            )}
          </Button>
        </div>
      </div>

      {/* Basic Information Section - Full Width */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Challenge Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling challenge title"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              This will be the main title displayed to participants
            </p>
          </div>
          
          <div>
            <Label htmlFor="pricePool" className="text-sm font-medium">
              Prize Pool (USD) *
            </Label>
            <Input
              id="pricePool"
              type="number"
              min="0"
              step="50"
              value={pricePool}
              onChange={(e) => setPricePool(Number(e.target.value))}
              placeholder="100"
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Total prize money for winners
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">
              Deadline *
            </Label>
            <div className="space-y-2 mt-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !deadline && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {deadline ? format(deadline, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={deadline}
                    onSelect={setDeadline}
                    initialFocus
                    disabled={(date) => date < new Date()}
                  />
                </PopoverContent>
              </Popover>
              
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="time"
                  value={deadlineTime}
                  onChange={(e) => setDeadlineTime(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Final submission deadline
            </p>
          </div>
        </div>
      </div>

      {/* Challenge Image Section - Full Width */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Challenge Banner</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div
              className={cn(
                "relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer min-h-[280px] flex flex-col items-center justify-center transition-all",
                isImageUploaded
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-accent/50"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0] || null;
                handleImageUpload(file);
              }}
              onPaste={handlePaste}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files?.[0] || null)}
                className="hidden"
              />

              {isImageUploaded && imageUrl && (
                <div className="space-y-4 w-full">
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Challenge preview"
                      className="w-full max-h-64 object-cover rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage();
                      }}
                      className="absolute top-2 right-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Check className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Banner Image Ready
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Click to replace image
                    </p>
                  </div>
                </div>
              )}

              {isImageUploading && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-primary/10">
                    <Loader2 className="w-10 h-10 text-primary mx-auto animate-spin" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Uploading image...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please wait while we process your image
                    </p>
                  </div>
                </div>
              )}

              {!isImageUploaded && !isImageUploading && (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-muted">
                    <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-2">
                      Upload Challenge Banner
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Drop image here, paste from clipboard, or click to browse
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center text-xs text-muted-foreground">
                      <span className="px-2 py-1 bg-muted rounded">PNG</span>
                      <span className="px-2 py-1 bg-muted rounded">JPG</span>
                      <span className="px-2 py-1 bg-muted rounded">WebP</span>
                      <span className="px-2 py-1 bg-muted rounded">Max 5MB</span>
                      <span className="px-2 py-1 bg-muted rounded">1200x600px recommended</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h3 className="font-medium text-sm text-foreground mb-2">Image Guidelines</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use high-quality, relevant imagery</li>
                <li>• Maintain 2:1 aspect ratio for best results</li>
                <li>• Ensure text is readable if included</li>
                <li>• Avoid cluttered or busy backgrounds</li>
                <li>• Consider how it looks at different sizes</li>
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <h3 className="font-medium text-sm text-foreground mb-2">💡 Pro Tips</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Use tools like Canva or Figma</li>
                <li>• Include your challenge theme</li>
                <li>• Add subtle branding elements</li>
                <li>• Test visibility on mobile devices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Challenge Content Section - Full Width */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-foreground">Challenge Description</h2>
        
        {/* Only render editor when we have data loaded or in create mode */}
        {(!isEditing || (isEditing && !isFetchingChallenge)) && (
          <div className="border rounded-lg min-h-[500px]">
            <div className="p-4 border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm text-foreground">Challenge Details & Requirements *</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Provide comprehensive instructions, technical requirements, evaluation criteria, and submission guidelines
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-background rounded">Markdown supported</span>
                  <span className="px-2 py-1 bg-background rounded">Rich text editor</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Editor 
                key={isEditing ? `edit-${challengeId}` : 'create'}
                markdown={markdown}
                onChange={setMarkdown}
              />
            </div>
          </div>
        )}
        
        {isEditing && isFetchingChallenge && (
          <div className="min-h-[500px] w-full border rounded-lg bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Loading editor content...</p>
                <p className="text-xs text-muted-foreground">Please wait while we fetch the challenge details</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between pt-8 border-t bg-gradient-to-r from-muted/30 to-muted/10 -mx-8 px-8 py-6 rounded-b-lg">
        <div className="text-sm text-muted-foreground">
          {isEditing ? "All changes will be saved automatically" : "Your challenge will be published immediately"}
        </div>
        <div className="flex items-center gap-4">
          {onCancel && (
            <Button variant="outline" size="lg" onClick={onCancel}>
              Cancel
            </Button>
          )}
          <Button 
            onClick={handleSubmit}
            disabled={isPending}
            size="lg"
            className="min-w-[160px] text-base"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {isEditing ? "Updating Challenge..." : "Creating Challenge..."}
              </>
            ) : (
              <>
                {isEditing ? "Update Challenge" : "Publish Challenge"}
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}; 