import { useState } from "react";
import { motion } from "motion/react";
import CoverImageUpload from "../../../components/blog/create/CoverImageUpload";
import BlogEditorToolbar from "../../../components/blog/create/BlogEditorToolbar";
import PublishSidebar from "../../../components/blog/create/PublishSidebar";
import api from "../../../api/axios";
import { CREATE_BLOG } from "../../../constants/route";
import { useNavigate } from "react-router-dom";
import TiptapEditor from "../../../components/blog/create/TiptapEditor";
import { useEditor } from "@tiptap/react";
import { extensions } from "../../../constants/extensions";

const wordCount = (text) => {
    const words = text.trim().split(/\s+/).filter(Boolean);
    return words.length;
};

const readTime = (words) => Math.max(1, Math.ceil(words / 200));

export default function CreateBlog() {
    const [title, setTitle] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [content, setContent] = useState(null);
    const [coverImage, setCoverImage] = useState(null);
    const [category, setCategory] = useState("");
    const [visibility, setVisibility] = useState("public");
    const [allowComments, setAllowComments] = useState(true);
    const [tags, setTags] = useState([]);

    const navigate = useNavigate();


    const editor = useEditor({
        extensions: extensions,
        content: "",
        editorProps: {
            attributes: {
                class: "focus:outline-none outline-none min-h-[500px]",
            },
        },
        onUpdate({ editor }) {
            setContent(editor.getJSON());
        }
    });

    const currentText = editor ? editor.getText() : "";
    const words = wordCount(currentText);
    const minutes = readTime(words);

    const handlePublish = async ({ status }) => {
        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("excerpt", excerpt);
            formData.append("content", JSON.stringify(content));
            formData.append("category", category);
            tags.forEach(tag => {
                formData.append("tags", tag);
            });
            formData.append("visibility", visibility);
            formData.append("status", status);
            if (coverImage) formData.append("coverImage", coverImage);
            formData.append("allowComments", allowComments);

            const { data } = await api.post(CREATE_BLOG, formData);
            console.log(data.blog);

            navigate(`/blog/${data.blog.slug}`);
        } catch (err) {
            console.log("Error:", err.response?.data?.message || err.message);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="min-h-screen bg-white mt-16 sm:mt-20"
        >
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-10 xl:gap-14 items-start">

                    <div className="w-full flex-1 min-w-0">

                        <CoverImageUpload preview={coverImage} setPreview={setCoverImage} />

                        <p className="text-2xl sm:text-3xl font-medium text-stone-500 mb-2 font-serif">Title</p>
                        <div className="mb-4 border-2 border-stone-300 rounded-lg p-3 sm:p-4">
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Your post title…"
                                rows={2}
                                className="w-full resize-none outline-none text-[#0D1B2A] placeholder:text-stone-300 font-serif text-sm sm:text-base"
                            />
                        </div>

                        <p className="text-2xl sm:text-3xl font-medium text-stone-500 mb-2 font-serif">Excerpt</p>
                        <div className="mb-6 sm:mb-8 border-2 border-stone-300 rounded-lg p-3 sm:p-4">
                            <textarea
                                value={excerpt}
                                onChange={(e) => setExcerpt(e.target.value)}
                                placeholder="A brief excerpt or description…"
                                rows={2}
                                className="w-full resize-none outline-none text-stone-500 placeholder:text-stone-300 font-serif text-sm sm:text-base"
                            />
                        </div>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-1 h-px bg-stone-500" />
                            <span className="text-xs text-stone-600 font-medium tracking-widest uppercase">
                                Write
                            </span>
                            <div className="flex-1 h-px bg-stone-500" />
                        </div>

                        <BlogEditorToolbar editor={editor} />

                        <div className="relative border border-stone-300 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
                            <TiptapEditor editor={editor} />

                            {currentText.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center justify-end mt-4 gap-4"
                                >
                                    <span className="text-xs text-stone-400 font-medium">
                                        {words} word{words !== 1 ? "s" : ""} · {minutes} min read
                                    </span>
                                </motion.div>
                            )}
                        </div>

                        <div className="h-8 sm:h-16" />
                    </div>

                    <PublishSidebar
                        onPublish={handlePublish}
                        setCategory={setCategory}
                        category={category}
                        setVisibility={setVisibility}
                        visibility={visibility}
                        setAllowComments={setAllowComments}
                        allowComments={allowComments}
                        tags={tags}
                        setTags={setTags}
                    />
                </div>
            </div>
        </motion.div>
    );
}


