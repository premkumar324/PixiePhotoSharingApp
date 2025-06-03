import React from 'react'
import appwriteService from "../appwrite/config"
import {Link} from 'react-router-dom'

function PostCard({
    $id, 
    title, 
    featuredimage, 
    content,
    createdAt
}) {
    const date = new Date(createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    
    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'>
            <Link to={`/post/${$id}`}>
                <div className='aspect-video relative'>
                    <img 
                        src={appwriteService.getFilePreview(featuredimage)} 
                        alt={title}
                        className='w-full h-full object-cover'
                    />
                </div>
                <div className='p-4'>
                    <h2 className='text-xl font-semibold mb-2 text-gray-800 line-clamp-2'>{title}</h2>
                    <p className='text-gray-600 line-clamp-3 mb-4'>{content}</p>
                    <p className='text-sm text-gray-500'>{date}</p>
                </div>
            </Link>
        </div>
    )
}

export default PostCard