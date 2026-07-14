import BlogCard  from "./BlogCard";

export default function BlogGrid({blogs, sliceLimit, isEditable=false, onDelete, setShowDeleteModal, setSelectedSlug}) {
    blogs = blogs.slice(0, sliceLimit || blogs.length)
    return (
        <section className="mb-16">
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {blogs.map((blog, i) => (
                    <BlogCard key={i} blog={blog} index={i} isEditable={isEditable} onDelete={onDelete} setShowDeleteModal={setShowDeleteModal} setSelectedSlug={setSelectedSlug} />
                ))}
            </div>
        </section>
    );
}