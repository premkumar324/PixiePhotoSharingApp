import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container} from '../components'
import { Query } from "appwrite";
import ExploreGrid from '../components/ExploreGrid'
import ExploreModal from '../components/ExploreModal'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState(null)

    useEffect(() => {
        // Only fetch active/public posts
        const queries = [Query.equal("status", "active")]
        
        appwriteService.getPosts(queries)
            .then((posts) => {
                if (posts) {
                    setPosts(posts.documents)
                }
            })
            .catch((error) => {
                console.error("Error fetching posts:", error)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

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
            <div className="w-full py-8">
                <Container>
                    <div className="flex flex-col items-center">
                        <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                        <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading amazing posts...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8">
                <Container>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">No posts yet</h1>
                        <p className="text-gray-600">Be the first to share something amazing!</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-6 sm:py-8'>
            <Container>
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Explore</h1>
                        <p className="text-gray-600 text-sm mt-1">Discover amazing posts from our community</p>
                    </div>
                </div>

                {/* Grid Layout */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2">
                    {posts.map((post) => (
                        <ExploreGrid
                            key={post.$id}
                            post={post}
                            onClick={handlePostClick}
                        />
                    ))}
                </div>

                {/* Modal */}
                {selectedPost && (
                    <ExploreModal
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                    />
                )}
            </Container>
        </div>
    )
}

export default Home