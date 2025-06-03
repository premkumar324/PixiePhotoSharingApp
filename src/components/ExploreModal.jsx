import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import appwriteService from "../appwrite/config"
import { FiX, FiCalendar, FiMaximize2, FiMinimize2 } from 'react-icons/fi'

function ExploreModal({ post, onClose }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle swipe down to close
    const handleTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientY);
    };

    const handleTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        const distance = touchEnd - touchStart;
        const isDownSwipe = distance > 100;
        if (isDownSwipe) onClose();
        setTouchStart(null);
        setTouchEnd(null);
    };

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
        <div 
            className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 backdrop-blur-sm" 
            aria-labelledby="modal-title" 
            role="dialog" 
            aria-modal="true"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div 
                    className="relative inline-block w-full max-w-4xl text-left transform transition-all sm:my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Mobile Swipe Indicator */}
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 md:hidden">
                        <div className="w-12 h-1 bg-white/30 rounded-full"></div>
                    </div>

                    {/* Close Button */}
                    <button 
                        onClick={onClose}
                        className="absolute -top-12 right-0 z-10 p-2 text-white/70 hover:text-white transition-colors md:top-4 md:right-4"
                    >
                        <FiX className="w-6 h-6" />
                    </button>

                    <div className={`bg-white rounded-t-xl md:rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
                        <div className="flex flex-col md:flex-row">
                            {/* Image Section */}
                            <div className={`relative w-full ${isFullscreen ? 'h-full' : 'md:w-7/12'} bg-black flex items-center justify-center`}>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 bg-gray-900 animate-pulse flex items-center justify-center">
                                        <div className="w-10 h-10 border-4 border-white/20 border-t-white/100 rounded-full animate-spin"></div>
                                    </div>
                                )}
                                <img 
                                    src={appwriteService.getFilePreview(post.featuredimage)} 
                                    alt={post.title}
                                    className={`w-full h-full object-contain ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                                    onLoad={() => setImageLoaded(true)}
                                />
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="absolute bottom-4 right-4 p-2 bg-black/20 hover:bg-black/30 rounded-full text-white backdrop-blur-sm transition-colors"
                                >
                                    {isFullscreen ? (
                                        <FiMinimize2 className="w-5 h-5" />
                                    ) : (
                                        <FiMaximize2 className="w-5 h-5" />
                                    )}
                                </button>
                            </div>

                            {/* Content Section */}
                            <div className={`w-full ${isFullscreen ? 'hidden' : 'md:w-5/12'} flex flex-col h-full max-h-[60vh] md:max-h-[80vh]`}>
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
                                <div className="flex-1 overflow-y-auto p-4 overscroll-contain">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-2">{post.title}</h2>
                                    <p className="text-gray-600 mb-4 whitespace-pre-wrap text-sm sm:text-base">{post.content}</p>
                                    
                                    <div className="flex items-center text-xs text-gray-500">
                                        <FiCalendar className="w-3.5 h-3.5 mr-1.5" />
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                </div>

                                {/* View Details Link */}
                                <div className="border-t p-4">
                                    <Link 
                                        to={`/post/${post.$id}`}
                                        className="inline-flex items-center justify-center w-full text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg px-4 py-2.5 transition-colors"
                                    >
                                        View Full Post
                                        <svg className="w-4 h-4 ml-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                            <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
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

export default ExploreModal 