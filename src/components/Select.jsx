import React, { forwardRef } from 'react'

const Select = forwardRef(function Select({
    options = [],
    label,
    className = "",
    ...props
}, ref) {
    const normalizedOptions = options.map(option => 
        typeof option === 'string' ? { label: option, value: option } : option
    );

    return (
        <div className="w-full">
            {label && (
                <label className="block text-gray-700 font-medium mb-2">
                    {label}
                </label>
            )}
            <select
                {...props}
                ref={ref}
                className={`px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:border-blue-500 appearance-none w-full ${className}`}
            >
                {normalizedOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
})

export default Select