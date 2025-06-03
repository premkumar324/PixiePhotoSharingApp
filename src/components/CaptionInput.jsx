import React, { useState } from 'react';
import { FiSmile } from 'react-icons/fi';

function CaptionInput({ defaultValue = '', onChange, maxLength = 2200 }) {
    const [caption, setCaption] = useState(defaultValue);

    const handleChange = (e) => {
        const newValue = e.target.value;
        if (newValue.length <= maxLength) {
            setCaption(newValue);
            onChange?.(newValue);
        }
    };

    return (
        <div className="w-full">
            <div className="relative">
                <textarea
                    value={caption}
                    onChange={handleChange}
                    placeholder="Write a caption..."
                    className="w-full min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:border-gray-400"
                    maxLength={maxLength}
                />
                <button 
                    className="absolute bottom-3 right-3 text-gray-500 hover:text-gray-700"
                    onClick={() => {/* Emoji picker integration can be added here */}}
                >
                    <FiSmile className="w-6 h-6" />
                </button>
            </div>
            <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-500">
                    {caption.length}/{maxLength}
                </span>
            </div>
        </div>
    );
}

export default CaptionInput; 