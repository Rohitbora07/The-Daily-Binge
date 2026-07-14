import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Trash2 } from "lucide-react";

export default function AvatarUpload({ profile, setProfile, editable }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        if (profile && profile instanceof File) {
            const objectUrl = URL.createObjectURL(profile);
            setPreviewUrl(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreviewUrl(profile);
        }
    }, [profile]);

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) setProfile(file);
    };

    const handleDragOver = (e) => {
        if (!editable) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        if (!editable) return;
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith("image/")) {
            setProfile(file);
        }
    };

    return (
        <div className="mb-8 w-full flex flex-col items-center justify-center select-none">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={!editable}
                onChange={handleFileChange}
            />

            <AnimatePresence mode="wait">
                {profile ? (
                    <motion.div
                        key="profile"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full flex flex-col items-center justify-center gap-4"
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div
                            onClick={() => editable && inputRef.current?.click()}
                            className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 transition-all ${
                                isDragging && editable ? "border-[#0077CC] scale-105 ring-4 ring-[#EAF5FF]" : "border-stone-200"
                            } ${editable ? "cursor-pointer group" : "cursor-default"}`}
                        >
                            <img
                                src={previewUrl || ""}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                            {editable && (
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                            )}
                        </div>

                        {editable && (
                            <div className="flex items-center justify-center gap-4 w-full px-4">
                                <button
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    className="p-2.5 rounded-full border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors active:scale-95"
                                >
                                    <Camera size={16} />
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setProfile(null)}
                                    className="p-2.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors active:scale-95 shadow-sm shadow-red-500/10"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        onClick={() => editable && inputRef.current?.click()}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full border-2 border-dashed flex items-center justify-center transition-all ${
                            isDragging && editable
                                ? "border-[#0077CC] bg-[#EAF5FF] scale-105"
                                : "border-stone-300 bg-stone-50 hover:border-[#0077CC] hover:bg-[#EAF5FF]"
                        } ${editable ? "cursor-pointer" : "cursor-not-allowed opacity-60"}`}
                    >
                        <Camera size={24} className={isDragging ? "text-[#0077CC]" : "text-stone-400"} />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}