import React from 'react';

const categories = [
    "Technology",
    "Programming",
    "Lifestyle",
    "Health",
    "Travel",
    "Food",
    "Fashion",
    "Business",
    "Entertainment",
    "Sports"
];

function PostCategories({ selectedCategories, onChange }) {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
            </label>
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        type="button"
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                            selectedCategories.includes(category)
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                        onClick={() => {
                            if (selectedCategories.includes(category)) {
                                onChange(selectedCategories.filter((c) => c !== category));
                            } else {
                                onChange([...selectedCategories, category]);
                            }
                        }}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PostCategories; 