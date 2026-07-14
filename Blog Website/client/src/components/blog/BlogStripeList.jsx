import BlogStripeItem from "./BlogStripeItem";

export default function BlogStripeList({ blogs, sliceLimit }) {
    const displayedBlogs = blogs?.slice(0, sliceLimit || 6) || [];
    
    return (
        <section className="mb-16 max-w-4xl mx-auto px-4">
            <div className="flex flex-col gap-4">
                {displayedBlogs.map((blog, i) => (
                    <BlogStripeItem key={i} blog={blog} index={i} />
                ))}
            </div>
        </section>
    );
}