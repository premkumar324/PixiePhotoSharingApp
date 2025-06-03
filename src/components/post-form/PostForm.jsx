import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Input, RTE, Select } from "..";
import appwriteService from "../../appwrite/config";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function PostForm({ post }) {
    const { register, handleSubmit, watch, setValue, control, getValues, formState: { errors } } = useForm({
        defaultValues: {
            title: post?.title || "",
            slug: post?.$id || "",
            content: post?.content || "",
            status: post?.status || "active",
        },
    });

    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // Debug logging
    console.log("Current userData:", userData);

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

            if (!data.content?.trim()) {
                setError("Content is required");
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

            // Debug log
            console.log("Submitting post with data:", {
                title: data.title,
                content: data.content,
                slug: data.slug,
                status: data.status,
                image: data.image?.[0]?.name
            });

            if (!data.image || !data.image[0]) {
                setError("Please select a featured image");
                return;
            }

            const uploadedFile = await appwriteService.uploadFile(data.image[0]);
            if (!uploadedFile) {
                setError("Failed to upload image. Please try again.");
                return;
            }

            const postData = {
                title: data.title.trim(),
                content: data.content.trim(),
                status: data.status,
                slug: data.slug.trim(),
                featuredimage: uploadedFile.$id,
                userid: userData.$id
            };

            // Debug log
            console.log("Creating post with data:", postData);

            const dbPost = await appwriteService.createPost(postData);

            if (dbPost) {
                navigate(`/post/${dbPost.$id}`);
            } else {
                await appwriteService.deleteFile(uploadedFile.$id);
                setError("Failed to create post. Please try again.");
            }
        } catch (error) {
            console.error("Detailed error in form submission:", error);
            setError(error.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const slugTransform = useCallback((value) => {
        if (value && typeof value === "string")
            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-")
                .replace(/\s/g, "-");

        return "";
    }, []);

    React.useEffect(() => {
        const subscription = watch((value, { name }) => {
            if (name === "title") {
                setValue("slug", slugTransform(value.title), { shouldValidate: true });
            }
        });

        return () => subscription.unsubscribe();
    }, [watch, slugTransform, setValue]);

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
            {error && (
                <div className="w-full mb-4 px-2">
                    <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
                        {error}
                    </div>
                </div>
            )}
            <div className="w-2/3 px-2">
                <div className="mb-4">
                    <Input
                        label="Title :"
                        placeholder="Title"
                        {...register("title", { required: true })}
                    />
                    {errors.title && (
                        <p className="text-red-600 text-sm mt-1">Title is required</p>
                    )}
                </div>
                <div className="mb-4">
                    <Input
                        label="Slug :"
                        placeholder="Slug"
                        {...register("slug", { required: true })}
                        onInput={(e) => {
                            setValue("slug", slugTransform(e.currentTarget.value), { shouldValidate: true });
                        }}
                    />
                    {errors.slug && (
                        <p className="text-red-600 text-sm mt-1">Slug is required</p>
                    )}
                </div>
                <div className="mb-4">
                    <RTE 
                        label="Content :" 
                        name="content" 
                        control={control} 
                        defaultValue={getValues("content")}
                    />
                    {errors.content && (
                        <p className="text-red-600 text-sm mt-1">Content is required</p>
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
                <Button 
                    type="submit" 
                    bgColor={post ? "bg-green-500" : undefined} 
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Please wait..." : (post ? "Update" : "Submit")}
                </Button>
            </div>
        </form>
    );
}
