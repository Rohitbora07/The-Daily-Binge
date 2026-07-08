export const calculateTrendingScore = (blog) => {
    const publishedDate = blog.publishedAt || blog.createdAt;

    const ageInHours = (Date.now() - new Date(publishedDate).getTime())/(1000*60*60)

    const engagement = blog.likes*3 + blog.commentsCount * 5 + blog.bookmarks * 4 + blog.views * 0.05

    return Number( engagement/Math.pow(ageInHours+2, 1.5) ).toFixed(2)
}