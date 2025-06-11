import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, ImageCropper } from "..";
import appwriteService from "../../appwrite/config";
import authService from "../../appwrite/auth";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

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
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setShowCropper(true);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
            setSelectedFile(null);
            setCroppedBlob(null);
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
        setValue('image', '');
    };

    const submit = async (data) => {
        try {
            setError("");
            setLoading(true);
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

            const slug = post?.$id || data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

            let file = null;
            if (croppedBlob) {
                // Create a File object from the cropped blob
                const croppedFile = new File([croppedBlob], selectedFile.name, {
                    type: 'image/jpeg',
                    lastModified: new Date().getTime()
                });
                file = await appwriteService.uploadFile(croppedFile);
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
            setError(error.message);
        } finally {
            setLoading(false);
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
                                accept="image/png, image/jpg, image/jpeg, image/gif"
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
