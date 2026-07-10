import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";

export const extensions = [
    StarterKit,

    TextStyle,
    Color,

    Image,
    Link,
    Underline,

    Highlight.configure({
        multicolor: true,
    }),

    Placeholder.configure({
        placeholder: "Start writing...",
    }),

    TextAlign.configure({
        types: ["heading", "paragraph"],
    }),
];