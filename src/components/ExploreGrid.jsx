import React from 'react'
import appwriteService from "../appwrite/config"

function ExploreGrid({ post, onClick }) {
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
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <h3 className="text-white text-center font-medium px-4 truncate">
                        {post.title}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default ExploreGrid 