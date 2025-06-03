import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";
import { Query } from "appwrite";
import { useSelector } from 'react-redux'

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const userData = useSelector((state) => state.auth.userData)

    useEffect(() => {
        if (userData) {
            const queries = [
                Query.equal("userid", userData.$id),
                Query.equal("status", "active")
            ]
            
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
        } else {
            setLoading(false)
        }
    }, [userData])

    if (loading) {
        return (
            <div className='w-full py-12'>
                <Container>
                    <div className='flex flex-col items-center'>
                        <div className='w-24 h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin'></div>
                        <p className='mt-4 text-gray-600'>Loading your stories...</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (!userData) {
        return (
            <div className='w-full py-12'>
                <Container>
                    <div className='text-center'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>Please Login</h2>
                        <p className='text-gray-600'>You need to be logged in to view your stories.</p>
                    </div>
                </Container>
            </div>
        )
    }

    if (posts.length === 0) {
        return (
            <div className='w-full py-12'>
                <Container>
                    <div className='text-center'>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>No Stories Yet</h2>
                        <p className='text-gray-600'>Share your first story with the community.</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-8 sm:py-12'>
            <Container>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8'>My Gallery</h1>
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
                        {posts.map((post) => (
                            <div key={post.$id} className='h-full'>
                                <PostCard {...post} />
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    )
}

export default AllPosts