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
    const [loading, setLoading] = useState(true);

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
        let isMounted = true;

        const loadAuthor = async () => {
            if (showAuthor && userid) {
                try {
                    const user = await appwriteService.getUser(userid);
                    if (isMounted && user) {
                        setAuthor(user);
                    }
                } catch (error) {
                    console.error("Error loading author:", error);
                } finally {
                    if (isMounted) {
                        setLoading(false);
                    }
                }
            } else {
                setLoading(false);
            }
        };

        loadAuthor();
        return () => {
            isMounted = false;
        };
    }, [userid, showAuthor]);

    const formatDate = (dateString) => {
        try {
            const date = typeof dateString === 'string' 
                ? new Date(dateString)
                : new Date(parseInt(dateString));

            if (isNaN(date.getTime())) {
                return 'Recent';
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
        <div className='group bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col'>
            <div className='relative flex-shrink-0'>
                {isAuthor && (
                    <div className='absolute top-2 sm:top-3 right-2 sm:right-3 z-10' ref={menuRef}>
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className='p-1.5 sm:p-2 bg-black/20 hover:bg-black/30 rounded-full transition-colors backdrop-blur-sm'
                        >
                            <FiMoreVertical className='w-4 h-4 sm:w-5 sm:h-5 text-white' />
                        </button>
                        {showMenu && (
                            <div className='absolute right-0 mt-2 w-40 sm:w-48 bg-white rounded-xl shadow-lg py-1 border border-gray-100'>
                                <Link 
                                    to={`/edit-post/${$id}`}
                                    className='flex items-center px-3 sm:px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 active:bg-gray-100 transition-colors'
                                >
                                    <FiEdit2 className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2' />
                                    Edit Post
                                </Link>
                                <button 
                                    onClick={handleDelete}
                                    className='flex items-center w-full px-3 sm:px-4 py-2 text-sm text-red-600 hover:bg-red-50 active:bg-red-100 transition-colors'
                                >
                                    <FiTrash2 className='w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2' />
                                    Delete Post
                                </button>
                            </div>
                        )}
                    </div>
                )}
                <Link to={`/post/${$id}`} className="block">
                    <div className='aspect-[4/3] relative overflow-hidden bg-gray-100'>
                        <img 
                            src={appwriteService.getFilePreview(featuredimage)} 
                            alt={title}
                            className='w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300'
                            loading="lazy"
                        />
                    </div>
                </Link>
            </div>
            <div className='flex flex-col flex-grow p-3 sm:p-4'>
                <Link to={`/post/${$id}`} className="flex-grow">
                    <div className='flex items-center text-xs text-gray-500 mb-2'>
                        <FiCalendar className='w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5' />
                        <span>{formatDate(createdAt)}</span>
                    </div>
                    <h2 className='text-base sm:text-lg font-semibold mb-2 text-gray-800 line-clamp-2 group-hover:text-purple-600 transition-colors'>{title}</h2>
                    <p className='text-sm text-gray-600 leading-relaxed line-clamp-2 sm:line-clamp-3 mb-3'>{content}</p>
                </Link>
                <div className='mt-auto'>
                    <div className='inline-flex items-center text-sm font-medium text-purple-600 group-hover:text-purple-700'>
                        Read More
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.75 6.75L19.25 12L13.75 17.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19 12H4.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                {showAuthor && (
                    <div className='flex items-center mt-3 pt-3 sm:mt-4 sm:pt-4 border-t border-gray-100'>
                        <div className='w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm'>
                            {loading ? (
                                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : author ? (
                                author.name?.charAt(0).toUpperCase()
                            ) : (
                                <FiUser className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            )}
                        </div>
                        <div className='ml-2'>
                            <p className='text-xs sm:text-sm font-medium text-gray-900'>
                                {loading ? (
                                    <span className="inline-block w-20 sm:w-24 h-3 sm:h-4 bg-gray-200 animate-pulse rounded" />
                                ) : author ? (
                                    author.name
                                ) : (
                                    'Unknown User'
                                )}
                            </p>
                            {!loading && author?.email && (
                                <p className='text-xs text-gray-500 truncate max-w-[180px] sm:max-w-[200px]'>{author.email}</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default PostCard;