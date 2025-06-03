import React, { useState } from 'react';
import { FiHeart, FiSmile } from 'react-icons/fi';

function Comment({ comment, onLike }) {
    return (
        <div className="flex items-start space-x-2 group mb-3">
            <img 
                src={comment.author?.profileImage || 'https://via.placeholder.com/32'} 
                alt={comment.author?.name || 'User'} 
                className="w-8 h-8 rounded-full"
            />
            <div className="flex-1">
                <div className="flex items-start">
                    <p className="text-sm">
                        <span className="font-semibold mr-2">{comment.author?.name || 'Anonymous'}</span>
                        {comment.content}
                    </p>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                    <span className="text-xs text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {comment.likes > 0 && (
                        <span className="text-xs text-gray-500">{comment.likes} likes</span>
                    )}
                    <button className="text-xs text-gray-500 hover:text-gray-700">Reply</button>
                </div>
            </div>
            <button 
                onClick={() => onLike?.(comment.$id)} 
                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"
            >
                <FiHeart className={`w-4 h-4 ${comment.isLiked ? 'fill-current text-red-500' : ''}`} />
            </button>
        </div>
    );
}

function Comments({ comments = [], onAddComment, onLikeComment }) {
    const [newComment, setNewComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            onAddComment?.(newComment);
            setNewComment('');
        }
    };

    return (
        <div className="w-full">
            {/* Comments List */}
            <div className="mb-4 max-h-[400px] overflow-y-auto">
                {comments.map((comment) => (
                    <Comment 
                        key={comment.$id} 
                        comment={comment} 
                        onLike={onLikeComment}
                    />
                ))}
            </div>

            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="relative">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 pr-24 border rounded-lg resize-none focus:outline-none focus:border-gray-400 min-h-[60px]"
                />
                <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <button 
                        type="button"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <FiSmile className="w-6 h-6" />
                    </button>
                    <button 
                        type="submit"
                        disabled={!newComment.trim()}
                        className="text-blue-500 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Post
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Comments; 