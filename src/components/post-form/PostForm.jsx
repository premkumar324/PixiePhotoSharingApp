import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const generateSlug = (title) => {
        return title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const submit = async (data) => {
        try {
            setError("");
            setLoading(true);

            if (!userData || !userData.$id) {
                setError("Please log in to create a post");
                return;
            }

            if (!data.title?.trim()) {
                setError("Title is required");
                return;
            }

            if (!data.content?.trim()) {
                setError("Content is required");
                return;
            }

            // Generate slug from title
            const slug = post?.$id || generateSlug(data.title);

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
                    content: data.content,
                    featuredimage: file ? file.$id : post.featuredimage,
                    status: data.status,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const dbPost = await appwriteService.createPost({
                    title: data.title,
                    content: data.content,
                    featuredimage: file ? file.$id : undefined,
                    status: data.status,
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
        <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit(submit)} className="bg-white rounded-xl shadow-md p-6">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700">
                        <p>{error}</p>
                    </div>
                )}
                
                <div className="space-y-6">
                    <div>
                        <Input
                            label="Title"
                            placeholder="Enter your post title"
                            className="w-full text-xl"
                            {...register("title", { required: true })}
                        />
                        {errors.title && (
                            <p className="mt-1 text-red-500">Title is required</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Content
                        </label>
                        <textarea
                            className="w-full min-h-[200px] px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 resize-y"
                            placeholder="Write your post content..."
                            {...register("content", { required: true })}
                        ></textarea>
                        {errors.content && (
                            <p className="mt-1 text-red-500">Content is required</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-2">
                            Featured Image
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                            <Input
                                type="file"
                                accept="image/png, image/jpg, image/jpeg, image/gif"
                                className="w-full"
                                {...register("image", { required: !post })}
                            />
                            {post && post.featuredimage && (
                                <div className="mt-4">
                                    <img
                                        src={appwriteService.getFilePreview(post.featuredimage)}
                                        alt={post.title}
                                        className="rounded-lg max-h-48 object-cover"
                                    />
                                </div>
                            )}
                        </div>
                        {errors.image && (
                            <p className="mt-1 text-red-500">Featured image is required</p>
                        )}
                    </div>

                    <div>
                        <Select
                            options={[
                                { label: "Active", value: "active" },
                                { label: "Inactive", value: "inactive" }
                            ]}
                            label="Status"
                            className="w-full"
                            {...register("status", { required: true })}
                        />
                        {errors.status && (
                            <p className="mt-1 text-red-500">Status is required</p>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            bgColor={post ? "bg-green-500" : "bg-blue-500"}
                            className="min-w-[150px]"
                            disabled={loading}
                        >
                            {loading ? "Saving..." : (post ? "Update Post" : "Create Post")}
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
