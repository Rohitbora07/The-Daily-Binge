import { useEditor, EditorContent } from "@tiptap/react";
import { extensions } from "../../constants/extensions";

export default function BlogContent({ content }) {
    const editor = useEditor({
        extensions: extensions,
        content: content,
        editable: false,
    })
    if (!editor) return null;

    return <EditorContent editor={editor} className="prose prose-stone max-w-full" />;
}