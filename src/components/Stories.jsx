import React from 'react';

function StoryCircle({ user, isAddStory = false }) {
    return (
        <div className='flex flex-col items-center space-y-1'>
            <div className={`w-16 h-16 rounded-full p-[2px] ${!isAddStory ? 'bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500' : ''}`}>
                {isAddStory ? (
                    <div className='w-full h-full rounded-full border-2 border-gray-300 flex items-center justify-center'>
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </div>
                ) : (
                    <img 
                        src={user.profileImage || 'https://via.placeholder.com/64'} 
                        alt={user.name}
                        className='w-full h-full object-cover rounded-full border-2 border-white'
                    />
                )}
            </div>
            <span className='text-xs truncate w-16 text-center'>
                {isAddStory ? 'Add Story' : user.name}
            </span>
        </div>
    );
}

function Stories() {
    // Mock data - replace with real data from your backend
    const stories = [
        { id: 1, name: 'John Doe', profileImage: 'https://via.placeholder.com/64' },
        { id: 2, name: 'Jane Smith', profileImage: 'https://via.placeholder.com/64' },
        { id: 3, name: 'Mike Johnson', profileImage: 'https://via.placeholder.com/64' },
        { id: 4, name: 'Sarah Williams', profileImage: 'https://via.placeholder.com/64' },
        { id: 5, name: 'Tom Brown', profileImage: 'https://via.placeholder.com/64' },
        { id: 6, name: 'Emily Davis', profileImage: 'https://via.placeholder.com/64' },
    ];

    return (
        <div className='bg-white rounded-xl shadow-md p-4 mb-4 max-w-2xl mx-auto'>
            <div className='flex space-x-4 overflow-x-auto pb-2 scrollbar-hide'>
                <StoryCircle isAddStory={true} user={{ name: 'Your Story' }} />
                {stories.map(user => (
                    <StoryCircle key={user.id} user={user} />
                ))}
            </div>
        </div>
    );
}

export default Stories; 