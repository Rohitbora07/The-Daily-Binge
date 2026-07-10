import { useState, useRef, useEffect } from "react";
import { 
    Bold, Italic, Underline, Strikethrough, Heading1, Heading2, Heading3, Link, Image, 
    Minus, AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Palette, Highlighter, ChevronDown, Undo2, Redo2
} from "lucide-react";
import api from "../../api/axios";
import { UPLOAD_IMAGE } from "../../constants/route";

const Divider = () => (
    <div className="w-px h-5 bg-stone-200 mx-1 flex-shrink-0" />
);

const ToolbarButton = ({ icon: Icon, label, active, onClick, disabled }) => (
    <button
        type="button"
        onClick={onClick}
        title={label}
        disabled={disabled}
        className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 flex-shrink-0 ${active
            ? "bg-[#E0F0FF] text-[#0077CC]"
            : "text-stone-500 hover:bg-stone-100 hover:text-stone-700 disabled:opacity-30 disabled:pointer-events-none"
            }`}
    >
        <Icon size={15} />
    </button>
);


const ColorPicker = ({ icon: Icon, label, activeColor, onSelect, colors, alignRight }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative flex items-center" ref={containerRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                title={label}
                className="h-8 px-1.5 flex items-center gap-0.5 rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-all"
            >
                <Icon size={15} style={{ color: activeColor || undefined }} />
                <ChevronDown size={10} className="text-stone-400" />
            </button>
            {isOpen && (
                <div 
                    className={`absolute top-full mt-1 ${alignRight ? 'right-0' : 'left-0'} z-50 p-2 bg-white border border-stone-200 rounded-xl shadow-xl grid grid-cols-5 gap-1 w-40`}
                >
                    {colors.map((color) => (
                        <button
                            key={color.value}
                            type="button"
                            onClick={() => {
                                onSelect(color.value);
                                setIsOpen(false);
                            }}
                            title={color.name}
                            className="w-6 h-6 rounded-md border border-stone-200 transition-transform hover:scale-110 flex-shrink-0"
                            style={{ backgroundColor: color.value }}
                        />
                    ))}
                    <button
                        type="button"
                        onClick={() => {
                            onSelect(null);
                            setIsOpen(false);
                        }}
                        className="col-span-5 text-center text-xs text-stone-500 py-1 hover:bg-stone-50 rounded mt-1"
                    >
                        Reset Default
                    </button>
                </div>
            )}
        </div>
    );
};

export default function BlogEditorToolbar({ editor }) {
    if (!editor) return null;

    const setCustomLink = () => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        if (url === null) return;
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    };

    const addCustomImage = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                const formData = new FormData();
                formData.append("image", file);
                const { data } = await api.post(UPLOAD_IMAGE, formData);
                editor.chain().focus().setImage({ src: data.url }).run();
            } catch (err) {
                console.error(err);
                alert("Failed to upload image.");
            }
        };
        input.click();
    };

    const textColors = [
        { name: "Black", value: "#1c1917" },
        { name: "Gray", value: "#78716c" },
        { name: "Red", value: "#dc2626" },
        { name: "Orange", value: "#ea580c" },
        { name: "Green", value: "#16a34a" },
        { name: "Blue", value: "#0077CC" },
        { name: "Purple", value: "#9333ea" },
    ];

    const highlights = [
        { name: "Yellow", value: "#fef08a" },
        { name: "Green", value: "#bbf7d0" },
        { name: "Blue", value: "#bfdbfe" },
        { name: "Red", value: "#fecaca" },
        { name: "Purple", value: "#e9d5ff" },
    ];

    return (
        /* FIXED: [scrollbar-width:none] & [::-webkit-scrollbar]:hidden removes scroll tracks across all browsers */
        <div className="sticky top-[72px] z-30 h-40 bg-white/95 backdrop-blur-sm border-b border-stone-200/80 -mx-6 px-6 py-2 mb-6 w-screen sm:w-auto overflow-x-auto [scrollbar-width:none] [::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-0.5 min-w-max pb-1">
                
                {/* History */}
                <ToolbarButton icon={Undo2} label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} />
                <ToolbarButton icon={Redo2} label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} />
                
                <Divider />

                {/* Headings */}
                <ToolbarButton icon={Heading1} label="Heading 1" active={editor.isActive("heading", { level: 1 })} onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} />
                <ToolbarButton icon={Heading2} label="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} />
                <ToolbarButton icon={Heading3} label="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} />

                <Divider />

                {/* Typography formatting */}
                <ToolbarButton icon={Bold} label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} />
                <ToolbarButton icon={Italic} label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} />
                <ToolbarButton icon={Underline} label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} />
                <ToolbarButton icon={Strikethrough} label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} />

                <Divider />

                {/* Color and Highlights */}
                <ColorPicker 
                    icon={Palette} 
                    label="Text Color" 
                    activeColor={editor.getAttributes("textStyle").color} 
                    colors={textColors} 
                    onSelect={(color) => color ? editor.chain().focus().setColor(color).run() : editor.chain().focus().unsetColor().run()} 
                />
                <ColorPicker 
                    icon={Highlighter} 
                    label="Highlight Color" 
                    activeColor={editor.getAttributes("highlight").color} 
                    colors={highlights} 
                    onSelect={(color) => color ? editor.chain().focus().setHighlight({ color }).run() : editor.chain().focus().unsetHighlight().run()} 
                />

                <Divider />

                {/* Alignment types */}
                <ToolbarButton icon={AlignLeft} label="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} />
                <ToolbarButton icon={AlignCenter} label="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} />
                <ToolbarButton icon={AlignRight} label="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} />
                <ToolbarButton icon={AlignJustify} label="Justify" active={editor.isActive({ textAlign: "justify" })} onClick={() => editor.chain().focus().setTextAlign("justify").run()} />

                <Divider />




                {/* Media & Embed Elements */}
                <ToolbarButton icon={Link} label="Insert link" active={editor.isActive("link")} onClick={setCustomLink} />
                <ToolbarButton icon={Image} label="Insert image" active={editor.isActive("image")} onClick={addCustomImage} />
                <ToolbarButton icon={Minus} label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()} />

                <Divider />

            </div>
        </div>
    );
}