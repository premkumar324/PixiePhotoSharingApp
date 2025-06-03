import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "..";
import appwriteService from "../../appwrite/config";
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
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
    const [charCount, setCharCount] = useState({
        title: post?.title?.length || 0,
        caption: post?.content?.length || 0
    });

    const handleInputChange = (field, value) => {
        setCharCount(prev => ({
            ...prev,
            [field]: value.length
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(post?.featuredimage ? appwriteService.getFilePreview(post.featuredimage) : null);
        }
    };

    const submit = async (data) => {
        try {
            setError("");
            setLoading(true);

            if (!userData || !userData.$id) {
                setError("Please log in to create a post");
                return;
            }

            const slug = post?.$id || data.title.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');

            let file = null;
            if (data.image && data.image.length > 0) {
                const fileToUpload = data.image[0];
                if (fileToUpload) {
                    file = await appwriteService.uploadFile(fileToUpload);
                }
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
                const dbPost = await appwriteService.createPost({
                    title: data.title,
                    content: data.caption,
                    featuredimage: file ? file.$id : undefined,
                    status: "active",
                    userid: userData.$id,
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
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(submit)} className="bg-white rounded-xl shadow-md p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 font-medium">
                                Title <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-sm ${charCount.title > 50 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount.title}/50
                            </span>
                        </div>
                        <Input
                            placeholder="Give your post a title"
                            className="w-full text-xl"
                            {...register("title", { 
                                required: true,
                                maxLength: 50,
                                onChange: (e) => handleInputChange('title', e.target.value)
                            })}
                        />
                        {errors.title?.type === 'required' && (
                            <p className="mt-1 text-red-500">Title is required</p>
                        )}
                        {errors.title?.type === 'maxLength' && (
                            <p className="mt-1 text-red-500">Title must be less than 50 characters</p>
                        )}
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-gray-700 font-medium">
                                Caption <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-sm ${charCount.caption > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                                {charCount.caption}/200
                            </span>
                        </div>
                        <textarea
                            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none h-20"
                            placeholder="Add a short caption to your post..."
                            {...register("caption", { 
                                required: true,
                                maxLength: 200,
                                onChange: (e) => handleInputChange('caption', e.target.value)
                            })}
                        ></textarea>
                        {errors.caption?.type === 'required' && (
                            <p className="mt-1 text-red-500">Caption is required</p>
                        )}
                        {errors.caption?.type === 'maxLength' && (
                            <p className="mt-1 text-red-500">Caption must be less than 200 characters</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Upload Image <span className="text-red-500">*</span>
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                            <Input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                className="w-full"
                                {...register("image", { 
                                    required: !post,
                                    onChange: handleImageChange
                                })}
                            />
                        </div>
                        {errors.image && (
                            <p className="mt-1 text-red-500">Image is required</p>
                        )}
                        
                        {imagePreview && (
                            <div className="mt-4">
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            bgColor={post ? "bg-green-500" : "bg-blue-500"}
                            className="min-w-[150px]"
                            disabled={loading || charCount.title > 50 || charCount.caption > 200}
                        >
                            {loading ? "Posting..." : (post ? "Update Post" : "Post")}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
