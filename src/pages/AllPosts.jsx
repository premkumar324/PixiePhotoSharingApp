import React, {useState, useEffect} from 'react'
import { Container, PostCard } from '../components'
import appwriteService from "../appwrite/config";

function AllPosts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        appwriteService.getPosts([])
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
            <div className='w-full py-12'>
                <Container>
                    <div className='flex flex-col items-center'>
                        <div className='w-24 h-24 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin'></div>
                        <p className='mt-4 text-gray-600'>Loading stories...</p>
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
                        <p className='text-gray-600'>Be the first to share your story with the community.</p>
                    </div>
                </Container>
            </div>
        )
    }

    return (
        <div className='w-full py-12'>
            <Container>
                <div className='max-w-7xl mx-auto'>
                    <h1 className='text-3xl font-bold text-gray-900 mb-8'>Gallery</h1>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
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