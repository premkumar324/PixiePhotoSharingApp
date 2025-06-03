// Database Collections
export const Collections = {
    Posts: 'posts',
    Users: 'users',
    Comments: 'comments',
    Likes: 'likes',
    Followers: 'followers',
    Stories: 'stories'
};

// Collection Schemas
export const Schemas = {
    Posts: {
        // Required fields from the original blog
        title: 'string',
        content: 'string',
        featuredimage: 'string',
        status: 'string',
        userId: 'string',
        
        // New Instagram-like fields
        location: 'string?',
        tags: 'string[]',
        likes_count: 'integer',
        comments_count: 'integer',
        filter: 'string?'
    },
    
    Users: {
        name: 'string',
        email: 'string',
        username: 'string',
        bio: 'string?',
        website: 'string?',
        profileImage: 'string?',
        posts_count: 'integer',
        followers_count: 'integer',
        following_count: 'integer'
    },
    
    Comments: {
        postId: 'string',
        userId: 'string',
        content: 'string',
        likes_count: 'integer'
    },
    
    Likes: {
        postId: 'string',
        userId: 'string',
        type: 'string' // 'post' or 'comment'
    },
    
    Followers: {
        followerId: 'string',
        followingId: 'string',
        status: 'string' // 'pending' or 'accepted' for private accounts
    },
    
    Stories: {
        userId: 'string',
        mediaUrl: 'string',
        type: 'string', // 'image' or 'video'
        duration: 'integer',
        viewers: 'string[]',
        expiresAt: 'datetime'
    }
};

// Indexes for optimizing queries
export const Indexes = {
    Posts: [
        {
            key: 'userId',
            type: 'key',
            attributes: ['userId']
        },
        {
            key: 'createdAt',
            type: 'key',
            attributes: ['$createdAt']
        }
    ],
    Comments: [
        {
            key: 'postId',
            type: 'key',
            attributes: ['postId']
        }
    ],
    Likes: [
        {
            key: 'postId_userId',
            type: 'key',
            attributes: ['postId', 'userId']
        }
    ],
    Followers: [
        {
            key: 'followerId',
            type: 'key',
            attributes: ['followerId']
        },
        {
            key: 'followingId',
            type: 'key',
            attributes: ['followingId']
        }
    ],
    Stories: [
        {
            key: 'userId_expiresAt',
            type: 'key',
            attributes: ['userId', 'expiresAt']
        }
    ]
}; 