import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        // Get only the 6 most recent posts
        appwriteService.getPosts()
            .then((posts) => {
                if (posts) {
                    // Sort by date and take only the first 6
                    const sortedPosts = posts.documents
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .slice(0, 6);
                    setPosts(sortedPosts)
                }
            })
            .finally(() => setLoading(false))
    }, [])
  
    if (loading) {
        return (
            <div className="w-full py-8 mt-4 text-center">
                <Container>
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
                        <div className="h-48 bg-gray-200 rounded mb-8"></div>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full'>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
                <Container>
                    <div className="max-w-2xl mx-auto text-center">
                        <h1 className="text-4xl font-bold mb-4">Welcome to MegaBlog</h1>
                        <p className="text-xl mb-8">Share your stories, ideas, and experiences with the world.</p>
                        {userData ? (
                            <Link 
                                to="/add-post"
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
                            >
                                Create Your Post
                            </Link>
                        ) : (
                            <Link 
                                to="/signup"
                                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors inline-block"
                            >
                                Join the Community
                            </Link>
                        )}
                    </div>
                </Container>
            </section>

            {/* Recent Posts Section */}
            <section className="py-16">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Recent Posts</h2>
                        <p className="text-gray-600">Discover the latest stories from our community</p>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center text-gray-600">
                            <p className="mb-4">No posts yet. Be the first to share your story!</p>
                            {userData && (
                                <Link 
                                    to="/add-post"
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    Create a Post
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                                {posts.map((post) => (
                                    <PostCard key={post.$id} {...post} />
                                ))}
                            </div>
                            <div className="text-center mt-12">
                                <Link 
                                    to="/all-posts"
                                    className="inline-flex items-center text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    View All Posts
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                </Link>
                            </div>
                        </>
                    )}
                </Container>
            </section>
        </div>
    )
}

export default Home