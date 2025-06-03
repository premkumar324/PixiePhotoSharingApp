import React from 'react';
import { FiSettings, FiGrid, FiBookmark, FiTag } from 'react-icons/fi';

function Profile({ user = {} }) {
    const stats = [
        { label: 'posts', value: user.posts?.length || 0 },
        { label: 'followers', value: user.followers?.length || 0 },
        { label: 'following', value: user.following?.length || 0 },
    ];

    return (
        <div className='max-w-4xl mx-auto p-4'>
            {/* Profile Header */}
            <div className='flex flex-col md:flex-row items-center md:items-start mb-8'>
                {/* Profile Picture */}
                <div className='w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-[2px] mb-4 md:mb-0 md:mr-8'>
                    <img 
                        src={user.profileImage || 'https://via.placeholder.com/160'} 
                        alt={user.name}
                        className='w-full h-full rounded-full border-2 border-white object-cover'
                    />
                </div>

                {/* Profile Info */}
                <div className='flex-1'>
                    <div className='flex flex-col md:flex-row items-center md:items-center mb-4'>
                        <h1 className='text-2xl font-light mb-2 md:mb-0 md:mr-4'>{user.username}</h1>
                        <div className='flex space-x-2'>
                            <button className='px-4 py-1.5 bg-gray-100 rounded-md font-semibold text-sm'>
                                Edit Profile
                            </button>
                            <button className='p-1.5 bg-gray-100 rounded-md'>
                                <FiSettings className='w-5 h-5' />
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className='flex justify-center md:justify-start space-x-8 mb-4'>
                        {stats.map(({ label, value }) => (
                            <div key={label} className='text-center md:text-left'>
                                <span className='font-semibold'>{value}</span>{' '}
                                <span className='text-gray-600'>{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Bio */}
                    <div className='text-center md:text-left'>
                        <h2 className='font-semibold'>{user.name}</h2>
                        <p className='text-gray-600 whitespace-pre-line'>{user.bio}</p>
                        {user.website && (
                            <a href={user.website} className='text-blue-900 font-semibold' target='_blank' rel='noopener noreferrer'>
                                {user.website}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile Tabs */}
            <div className='border-t'>
                <div className='flex justify-center'>
                    <button className='flex items-center px-6 py-3 text-sm font-semibold border-t border-black -mt-[1px]'>
                        <FiGrid className='w-4 h-4 mr-1' />
                        POSTS
                    </button>
                    <button className='flex items-center px-6 py-3 text-sm font-semibold text-gray-500'>
                        <FiBookmark className='w-4 h-4 mr-1' />
                        SAVED
                    </button>
                    <button className='flex items-center px-6 py-3 text-sm font-semibold text-gray-500'>
                        <FiTag className='w-4 h-4 mr-1' />
                        TAGGED
                    </button>
                </div>
            </div>

            {/* Photo Grid */}
            <div className='grid grid-cols-3 gap-1 mt-1'>
                {user.posts?.map((post) => (
                    <div key={post.$id} className='aspect-square relative group cursor-pointer'>
                        <img 
                            src={post.featuredimage} 
                            alt={post.title}
                            className='w-full h-full object-cover'
                        />
                        <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-6 text-white'>
                            <div className='flex items-center'>
                                <FiHeart className='w-6 h-6 mr-2' />
                                <span className='font-semibold'>{post.likes}</span>
                            </div>
                            <div className='flex items-center'>
                                <FiMessageCircle className='w-6 h-6 mr-2' />
                                <span className='font-semibold'>{post.comments?.length}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Profile; 