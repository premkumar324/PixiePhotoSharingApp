import React, { useCallback, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Input, Select } from './index'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function PostForm({ post, onSubmit, loading = false }) {
    const { register, handleSubmit, watch, setValue, control, getValues } = useForm({
        defaultValues: {
            title: post?.title || '',
            content: post?.content || '',
            status: post?.status || 'active',
        },
    })

    const navigate = useNavigate()
    const userData = useSelector(state => state.auth.userData)

    const submit = async (data) => {
        if (!userData) {
            navigate('/login')
            return
        }

        if (data.image && data.image.length > 0) {
            onSubmit(data)
        } else {
            alert('Please select an image')
        }
    }

    return (
        <form onSubmit={handleSubmit(submit)} className="flex flex-col gap-6">
            <div>
                <Input
                    label="Title"
                    placeholder="Enter a title for your photo"
                    className="mb-4"
                    {...register("title", { required: true })}
                />
            </div>
            <div>
                <label className="inline-block mb-2 text-gray-700">Caption</label>
                <textarea
                    placeholder="Add a caption to your photo..."
                    className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                    rows="4"
                    {...register("content")}
                ></textarea>
            </div>
            <div>
                <Input
                    label="Upload Photo"
                    type="file"
                    className="mb-4"
                    accept="image/*"
                    {...register("image", { required: !post })}
                />
                {post && (
                    <div className="w-full mb-4">
                        <img
                            src={appwriteService.getFilePreview(post.featuredimage)}
                            alt={post.title}
                            className="rounded-lg w-full"
                        />
                    </div>
                )}
            </div>
            <Select
                options={["active", "inactive"]}
                label="Status"
                className="mb-4"
                {...register("status", { required: true })}
            />
            <div className="flex gap-4">
                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : "bg-blue-500"}
                    className="w-full"
                    disabled={loading}
                >
                    {loading ? "Saving..." : (post ? "Update" : "Create")}
                </Button>
                <Button
                    type="button"
                    bgColor="bg-red-500"
                    className="w-full"
                    onClick={() => navigate(-1)}
                >
                    Cancel
                </Button>
            </div>
        </form>
    )
}

export default PostForm 