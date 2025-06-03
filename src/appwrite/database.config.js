// Database Collections
export const Collections = {
    Posts: 'posts',
    Users: 'users'
};

// Collection Schemas
export const Schemas = {
    Posts: {
        title: 'string',
        content: 'string',
        featuredimage: 'string',
        status: 'string',
        userId: 'string'
    },
    
    Users: {
        name: 'string',
        email: 'string',
        username: 'string'
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
    ]
}; 