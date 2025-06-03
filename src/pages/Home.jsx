import React, {useEffect, useState} from 'react'
import appwriteService from "../appwrite/config";
import {Container, PostCard} from '../components'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Query } from "appwrite";

function Home() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

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
  
    if (loading) {
        return (
            <div className="w-full py-8 px-4 sm:px-0">
                <Container>
                    <div className="flex flex-col items-center">
                        <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin"></div>
                        <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading posts...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className="w-full py-8 px-4 sm:px-0">
                <Container>
                    <div className="text-center">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">No posts yet</h1>
                        <p className="text-sm sm:text-base text-gray-600">Be the first to share something amazing!</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-6 sm:py-8'>
            <Container>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {posts.map((post) => (
                        <div key={post.$id}>
                            <PostCard {...post} showAuthor={true} />
                        </div>
                    ))}
                </div>
            </Container>
        </div>
    )
}

export default Home