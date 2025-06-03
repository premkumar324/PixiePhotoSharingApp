import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import { FiCalendar } from 'react-icons/fi'

function ExploreGrid({ post, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        // Load author information
        const loadAuthor = async () => {
            try {
                const authorData = await appwriteService.getUser(post.userid);
                setAuthor(authorData);
            } catch (error) {
                console.error('Error loading author:', error);
            }
        };
        
        loadAuthor();
    }, [post.userid]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Author Header */}
            <div className="p-4 flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {author?.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <h3 className="font-medium text-gray-900">{author?.name || 'Unknown User'}</h3>
                    <div className="flex items-center text-xs text-gray-500">
                        <FiCalendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(post.$createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Image */}
            <div 
                className="relative aspect-video cursor-pointer"
                onClick={() => onClick(post)}
                role="button"
                tabIndex={0}
            >
                {/* Loading Skeleton */}
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-100 animate-pulse">
                        <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />
                    </div>
                )}
                
                <img 
                    src={appwriteService.getFilePreview(post.featuredimage)} 
                    alt={post.title}
                    className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                />
            </div>

            {/* Content */}
            <div className="p-4">
                <h2 className="font-semibold text-gray-900 mb-2">{post.title}</h2>
                <p className="text-gray-600 text-sm line-clamp-2">{post.content}</p>
            </div>
        </div>
    )
}

export default ExploreGrid 