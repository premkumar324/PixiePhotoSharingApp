import React from 'react'
import { Link } from 'react-router-dom'
import appwriteService from "../appwrite/config"
import { FiX, FiCalendar, FiHeart, FiMessageCircle } from 'react-icons/fi'

function PostModal({ post, onClose }) {
    if (!post) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" 
                    aria-hidden="true"
                    onClick={onClose}
                ></div>

                <div className="relative inline-block w-full max-w-4xl bg-white rounded-lg text-left shadow-xl transform transition-all sm:my-8">
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-1 bg-black/20 hover:bg-black/30 rounded-full text-white transition-colors"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    <div className="flex flex-col md:flex-row">
                        {/* Image Section */}
                        <div className="w-full md:w-7/12 bg-black flex items-center justify-center">
                            <img 
                                src={appwriteService.getFilePreview(post.featuredimage)} 
                                alt={post.title}
                                className="w-full h-auto max-h-[80vh] object-contain"
                            />
                        </div>

                        {/* Content Section */}
                        <div className="w-full md:w-5/12 flex flex-col h-full max-h-[80vh]">
                            {/* Author Header */}
                            <div className="p-4 border-b">
                                <div className="flex items-center">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                        {post.author?.name?.charAt(0)?.toUpperCase()}
                                    </div>
                                    <div className="ml-3">
                                        <p className="font-medium text-gray-900">{post.author?.name || 'Unknown User'}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Post Content */}
                            <div className="flex-1 overflow-y-auto p-4">
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                                <p className="text-gray-600 mb-4 whitespace-pre-wrap">{post.content}</p>
                                
                                <div className="flex items-center text-xs text-gray-500">
                                    <FiCalendar className="w-3.5 h-3.5 mr-1.5" />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="border-t p-4">
                                <div className="flex items-center space-x-4">
                                    <button className="flex items-center text-gray-700 hover:text-red-500 transition-colors">
                                        <FiHeart className="w-6 h-6" />
                                    </button>
                                    <button className="flex items-center text-gray-700 hover:text-blue-500 transition-colors">
                                        <FiMessageCircle className="w-6 h-6" />
                                    </button>
                                    <Link 
                                        to={`/post/${post.$id}`}
                                        className="ml-auto text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostModal 