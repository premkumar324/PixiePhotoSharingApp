import React, { useState, useRef, useEffect } from 'react'
import appwriteService from "../appwrite/config"
import {Link, useNavigate} from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FiMoreVertical, FiEdit2, FiTrash2, FiCalendar, FiUser } from 'react-icons/fi'

function PostCard({
    $id, 
    title, 
    featuredimage, 
    content,
    createdAt,
    userid,
    showAuthor = false
}) {
    const navigate = useNavigate();
    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = userData && userData.$id === userid;
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (showAuthor && userid) {
            // Fetch author information
            appwriteService.getUser(userid)
                .then(userData => {
                    if (userData) {
                        setAuthor(userData)
                    }
                })
                .catch(error => {
                    console.error("Error fetching author:", error)
                })
        }
    }, [userid, showAuthor])

    const formatDate = (dateString) => {
        try {
            // Handle both string timestamps and numeric timestamps
            const date = typeof dateString === 'string' 
                ? new Date(dateString)
                : new Date(parseInt(dateString));

            if (isNaN(date.getTime())) {
                return 'Recent'; // Fallback for invalid dates
            }

            return date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
        } catch (error) {
            console.error("Date formatting error:", error);
            return 'Recent';
        }
    };

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
        <div className='group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col'>
            <div className='relative flex-shrink-0'>
                {isAuthor && (
                    <div className='absolute top-3 right-3 z-10' ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className='p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors backdrop-blur-sm'
                        >
                            <FiMoreVertical className='w-5 h-5 text-white' />
                        </button>
                        {showMenu && (
                            <div className='absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100'>
                                <Link 
                                    to={`/edit-post/${$id}`}
                                    className='flex items-center px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors'
                                >
                                    <FiEdit2 className='w-4 h-4 mr-2' />
                                    Edit Post
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className='flex items-center w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors'
                                >
                                    <FiTrash2 className='w-4 h-4 mr-2' />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <Link to={`/post/${$id}`} className="block">
                    <div className='aspect-[4/3] relative overflow-hidden'>
                        <img 
                            src={appwriteService.getFilePreview(featuredimage)} 
                            alt={title}
                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                            loading="lazy"
                        />
                    </div>
                </Link>
            </div>
            <div className='flex flex-col flex-grow p-4 sm:p-5'>
                <Link to={`/post/${$id}`} className="flex-grow">
                    <div className='flex items-center text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3'>
                        <FiCalendar className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5' />
                        <span>{formatDate(createdAt)}</span>
                    </div>
                    <h2 className='text-lg sm:text-xl font-semibold mb-2 sm:mb-3 text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors'>{title}</h2>
                    <p className='text-sm sm:text-base text-gray-600 leading-relaxed line-clamp-3 mb-4'>{content}</p>
                </Link>
                <div className='mt-auto'>
                    <div className='inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700'>
                        Read More
                        <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                {showAuthor && (
                    <div className='flex items-center mt-4 pt-4 border-t border-gray-100'>
                        <div className='w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm'>
                            {author ? (
                                author.name?.charAt(0) || author.email?.charAt(0)
                            ) : (
                                <FiUser className="w-4 h-4" />
                            )}
                        </div>
                        <div className='ml-2'>
                            <p className='text-sm font-medium text-gray-900'>
                                {author ? (author.name || 'Anonymous') : 'Loading...'}
                            </p>
                            <p className='text-xs text-gray-500'>
                                {author ? author.email : ''}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostCard