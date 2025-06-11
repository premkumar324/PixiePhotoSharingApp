import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container} from '../components'
import { Query } from "appwrite";
import ExploreGrid from '../components/ExploreGrid'
import ExploreModal from '../components/ExploreModal'
import { FiRefreshCw, FiCamera, FiImage, FiTrendingUp, FiUsers, FiChevronDown } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const authStatus = useSelector((state) => state.auth.status)

    const fetchPosts = async () => {
        try {
            const queries = [Query.equal("status", "active")]
            const response = await appwriteService.getPosts(queries)
            if (response) {
                setPosts(response.documents)
            }
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    useEffect(() => {
        fetchPosts().finally(() => setLoading(false))
    }, [])

    // Handle pull to refresh
    const handleTouchStart = (e) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientY)
    }

    const handleTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientY)
    }

    const handleTouchEnd = async () => {
        if (!touchStart || !touchEnd) return
        
        const distance = touchEnd - touchStart
        const isTopOfPage = window.scrollY === 0
        const isPullDown = distance > 100

        if (isTopOfPage && isPullDown && !refreshing) {
            setRefreshing(true)
            await fetchPosts()
            setRefreshing(false)
        }
    }

    // Scroll to content section
    const scrollToContent = () => {
        const contentSection = document.getElementById('explore-content');
        if (contentSection) {
            contentSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handlePostClick = (post) => {
        // Load author information before showing modal
        appwriteService.getUser(post.userid)
            .then(author => {
                setSelectedPost({ ...post, author })
            })
            .catch(error => {
                console.error("Error loading author:", error)
                setSelectedPost(post)
            })
    }
  
    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white">
                <Container>
                    <div className="py-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 w-48 bg-gray-200 rounded"></div>
                            <div className="h-4 w-64 bg-gray-100 rounded"></div>
                            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-gray-100 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white">
                <Container>
                    <div className="py-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-800 mb-4">No posts yet</h1>
                            <p className="text-gray-600 mb-8">Be the first to share something amazing!</p>
                            <button
                                onClick={() => fetchPosts()}
                                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <FiRefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </button>
                        </div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div 
            className="w-full min-h-screen bg-white"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull to Refresh Indicator */}
            {refreshing && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-2 bg-gradient-to-b from-gray-100">
                    <FiRefreshCw className="w-5 h-5 text-gray-600 animate-spin" />
                    <span className="ml-2 text-sm text-gray-600">Refreshing...</span>
                </div>
            )}

            {/* Compact Hero Section */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white relative max-h-[60vh] overflow-hidden">
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>
                <div className="absolute inset-0 z-0">
                    {/* Background image would be ideal here */}
                    <div className="h-full w-full bg-cover bg-center" 
                         style={{backgroundImage: "url('https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1470&auto=format&fit=crop')", 
                                opacity: 0.7}}></div>
                </div>
                
                <Container>
                    <div className="relative z-20 py-10 sm:py-12 px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 text-center md:text-left mb-6 md:mb-0">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">
                                Capture & Share Your World
                            </h1>
                            <p className="text-lg opacity-90 max-w-md mx-auto md:mx-0 mb-4">
                                Join our community of photographers sharing their best moments
                            </p>
                            
                            {authStatus ? (
                                <Link 
                                    to="/add-post" 
                                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    <FiCamera className="mr-2" />
                                    Share Your Moment
                                </Link>
                            ) : (
                                <Link 
                                    to="/signup" 
                                    className="inline-flex items-center px-5 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
                                >
                                    <FiUsers className="mr-2" />
                                    Join Community
                                </Link>
                            )}
                        </div>
                        
                        {/* Feature Icons - Now in a column on the right */}
                        <div className="md:w-1/3 grid grid-cols-3 gap-3">
                            <div className="text-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white bg-opacity-20 mx-auto">
                                    <FiImage className="h-5 w-5" />
                                </div>
                                <p className="mt-1 text-xs font-medium">Beautiful Galleries</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white bg-opacity-20 mx-auto">
                                    <FiUsers className="h-5 w-5" />
                                </div>
                                <p className="mt-1 text-xs font-medium">Connect</p>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center h-10 w-10 rounded-md bg-white bg-opacity-20 mx-auto">
                                    <FiTrendingUp className="h-5 w-5" />
                                </div>
                                <p className="mt-1 text-xs font-medium">Discover</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Scroll indicator */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-3 z-20">
                        <button 
                            onClick={scrollToContent}
                            className="animate-bounce bg-white bg-opacity-20 rounded-full p-1 hover:bg-opacity-30 transition-all focus:outline-none"
                            aria-label="Scroll to content"
                        >
                            <FiChevronDown className="h-6 w-6" />
                        </button>
                    </div>
                </Container>
            </div>

            <div id="explore-content">
                <Container>
                    <div className="py-6 sm:py-8">
                        {/* Section Header */}
                        <div className="max-w-2xl mx-auto mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Latest Posts</h2>
                            <p className="text-gray-600 text-sm mt-1">Discover amazing posts from our community</p>
                        </div>

                        {/* Feed Layout */}
                        <div className="max-w-2xl mx-auto space-y-6">
                            {posts.map((post) => (
                                <ExploreGrid
                                    key={post.$id}
                                    post={post}
                                    onClick={handlePostClick}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </div>

            {/* Modal */}
            {selectedPost && (
                <ExploreModal
                    post={selectedPost}
                    onClose={() => setSelectedPost(null)}
                />
            )}
        </div>
    )
}

export default Home