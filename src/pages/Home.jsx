import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container} from '../components'
import { Query } from "appwrite";
import ExploreGrid from '../components/ExploreGrid'
import ExploreModal from '../components/ExploreModal'
import { FiRefreshCw } from 'react-icons/fi'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [selectedPost, setSelectedPost] = useState(null)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

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

            <Container>
                <div className="py-6 sm:py-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
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