import React, { useState, useRef, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiMoreVertical, FiEdit2, FiTrash2 } from 'react-icons/fi'

function PostCard({
    $id, 
    title, 
    featuredimage, 
    content,
    createdAt,
    userid
}) {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = userData && userData.$id === userid;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const date = new Date(createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const status = await appwriteService.deletePost($id);
                if (status) {
                    await appwriteService.deleteFile(featuredimage);
                    navigate('/');
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };
    
    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300'>
            <div className='relative'>
                {isAuthor && (
                    <div className='absolute top-2 right-2 z-10' ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className='p-1 hover:bg-black/10 rounded-full transition-colors'
                        >
                            <FiMoreVertical className='w-5 h-5 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.5)]' />
                        </button>
                        {showMenu && (
                            <div className='absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg py-1 border'>
                                <Link 
                                    to={`/edit-post/${$id}`}
                                    className='flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100'
                                >
                                    <FiEdit2 className='w-4 h-4 mr-2' />
                                    Edit Post
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className='flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100'
                                >
                                    <FiTrash2 className='w-4 h-4 mr-2' />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
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
        </div>
    )
}

export default PostCard