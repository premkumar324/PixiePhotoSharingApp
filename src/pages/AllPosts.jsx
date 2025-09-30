import React, { useState, useEffect } from 'react'
import { Container } from '../components'
import PostGrid from '../components/PostGrid'
import PostModal from '../components/PostModal'
import appwriteService from "../appwrite/config"
import { Query } from 'appwrite'
import { useSelector } from 'react-redux'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedPost, setSelectedPost] = useState(null)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        // Fetch posts by the current user
        if (userData && userData.$id) {
            console.log('AllPosts - Fetching posts for user:', userData.$id)
            const queries = [Query.equal("userid", userData.$id)]
            
            appwriteService.getPosts(queries)
                .then((posts) => {
                    if (posts) {
                        console.log('AllPosts - Posts fetched:', posts.documents.length)
                        setPosts(posts.documents)
                    } else {
                        console.log('AllPosts - No posts returned')
                        setPosts([])
                    }
                })
                .catch((error) => {
                    console.error("Error fetching posts:", error)
                    setPosts([])
                })
                .finally(() => {
                    setLoading(false)
                })
        } else {
            // If userData is not available, set loading to false and posts to empty array
            console.log('AllPosts - No user data available, showing empty gallery')
            setPosts([])
            setLoading(false)
        }
    }, [userData])

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
                        <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your gallery...</p>
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
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Gallery is Empty</h1>
                        <p className="text-gray-600">Start sharing your amazing moments!</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className="w-full py-6 sm:py-8">
            <Container>
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Your Gallery</h1>
                    <p className="text-gray-600 text-sm mt-1">{posts.length} posts</p>
                </div>

                {/* Grid View */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1 sm:gap-2">
                    {posts.map((post) => (
                        <PostGrid
                            key={post.$id}
                            post={post}
                            onClick={handlePostClick}
                        />
                    ))}
                </div>

                {/* Modal */}
                {selectedPost && (
                    <PostModal
                        post={selectedPost}
                        onClose={() => setSelectedPost(null)}
                    />
                )}
            </Container>
        </div>
    )
}

export default AllPosts