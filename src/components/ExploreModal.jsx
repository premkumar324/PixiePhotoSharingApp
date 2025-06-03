import React, { useState, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import { FiX } from 'react-icons/fi'

function ExploreModal({ post, onClose }) {
    const [imageLoaded, setImageLoaded] = useState(false);

    // Handle escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!post) return null;

    return (
        <div 
            className="fixed inset-0 z-50 bg-black"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            {/* Close Button */}
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-white/70 hover:text-white transition-colors rounded-full bg-black/20 hover:bg-black/30"
            >
                <FiX className="w-6 h-6" />
            </button>

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

export default ExploreModal 