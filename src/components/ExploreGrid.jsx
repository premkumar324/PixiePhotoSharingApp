import React, { useState } from 'react'
import appwriteService from "../appwrite/config"

function ExploreGrid({ post, onClick }) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [touchStart, setTouchStart] = useState(null);
    const [isPressed, setIsPressed] = useState(false);

    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientY);
        setIsPressed(true);
    };

    const handleTouchEnd = (e) => {
        setIsPressed(false);
        if (touchStart === null) return;
        
        const touchEnd = e.changedTouches[0].clientY;
        const diff = touchStart - touchEnd;
        
        // Only trigger click if it's a tap (minimal movement)
        if (Math.abs(diff) < 5) {
            onClick(post);
        }
        setTouchStart(null);
    };

    return (
        <div 
            className={`relative aspect-square cursor-pointer ${isPressed ? 'scale-98' : ''} transition-transform duration-200`}
            onClick={() => onClick(post)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            role="button"
            tabIndex={0}
            aria-label={`View post: ${post.title}`}
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
            
            {/* Mobile Touch Feedback */}
            <div className={`absolute inset-0 bg-black ${
                isPressed ? 'bg-opacity-30' : 'bg-opacity-0'
            } transition-all duration-200 md:group-hover:bg-opacity-30 flex items-center justify-center`}>
                <div className={`transform ${
                    isPressed ? 'scale-95 opacity-100' : 'scale-100 opacity-0'
                } transition-all duration-200 md:group-hover:opacity-100`}>
                    <h3 className="text-white text-center font-medium px-4 truncate text-sm sm:text-base">
                        {post.title}
                    </h3>
                </div>
            </div>
        </div>
    )
}

export default ExploreGrid 