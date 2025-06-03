import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            caption: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (data) => {
        try {
            setError("");
            setLoading(true);

            if (!userData || !userData.$id) {
                setError("Please log in to create a post");
                return;
            }

            // Validate required fields
            if (!data.title?.trim()) {
                setError("Title is required");
                return;
            }

            if (!data.caption?.trim()) {
                setError("Caption is required");
                return;
            }

            if (!data.slug?.trim()) {
                setError("Slug is required");
                return;
            }

            if (!data.status) {
                setError("Status is required");
                return;
            }

            // Create slug from title if not provided
            if (!data.slug) {
                data.slug = data.title
                    .toLowerCase()
                    .trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '');
            }

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
                    ...data,
                    content: data.caption,
                    featuredimage: file ? file.$id : post.featuredimage,
                });

                if (dbPost) {
                    navigate(`/post/${dbPost.$id}`);
                }
            } else {
                const dbPost = await appwriteService.createPost({
                    ...data,
                    content: data.caption,
                    featuredimage: file ? file.$id : undefined,
                    userid: userData.$id,
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
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap gap-4">
            <div className="w-2/3 px-2">
                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
                {errors.title && (
                    <p className="text-red-600 text-sm mt-1">Title is required</p>
                )}
                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                />
                {errors.slug && (
                    <p className="text-red-600 text-sm mt-1">Slug is required</p>
                )}
                <div className="mb-4">
                    <label className="inline-block mb-1 pl-1">Caption :</label>
                    <textarea
                        className="w-full px-3 py-2 h-36 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Write a caption..."
                        {...register("caption", { required: true })}
                    ></textarea>
                    {errors.caption && (
                        <p className="text-red-600 text-sm mt-1">Caption is required</p>
                    )}
                </div>
            </div>
            <div className="w-1/3 px-2">
                <div className="mb-4">
                    <Input
                        label="Featured Image :"
                        type="file"
                        accept="image/png, image/jpg, image/jpeg, image/gif"
                        {...register("image", { required: !post })}
                    />
                    {errors.image && (
                        <p className="text-red-600 text-sm mt-1">Featured image is required</p>
                    )}
                </div>
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg"
                        />
                    </div>
                )}
                <div className="mb-4">
                    <Select
                        options={["active", "inactive"]}
                        label="Status"
                        {...register("status", { required: true })}
                    />
                    {errors.status && (
                        <p className="text-red-600 text-sm mt-1">Status is required</p>
                    )}
                </div>
                <Button type="submit" bgColor={post ? "bg-green-500" : "bg-blue-500"} className="w-full">
                    {post ? "Update" : "Create"}
                </Button>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
            </div>
        </form>
    );
}
