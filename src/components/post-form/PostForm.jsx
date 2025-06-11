import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, ImageCropper } from "..";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ID } from "appwrite";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            caption: post?.content || "",
            status: "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const authStatus = useSelector((state) => state.auth.status);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
    const [showCropper, setShowCropper] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [croppedBlob, setCroppedBlob] = useState(null);
    const [charCount, setCharCount] = useState({
        title: post?.title?.length || 0,
        caption: post?.content?.length || 0
    });
    const [useOriginalImage, setUseOriginalImage] = useState(false);
    const [compressImage, setCompressImage] = useState(true);
    const [compressionQuality, setCompressionQuality] = useState(0.8);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Debug logging
    console.log("PostForm - Auth Status:", authStatus);
    console.log("PostForm - User Data:", userData);

    // Check authentication on component mount
    useEffect(() => {
        if (!authStatus || !userData) {
            console.log("PostForm - Not authenticated, checking current user");
            authService.getCurrentUser()
                .then(currentUser => {
                    if (!currentUser) {
                        console.log("PostForm - No current user found");
                        setError("Please log in to create a post");
                    } else {
                        console.log("PostForm - Current user found:", currentUser.$id);
                        // Clear any previous error about authentication
                        if (error === "Please log in to create a post") {
                            setError("");
                        }
                    }
                })
                .catch(err => {
                    console.error("PostForm - Error checking current user:", err);
                });
        }
    }, [authStatus, userData]);

    const handleInputChange = (field, value) => {
        setCharCount(prev => ({
            ...prev,
            [field]: value.length
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            // For large files, suggest preserving original
            if (file.size > 1024 * 1024 * 2) { // If larger than 2MB
                setUseOriginalImage(true);
            } else {
                setUseOriginalImage(false);
            }
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                // Only show cropper if not using original image
                if (!useOriginalImage) {
                    setShowCropper(true);
                }
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
            setSelectedFile(null);
            setCroppedBlob(null);
            setUseOriginalImage(false);
        }
    };

    const handleCropComplete = (blob) => {
        setCroppedBlob(blob);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(blob);
        setShowCropper(false);
    };

    const handleCropCancel = () => {
        setShowCropper(false);
        setImagePreview(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
        setSelectedFile(null);
        setCroppedBlob(null);
        setUseOriginalImage(false);
        setValue('image', '');
    };

    // Compress image to specified quality
    const compressImageToJPEG = async (imageFile, quality = 0.8) => {
        return new Promise((resolve, reject) => {
            try {
                const reader = new FileReader();
                reader.readAsDataURL(imageFile);
                reader.onload = (event) => {
                    try {
                        const img = new Image();
                        img.src = event.target.result;
                        img.onload = () => {
                            try {
                                const canvas = document.createElement('canvas');
                                const ctx = canvas.getContext('2d');
                                canvas.width = img.width;
                                canvas.height = img.height;
                                ctx.drawImage(img, 0, 0);
                                
                                canvas.toBlob((blob) => {
                                    if (!blob) {
                                        console.error("Failed to create blob from canvas");
                                        // Fallback to the original file
                                        resolve(imageFile);
                                        return;
                                    }
                                    
                                    try {
                                        const compressedFile = new File([blob], imageFile.name.replace(/\.[^/.]+$/, ".jpg"), {
                                            type: 'image/jpeg',
                                            lastModified: new Date().getTime()
                                        });
                                        resolve(compressedFile);
                                    } catch (error) {
                                        console.error("Error creating File from blob:", error);
                                        // Fallback to the original file
                                        resolve(imageFile);
                                    }
                                }, 'image/jpeg', quality);
                            } catch (error) {
                                console.error("Canvas error:", error);
                                // Fallback to the original file
                                resolve(imageFile);
                            }
                        };
                        img.onerror = (error) => {
                            console.error("Image loading error:", error);
                            // Fallback to the original file
                            resolve(imageFile);
                        };
                    } catch (error) {
                        console.error("Error processing image:", error);
                        // Fallback to the original file
                        resolve(imageFile);
                    }
                };
                reader.onerror = (error) => {
                    console.error("FileReader error:", error);
                    // Fallback to the original file
                    resolve(imageFile);
                };
            } catch (error) {
                console.error("Compression error:", error);
                // Fallback to the original file
                resolve(imageFile);
            }
        });
    };

    const submit = async (data) => {
        try {
            setError("");
            setLoading(true);
            setUploadProgress(1); // Set initial progress to show indicator immediately
            console.log("PostForm - Submitting post form");

            // Double check authentication
            const currentUser = await authService.getCurrentUser();
            if (!currentUser) {
                console.error("PostForm - No user found when submitting");
                setError("Please log in to create a post");
                return;
            }

            // Use the current user from Appwrite if Redux store doesn't have it
            const userToUse = userData && userData.$id ? userData : currentUser;
            console.log("PostForm - Using user:", userToUse.$id);

            // For existing posts, use the existing ID
            // For new posts, use a unique ID from Appwrite
            let slug;
            if (post && post.$id) {
                slug = post.$id;
            } else {
                // Use Appwrite's ID.unique() which generates a valid ID
                slug = ID.unique();
                console.log("PostForm - Generated unique ID as slug:", slug);
            }

            let file = null;
            
            // Show preparing state
            if (selectedFile) {
                setUploadProgress(2); // Show a small progress to indicate preparation
            }
            
            if (useOriginalImage && selectedFile) {
                // Upload the original file directly without cropping
                if (compressImage && selectedFile.type !== 'image/gif') {
                    // Compress the original image if compression is enabled and not a GIF
                    setUploadProgress(5); // Show progress for compression phase
                    const compressedFile = await compressImageToJPEG(selectedFile, compressionQuality);
                    file = await appwriteService.uploadFile(compressedFile, setUploadProgress);
                } else {
                    file = await appwriteService.uploadFile(selectedFile, setUploadProgress);
                }
            } else if (croppedBlob) {
                // Create a File object from the cropped blob
                let fileToUpload;
                if (compressImage && selectedFile.type !== 'image/gif') {
                    // Convert to JPEG with specified quality
                    setUploadProgress(5); // Show progress for compression phase
                    const croppedFile = new File([croppedBlob], selectedFile.name, {
                        type: 'image/jpeg',
                        lastModified: new Date().getTime()
                    });
                    fileToUpload = await compressImageToJPEG(croppedFile, compressionQuality);
                } else {
                    // Use PNG for better quality if compression is disabled
                    fileToUpload = new File([croppedBlob], selectedFile.name, {
                        type: selectedFile.type || 'image/png',
                        lastModified: new Date().getTime()
                    });
                }
                file = await appwriteService.uploadFile(fileToUpload, setUploadProgress);
            }

            if (post) {
                if (file) {
                    appwriteService.deleteFile(post.featuredimage);
                }
                
                const dbPost = await appwriteService.updatePost(post.$id, {
                    title: data.title,
                    content: data.caption,
                    featuredimage: file ? file.$id : post.featuredimage,
                    status: "active",
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                console.log("PostForm - Creating new post with user ID:", userToUse.$id);
                const dbPost = await appwriteService.createPost({
                    title: data.title,
                    content: data.caption,
                    featuredimage: file ? file.$id : undefined,
                    status: "active",
                    userid: userToUse.$id,
                    slug
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            }

        } catch (error) {
            console.error("PostForm submission error:", error);
            let errorMessage = "An error occurred while submitting your post.";
            
            if (error.message) {
                // Check for specific upload-related errors
                if (error.message.includes("File size exceeds")) {
                    errorMessage = "File size exceeds the maximum allowed limit. Please choose a smaller file or compress your image.";
                } else if (error.message.includes("File type not allowed")) {
                    errorMessage = "This file type is not allowed. Please upload an image (JPG, PNG, GIF, or WebP).";
                } else if (error.message.includes("network")) {
                    errorMessage = "Network error occurred during upload. Please check your connection and try again.";
                } else if (error.message.includes("permission")) {
                    errorMessage = "You don't have permission to upload files. Please check your account.";
                } else if (error.message.includes("quota")) {
                    errorMessage = "Storage quota exceeded. Please delete some files or upgrade your plan.";
                } else {
                    // Use the original message for other errors
                    errorMessage = error.message;
                }
            }
            
            setError(errorMessage);
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    return (
        <div className="w-full px-4 sm:px-0 sm:max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(submit)} className="bg-white rounded-xl shadow-md p-4 sm:p-6">
                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm sm:text-base">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="space-y-4 sm:space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 font-medium text-sm sm:text-base">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-xs sm:text-sm ${charCount.title > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount.title}/50
                            </span>
                        </div>
                        <Input
                            placeholder="Give your post a title"
                            className="w-full text-lg sm:text-xl"
                            {...register("title", { 
                                required: true,
                                maxLength: 50,
                                onChange: (e) => handleInputChange('title', e.target.value)
                            })}
                        />
                        {errors.title?.type === 'required' && (
                            <p className="mt-1 text-red-500 text-xs sm:text-sm">Title is required</p>
                        )}
                        {errors.title?.type === 'maxLength' && (
                            <p className="mt-1 text-red-500 text-xs sm:text-sm">Title must be less than 50 characters</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 font-medium text-sm sm:text-base">
                                Caption <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-xs sm:text-sm ${charCount.caption > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount.caption}/200
                            </span>
                        </div>
                        <textarea
                            className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none h-24 sm:h-32 text-sm sm:text-base"
                            placeholder="Add a short caption to your post..."
                            {...register("caption", { 
                                required: true,
                                maxLength: 200,
                                onChange: (e) => handleInputChange('caption', e.target.value)
                            })}
                        ></textarea>
                        {errors.caption?.type === 'required' && (
                            <p className="mt-1 text-red-500 text-xs sm:text-sm">Caption is required</p>
                        )}
                        {errors.caption?.type === 'maxLength' && (
                            <p className="mt-1 text-red-500 text-xs sm:text-sm">Caption must be less than 200 characters</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">
                            Upload Image <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 hover:border-blue-500 transition-colors">
                            <Input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif, image/webp"
                                className="w-full text-sm sm:text-base"
                                {...register("image", { 
                                    required: !post,
                                    onChange: handleImageChange
                                })}
                            />
                        </div>
                        {errors.image && (
                            <p className="mt-1 text-red-500 text-xs sm:text-sm">Image is required</p>
                        )}
                        
                        {selectedFile && (
                            <div className="mt-2 space-y-2">
                                {selectedFile.size > 1024 * 1024 * 2 && (
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id="useOriginal"
                                            checked={useOriginalImage}
                                            onChange={() => {
                                                const newValue = !useOriginalImage;
                                                setUseOriginalImage(newValue);
                                                if (!newValue && selectedFile) {
                                                    // Show cropper if switching to cropped mode
                                                    setShowCropper(true);
                                                }
                                            }}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="useOriginal" className="ml-2 block text-sm text-gray-700">
                                            Preserve original dimensions (recommended for large files)
                                        </label>
                                    </div>
                                )}
                                
                                {selectedFile.type !== 'image/gif' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="compressImage"
                                                checked={compressImage}
                                                onChange={() => setCompressImage(!compressImage)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label htmlFor="compressImage" className="ml-2 block text-sm text-gray-700">
                                                Compress image (convert to JPEG)
                                            </label>
                                        </div>
                                        
                                        {compressImage && (
                                            <div className="pl-6">
                                                <label htmlFor="quality" className="block text-sm text-gray-700 mb-1">
                                                    Quality: {Math.round(compressionQuality * 100)}%
                                                </label>
                                                <input
                                                    type="range"
                                                    id="quality"
                                                    min="0.3"
                                                    max="1"
                                                    step="0.1"
                                                    value={compressionQuality}
                                                    onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                                                    className="w-full max-w-xs"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {imagePreview && !showCropper && (
                            <div className="mt-4">
                                <div className="relative aspect-[4/3] w-full max-w-md mx-auto rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">
                                    {uploadProgress < 5 ? 'Preparing...' : 
                                     uploadProgress < 10 ? 'Compressing image...' : 
                                     uploadProgress < 100 ? `Uploading: ${Math.round(uploadProgress)}%` : 
                                     'Processing...'}
                                </label>
                                <span className="text-xs text-gray-500">
                                    {uploadProgress > 0 && uploadProgress < 100 ? `${Math.round(uploadProgress)}%` : ''}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div 
                                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                                    style={{ width: `${Math.max(3, uploadProgress)}%` }}
                                ></div>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-2 sm:pt-4">
                        <Button
                            type="submit"
                            bgColor={post ? "bg-green-500" : "bg-blue-500"}
                            className="w-full sm:w-auto min-w-[150px]"
                            disabled={loading || charCount.title > 50 || charCount.caption > 200}
                        >
                            {loading ? "Posting..." : (post ? "Update Post" : "Post")}
                        </Button>
                    </div>
                </div>
            </form>

            {showCropper && imagePreview && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-white rounded-xl overflow-hidden">
                        <ImageCropper
                            imageUrl={imagePreview}
                            onCropComplete={handleCropComplete}
                            onCancel={handleCropCancel}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
