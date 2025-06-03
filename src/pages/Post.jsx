import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Container } from "../components";
import { useSelector } from "react-redux";
import { FiMoreVertical, FiEdit2, FiTrash2, FiClock, FiCalendar, FiArrowLeft } from 'react-icons/fi';

export default function Post() {
    const [post, setPost] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);
    const isAuthor = post && userData ? post.userid === userData.$id : false;

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
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) setPost(post);
                else navigate("/");
            });
        } else navigate("/");
    }, [slug, navigate]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                const status = await appwriteService.deletePost(post.$id);
                if (status) {
                    await appwriteService.deleteFile(post.featuredimage);
                    navigate("/");
                }
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateReadingTime = (content) => {
        const wordsPerMinute = 200;
        const words = content.trim().split(/\s+/).length;
        const readingTime = Math.ceil(words / wordsPerMinute);
        return readingTime;
    };

    return post ? (
        <div className="py-8 bg-gray-50 min-h-screen">
            <Container>
                {/* Back Navigation */}
                <div className="max-w-4xl mx-auto mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <FiArrowLeft className="w-5 h-5 mr-2" />
                        <span>Back to Posts</span>
                    </Link>
                </div>

                <article className="max-w-4xl mx-auto bg-white rounded-2xl overflow-hidden shadow-sm">
                    <div className="relative">
                        {/* Featured Image */}
                        <div className="aspect-[21/9] w-full">
                            <img
                                src={appwriteService.getFilePreview(post.featuredimage)}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Options Menu */}
                        {isAuthor && (
                            <div className="absolute top-4 right-4" ref={menuRef}>
                                <div className="relative">
                                    <button
                                        onClick={() => setShowMenu(!showMenu)}
                                        className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
                                    >
                                        <FiMoreVertical className="w-5 h-5 text-gray-700" />
                                    </button>
                                    {showMenu && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 border animate-fade-in">
                                            <Link
                                                to={`/edit-post/${post.$id}`}
                                                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                                            >
                                                <FiEdit2 className="w-4 h-4 mr-2" />
                                                Edit Post
                                            </Link>
                                            <button
                                                onClick={handleDelete}
                                                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
                                            >
                                                <FiTrash2 className="w-4 h-4 mr-2" />
                                                Delete Post
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Post Content */}
                    <div className="px-8 py-10">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <FiCalendar className="w-4 h-4 mr-2" />
                                    <span>{formatDate(post.$createdAt)}</span>
                                </div>
                                <div className="flex items-center">
                                    <FiClock className="w-4 h-4 mr-2" />
                                    <span>{calculateReadingTime(post.content)} min read</span>
                                </div>
                                {post.$updatedAt !== post.$createdAt && (
                                    <div className="text-gray-500 italic">
                                        Updated: {formatDate(post.$updatedAt)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                {post.content}
                            </p>
                        </div>
                    </div>

                    {/* Article Footer */}
                    <div className="px-8 py-6 bg-gray-50 border-t">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
                            >
                                <FiArrowLeft className="w-4 h-4 mr-2" />
                                Back to Posts
                            </Link>
                            {isAuthor && (
                                <div className="text-sm text-gray-500">
                                    You are the author of this post
                                </div>
                            )}
                        </div>
                    </div>
                </article>
            </Container>
        </div>
    ) : null;
}
