import React, { useState } from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'
import { FiHeart, FiMessageCircle, FiBookmark, FiShare2 } from 'react-icons/fi'

function PostCard({
    $id, 
    title, 
    featuredimage, 
    content, 
    author = {}, 
    likes = 0,
    comments = [],
    createdAt
}) {
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [likesCount, setLikesCount] = useState(likes);

    const handleLike = (e) => {
        e.preventDefault();
        setIsLiked(!isLiked);
        setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);
        // TODO: Implement like functionality with Appwrite
    };

    const handleSave = (e) => {
        e.preventDefault();
        setIsSaved(!isSaved);
        // TODO: Implement save functionality with Appwrite
    };

    const date = new Date(createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-md mb-8 max-w-2xl mx-auto'>
            {/* Post Header */}
            <div className='p-4 flex items-center justify-between border-b'>
                <div className='flex items-center space-x-3'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px]'>
                        <img 
                            src={author.profileImage || 'https://via.placeholder.com/40'} 
                            alt={author.name}
                            className='w-full h-full object-cover rounded-full border-2 border-white'
                        />
                    </div>
                    <div>
                        <h3 className='font-semibold text-sm'>{author.name || 'Anonymous'}</h3>
                        <p className='text-xs text-gray-500'>{author.location}</p>
                    </div>
                </div>
                <button className='text-gray-500 hover:text-gray-700'>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                    </svg>
                </button>
            </div>

            {/* Post Image */}
            <div className='aspect-square relative'>
                <img 
                    src={appwriteService.getFilePreview(featuredimage)} 
                    alt={title}
                    className='w-full h-full object-cover'
                />
            </div>

            {/* Post Actions */}
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center space-x-4'>
                        <button 
                            onClick={handleLike}
                            className={`${isLiked ? 'text-red-500' : 'text-gray-700'} hover:scale-110 transition-transform`}
                        >
                            <FiHeart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                        </button>
                        <Link to={`/post/${$id}`} className='text-gray-700 hover:scale-110 transition-transform'>
                            <FiMessageCircle className='w-6 h-6' />
                        </Link>
                        <button className='text-gray-700 hover:scale-110 transition-transform'>
                            <FiShare2 className='w-6 h-6' />
                        </button>
                    </div>
                    <button 
                        onClick={handleSave}
                        className={`${isSaved ? 'text-black' : 'text-gray-700'} hover:scale-110 transition-transform`}
                    >
                        <FiBookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                    </button>
                </div>

                {/* Likes Count */}
                <div className='mb-2'>
                    <p className='font-semibold'>{likesCount.toLocaleString()} likes</p>
                </div>

                {/* Caption */}
                <div className='mb-2'>
                    <span className='font-semibold mr-2'>{author.name || 'Anonymous'}</span>
                    <span className='text-gray-700'>{title}</span>
                </div>

                {/* Comments Preview */}
                {comments.length > 0 && (
                    <Link to={`/post/${$id}`} className='text-gray-500 text-sm'>
                        View all {comments.length} comments
                    </Link>
                )}

                {/* Timestamp */}
                <p className='text-xs text-gray-500 mt-2'>{date}</p>
            </div>

            {/* Comment Input */}
            <div className='p-4 border-t flex items-center'>
                <input
                    type="text"
                    placeholder="Add a comment..."
                    className='flex-1 text-sm outline-none'
                />
                <button className='text-blue-500 font-semibold text-sm ml-2'>Post</button>
            </div>
        </div>
    )
}

export default PostCard