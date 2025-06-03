import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard, Logo} from '../components'
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
            <section className="relative overflow-hidden bg-gradient-to-br from-pink-500 via-purple-500 to-violet-600">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNMCAwaDIwdjIwSDB6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTAgMGgydjJIMHoiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2EpIi8+PC9zdmc+')] opacity-30"></div>
                <Container>
                    <div className="relative py-24 px-4 sm:px-6 lg:px-8">
                        <div className="relative mx-auto max-w-2xl text-center">
                            <div className="mb-8 flex justify-center">
                                <div className="w-20 h-20">
                                    <Logo />
                                </div>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-6">
                                Welcome to Pixie
                            </h1>
                            <p className="mt-6 text-xl leading-8 text-gray-100">
                                Where every moment becomes a masterpiece. Share your world through beautiful images and connect with fellow creators.
                            </p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                {userData ? (
                                    <Link 
                                        to="/add-post"
                                        className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-sm hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
                                    >
                                        Create Your Story
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/signup"
                                        className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-purple-600 shadow-sm hover:bg-purple-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:scale-105"
                                    >
                                        Start Your Journey
                                    </Link>
                                )}
                                <Link 
                                    to="/all-posts" 
                                    className="text-lg font-semibold leading-6 text-white hover:text-purple-100 transition-colors"
                                >
                                    Explore Gallery <span aria-hidden="true">→</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </Container>
            </section>

            {/* Recent Posts Section */}
            <section className="py-16">
                <Container>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Featured Stories</h2>
                        <p className="text-gray-600">Discover inspiring moments shared by our community</p>
                    </div>

                    {posts.length === 0 ? (
                        <div className="text-center text-gray-600">
                            <p className="mb-4">No stories yet. Be the first to share your moment!</p>
                            {userData && (
                                <Link 
                                    to="/add-post"
                                    className="text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    Create a Story
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
                                    className="inline-flex items-center text-pink-500 hover:text-pink-600 font-medium"
                                >
                                    View All Stories
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