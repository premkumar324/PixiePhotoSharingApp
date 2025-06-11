import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-gradient-to-r from-indigo-600 to-purple-600",
    textColor = "text-white",
    className = "",
    ...props
}) {
    return (
        <button className={`px-4 py-2 rounded-lg hover:shadow-md transition-all duration-200 ${bgColor} ${textColor} ${className}`} {...props}>
            {children}
        </button>
    );
}
