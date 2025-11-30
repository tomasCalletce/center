"use client";

import { useState, useRef, useEffect } from "react";
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
import { uploadImage } from "../../_actions/upload-image";
import { toast } from "sonner";
import { Upload, Loader2, ImageIcon, X, ChevronRight } from "lucide-react";
import type { DetailsData } from "./submission-dialog";
import { formSubmissionSchema } from "~/server/db/schemas/submissions";
import { formAssetsImageSchema } from "~/server/db/schemas/assets-images";

const schema = formSubmissionSchema
	.pick({
		title: true,
		demo_url: true,
		video_demo_url: true,
		repository_url: true,
	})
	.extend({
		video_demo_url: z.string().url().or(z.literal("")),
	});

interface SubmissionDetailsStepProps {
	handleOnSubmit: (data: DetailsData) => void;
	initialData?: DetailsData;
	onBack?: () => void;
}

export function SubmissionDetailsStep({
	handleOnSubmit,
	initialData,
	onBack,
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
		defaultValues: {
			title: initialData?.title || "",
			demo_url: initialData?.demo_url || "",
			video_demo_url: initialData?.video_demo_url || "",
			repository_url: initialData?.repository_url || "",
		},
	});

	useEffect(() => {
		if (initialData?.image?.url) {
			setPreview(initialData.image.url);
			setUploadedImage({
				alt: initialData.image.alt,
				formAssetsSchema: {
					url: initialData.image.url,
					pathname: initialData.image.pathname,
				},
			});
		}
	}, [initialData]);

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
		if (preview && !preview.startsWith("http")) URL.revokeObjectURL(preview);
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
			video_demo_url: data.video_demo_url,
			repository_url: data.repository_url,
			image: {
				alt: uploadedImage.alt,
				url: uploadedImage.formAssetsSchema.url,
				pathname: uploadedImage.formAssetsSchema.pathname,
			},
		});
	};

	return (
		<div className="space-y-4">
			<div className="text-center pb-4 border-b border-dashed">
				<h3 className="text-lg font-semibold text-slate-900">
					Project Details
				</h3>
				<p className="text-sm text-slate-500">
					Tell us about your amazing build
				</p>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="space-y-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Project Title</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter your project title"
												{...field}
											/>
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
										<FormLabel>Deck URL</FormLabel>
										<FormControl>
											<Input
												placeholder="https://your-deck-url.com"
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
								name="video_demo_url"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Demo URL (optional)</FormLabel>
										<FormControl>
											<Input
												placeholder="https://your-demo.com"
												type="url"
												{...field}
												value={field.value ?? ""}
												onChange={(e) => field.onChange(e.target.value || "")}
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

						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<span className="text-sm font-semibold text-slate-900">
									Project Image
								</span>
								<div className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
									PNG, JPG, WebP • Max 5MB
								</div>
							</div>

							<div
								className={`
                  relative group overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer
                  ${
										isUploading
											? "bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200"
											: selectedFile || preview
												? "bg-gradient-to-br from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-lg"
												: "bg-gradient-to-br from-slate-50 to-gray-50 border-2 border-dashed border-slate-200 hover:border-slate-900 hover:bg-gradient-to-br hover:from-slate-100 hover:to-gray-100"
									}
                `}
								onDragOver={(e) => {
									e.preventDefault();
									e.currentTarget.classList.add(
										"border-slate-900",
										"bg-slate-100",
									);
								}}
								onDragLeave={(e) => {
									e.preventDefault();
									e.currentTarget.classList.remove(
										"border-slate-900",
										"bg-slate-100",
									);
								}}
								onDrop={(e) => {
									e.preventDefault();
									e.currentTarget.classList.remove(
										"border-slate-900",
										"bg-slate-100",
									);
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
									<div className="flex flex-col items-center justify-center h-64 space-y-4">
										<div className="relative">
											<div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center">
												<Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
											</div>
											<div className="absolute inset-0 bg-blue-500/20 rounded-2xl animate-pulse"></div>
										</div>
										<div className="text-center space-y-1">
											<p className="text-sm font-semibold text-blue-900">
												Uploading your image...
											</p>
											<p className="text-xs text-blue-600">
												This might take a moment
											</p>
										</div>
									</div>
								) : selectedFile || preview ? (
									<div className="relative h-64 w-full">
										<img
											src={preview}
											alt={selectedFile?.name || "Project image"}
											className="w-full h-full object-cover"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
										<div className="absolute bottom-4 left-4 right-4 text-white">
											<div className="flex items-center justify-between">
												<div className="space-y-1">
													<p className="text-sm font-semibold truncate">
														{selectedFile?.name || "Project image"}
													</p>
													{selectedFile && (
														<p className="text-xs opacity-90">
															{(selectedFile.size / 1024 / 1024).toFixed(2)} MB
														</p>
													)}
												</div>
												<Button
													type="button"
													variant="outline"
													size="sm"
													onClick={(e) => {
														e.stopPropagation();
														resetImage();
													}}
													className="bg-white/20 border-white/30 text-white hover:bg-white/30 hover:text-white"
												>
													<X className="w-4 h-4" />
												</Button>
											</div>
										</div>
									</div>
								) : (
									<div className="flex flex-col items-center justify-center h-64 space-y-6">
										<div className="relative group-hover:scale-110 transition-transform duration-300">
											<div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center border-2 border-slate-200 group-hover:border-slate-900 transition-colors duration-300">
												<div className="relative">
													<Upload className="w-8 h-8 text-slate-400 group-hover:text-slate-900 transition-colors duration-300" />
													<div className="absolute -top-1 -right-1 w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
														<ImageIcon className="w-3 h-3 text-white" />
													</div>
												</div>
											</div>
										</div>
										<div className="text-center space-y-2">
											<div className="space-y-1">
												<p className="text-lg font-semibold text-slate-900 group-hover:text-slate-800 transition-colors duration-200">
													Drop your image here
												</p>
												<p className="text-sm text-slate-500">
													or click to browse files
												</p>
											</div>
											<div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 group-hover:bg-slate-900 group-hover:text-white rounded-lg transition-all duration-300">
												<Upload className="w-4 h-4" />
												<span className="text-sm font-medium">Choose File</span>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="flex justify-between items-center pt-6 border-t border-dashed">
						<div className="flex items-center gap-4">
							{onBack && (
								<Button
									type="button"
									variant="outline"
									onClick={onBack}
									className="cursor-pointer"
								>
									Back to Team
								</Button>
							)}
							<div className="text-xs text-slate-500">
								Step 2 of 3 • Project Information
							</div>
						</div>
						<Button
							type="submit"
							className="cursor-pointer px-6 shadow-lg"
							size="lg"
						>
							Continue
							<ChevronRight className="h-4 w-4 ml-2" />
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}
