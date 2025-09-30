import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container} from '../components'
import { Query } from "appwrite";
import ExploreGrid from '../components/ExploreGrid'
import ExploreModal from '../components/ExploreModal'
import { FiRefreshCw, FiCamera, FiImage, FiUsers, FiChevronDown } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import mountainHero from '../assets/mountain-hero.png'

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
            <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <Container>
                    <div className="py-8">
                        <div className="animate-pulse space-y-4">
                            <div className="h-8 w-48 bg-indigo-200 rounded-md"></div>
                            <div className="h-4 w-64 bg-purple-100 rounded-md"></div>
                            <div className="grid grid-cols-3 gap-1 sm:gap-2">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="aspect-square bg-pink-100 rounded-md"></div>
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
            <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
                <Container>
                    <div className="py-8">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-indigo-800 mb-4">No posts yet</h1>
                            <p className="text-purple-700 mb-8">Be the first to share something amazing!</p>
                            <button
                                onClick={() => fetchPosts()}
                                className="inline-flex items-center px-4 py-2 border border-purple-300 rounded-lg text-sm font-medium text-purple-700 hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
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
            className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Pull to Refresh Indicator */}
            {refreshing && (
                <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center py-2 bg-gradient-to-b from-indigo-100">
                    <FiRefreshCw className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="ml-2 text-sm text-purple-600">Refreshing...</span>
                </div>
            )}

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10 z-10"></div>
                <div className="absolute inset-0 z-0">
                    {/* Mountain hero image background */}
                    <img 
                        src={mountainHero} 
                        alt="Mountain landscape" 
                        className="h-full w-full object-cover object-center filter blur-sm scale-105 opacity-95 brightness-125 contrast-110 saturate-125"
                    />
                    {/* Additional color overlay to match app theme */}
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/15 via-purple-500/15 to-pink-500/15 mix-blend-soft-light"></div>
                    {/* Add a subtle light glow */}
                    <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
                </div>
                
                <Container>
                    <div className="relative z-20 py-8 sm:py-10 px-4 sm:px-6 flex items-center justify-center">
                        <div className="max-w-lg w-full text-center backdrop-blur-sm bg-black/10 p-5 rounded-xl shadow-lg border border-white/20">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-shadow-lg">
                                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-pink-100 to-white">Capture & Share</span>
                                <span className="block mt-1 text-white">Your World</span>
                            </h1>
                            <p className="text-base sm:text-lg opacity-90 max-w-md mx-auto mb-5 text-shadow-sm">
                                Join our community of photographers sharing their best moments
                            </p>
                            
                            <div className="flex flex-wrap gap-4 justify-center">
                                {authStatus ? (
                                    <>
                                        <Link 
                                            to="/add-post" 
                                            className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
                                        >
                                            <FiCamera className="mr-2" />
                                            Share Your Moment
                                        </Link>
                                        <Link 
                                            to="/all-posts" 
                                            className="inline-flex items-center px-5 py-2.5 border border-white/30 text-sm font-medium rounded-lg shadow-lg text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white/50 transition-all transform hover:scale-105"
                                        >
                                            <FiImage className="mr-2" />
                                            Your Posts
                                        </Link>
                                    </>
                                ) : (
                                    <Link 
                                        to="/signup" 
                                        className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
                                    >
                                        <FiUsers className="mr-2" />
                                        Join Community
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Scroll indicator */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-center pb-2 z-20">
                        <button 
                            onClick={scrollToContent}
                            className="animate-bounce bg-white/30 rounded-full p-1.5 hover:bg-white/50 transition-all focus:outline-none shadow-lg border border-white/40"
                            aria-label="Scroll to content"
                        >
                            <FiChevronDown className="h-5 w-5" />
                        </button>
                    </div>
                </Container>
            </div>

            <div id="explore-content">
                <Container>
                    <div className="py-6 sm:py-8">
                        {/* Section Header */}
                        <div className="max-w-2xl mx-auto mb-6">
                            <h2 className="text-2xl font-bold text-indigo-900">Latest Posts</h2>
                            <p className="text-purple-700 text-sm mt-1">Discover amazing posts from our community</p>
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