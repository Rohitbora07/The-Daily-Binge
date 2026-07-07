import BlogCard  from "../components/blog/BlogCard";

export default function BlogGrid({blogs, sliceLimit}) {
    blogs = blogs.slice(0, sliceLimit || 6)
    return (
        <section className="mb-16">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogs.map((blog, i) => (
                    <BlogCard key={i} blog={blog} index={i} />
                ))}
            </div>
        </section>
    );
}