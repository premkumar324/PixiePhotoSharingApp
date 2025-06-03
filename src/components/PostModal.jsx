import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import appwriteService from "../appwrite/config"
import { FiX, FiEdit2, FiTrash2 } from 'react-icons/fi'

function PostModal({ post, onClose }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            const status = await appwriteService.deletePost(post.$id);
            if (status) {
                // Delete the featured image
                await appwriteService.deleteFile(post.featuredimage);
                onClose();
                window.location.reload(); // Refresh to update the gallery
            }
        } catch (error) {
            console.error("Error deleting post:", error);
        }
    };

    if (!post) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            {/* Action Buttons */}
            <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <Link 
                    to={`/edit-post/${post.$id}`}
                    className="p-2 text-white/70 hover:text-white transition-colors rounded-full bg-black/20 hover:bg-black/30"
                    onClick={(e) => e.stopPropagation()}
                >
                    <FiEdit2 className="w-6 h-6" />
                </Link>
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm('Are you sure you want to delete this post?')) {
                            handleDelete();
                        }
                    }}
                    className="p-2 text-white/70 hover:text-red-500 transition-colors rounded-full bg-black/20 hover:bg-black/30"
                >
                    <FiTrash2 className="w-6 h-6" />
                </button>
                <button 
                    onClick={onClose}
                    className="p-2 text-white/70 hover:text-white transition-colors rounded-full bg-black/20 hover:bg-black/30"
                >
                    <FiX className="w-6 h-6" />
                </button>
            </div>

            {/* Image */}
            <div className="w-full h-full flex items-center justify-center p-4">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white/100 rounded-full animate-spin"></div>
                    </div>
                )}
                <img 
                    src={appwriteService.getFilePreview(post.featuredimage)} 
                    alt={post.title}
                    className={`max-w-full max-h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    onLoad={() => setImageLoaded(true)}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>
        </div>
    )
}

export default PostModal 