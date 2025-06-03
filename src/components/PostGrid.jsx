import React from 'react'
import appwriteService from "../appwrite/config"
import { FiHeart, FiMessageCircle } from 'react-icons/fi'

function PostGrid({ post, onClick }) {
    return (
        <div 
            className="relative aspect-square group cursor-pointer"
            onClick={() => onClick(post)}
        >
            <img 
                src={appwriteService.getFilePreview(post.featuredimage)} 
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                <div className="flex items-center space-x-6 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center text-white">
                        <FiHeart className="w-6 h-6" />
                        <span className="ml-2 text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center text-white">
                        <FiMessageCircle className="w-6 h-6" />
                        <span className="ml-2 text-sm font-medium">0</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostGrid 