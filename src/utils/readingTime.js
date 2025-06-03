export function calculateReadingTime(content) {
    // Remove HTML tags
    const text = content.replace(/<[^>]*>/g, '');
    
    // Average reading speed (words per minute)
    const wordsPerMinute = 200;
    
    // Count words
    const words = text.trim().split(/\s+/).length;
    
    // Calculate reading time
    const readingTime = Math.ceil(words / wordsPerMinute);
    
    return readingTime;
} 