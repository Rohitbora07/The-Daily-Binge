import { useState, useMemo, useRef, useEffect } from "react";
import { Send, FileText, MessageSquare, Globe, Lock, Search, Check, ChevronDown } from "lucide-react";
import TagInput from "./TagInput";
import Select from "./OptionSelect";

const categories = ["Animation", "Anime", "Archaeology", "Architecture Spaces", "Art Culture", "Astronomy", "Automotive", "Beauty Cosmetics", "Biographies Memoirs", "Books Literature", "Branding Identity", "Business Finance", "Career Workplace", "Celebrity Pop Culture", "Cinema", "Climate Environment", "Comedy Satire", "Comics", "Crime Justice", "Data Analytics", "Dating Romance", "Digital Media", "Documentaries", "Economics", "Education", "Entertainment", "Entrepreneurship", "Events Festivals", "Fan Fiction", "Family Parenting", "Fashion Style", "Fitness Nutrition", "Food Drink", "Futurism", "Gadgets Gear", "Gaming", "Geography Maps", "Government Policy", "Green Living", "Health Wellness", "History", "Hobbies Crafts", "Home Living", "Human Rights", "Industry Manufacturing", "Innovation", "Internet Culture", "Investing Crypto", "International Relations", "Journalism News", "Jobs Freelancing", "Justice Law", "K-Pop", "Kids Family", "Kitchen Cooking", "Language Linguistics", "Leadership Management", "Lifestyle", "Local Community", "Luxury Leisure", "Manga", "Marketing Advertising", "Mental Health", "Mindfulness Meditation", "Movies", "Movies TV", "Music", "Navigating Adulthood", "Nature", "Nature Wildlife", "Networks Security", "Nonprofit Charity", "Nutrition Diet", "Oceanography", "Online Privacy", "Opinion Editorial", "Organizational Culture", "Outdoor Adventure", "Philosophy", "Photography Video", "Politics Government", "Productivity Focus", "Psychology", "Quantum Science", "Quality of Life", "Quotes Inspiration", "Real Estate", "Relationships", "Religion Spirituality", "Remote Work", "Robotics", "Scale Modeling", "Science Space", "Screenwriting", "Social Issues", "Sports", "Sports Recreation", "Startups", "Sustainability", "Technology", "Theater Stage","Slice of Life",  "Transportation", "Travel Leisure", "True Crime", "Universe Cosmos", "Universities College", "Urban City Life", "Vehicles Transit",, "Video Games", "Visual Arts", "Volunteering", "Weather Climate", "Wealth Management", "Web Software", "Writing Content", "Workplace Culture", "Mystery",  "Yoga", "Youth Education", "YouTube","Youth Culture", "Zoology Nature"];

export default function PublishSidebar({ onPublish, setCategory, category, setVisibility, visibility, setAllowComments, allowComments, tags, setTags }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredCategories = useMemo(() => {
        if (!searchQuery.trim()) return categories;
        return categories.filter((cat) =>
            cat.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    return (
        <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="sticky top-[72px] flex flex-col gap-5">

                {/* Publish actions - Appears at the top on desktop, slides to the bottom on mobile */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm order-last lg:order-first">
                    <h3 className="text-sm font-semibold text-stone-800 mb-4">
                        Publish
                    </h3>

                    <div className="space-y-3">
                        <button
                            onClick={() => onPublish({ status: "published" })}
                            className="w-full flex items-center justify-center gap-2 bg-[#0077CC] hover:bg-[#005FA3] text-white text-sm font-semibold px-5 py-3 rounded-xl transition-colors duration-200"
                        >
                            <Send size={15} />
                            Publish now
                        </button>

                        <div className="flex gap-2.5">
                            <button
                                onClick={() => onPublish({ status: "draft" })}
                                className="flex-1 flex items-center justify-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-sm font-medium px-4 py-2.5 rounded-xl border border-stone-200 transition-colors"
                            >
                                <FileText size={14} />
                                Save draft
                            </button>
                        </div>
                    </div>
                </div>

                {/* Settings */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm space-y-5 order-first lg:order-none">
                    <h3 className="text-sm font-semibold text-stone-800">Settings</h3>

                    {/* Searchable Category Dropdown */}
                    <div className="relative" ref={dropdownRef}>
                        <label className="block text-sm font-medium text-stone-700 mb-1.5">
                            Category
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="w-full flex items-center justify-between bg-white border border-stone-200 rounded-xl px-4 py-2.5 text-sm text-stone-700 hover:border-stone-300 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all text-left"
                        >
                            <span className={category ? "text-stone-800" : "text-stone-400"}>
                                {category || "Select a category..."}
                            </span>
                            <ChevronDown size={16} className={`text-stone-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute z-50 mt-1.5 w-full bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden max-h-60 flex flex-col">
                                <div className="p-2 border-b border-stone-100 flex items-center gap-2 bg-stone-50">
                                    <Search size={14} className="text-stone-400 flex-shrink-0" />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full bg-transparent text-sm text-stone-800 placeholder-stone-400 focus:outline-none"
                                        autoFocus
                                    />
                                </div>
                                <div className="overflow-y-auto flex-1 divide-y divide-stone-50">
                                    {filteredCategories.length > 0 ? (
                                        filteredCategories.map((cat) => (
                                            <button
                                                key={cat}
                                                type="button"
                                                onClick={() => {
                                                    setCategory(cat);
                                                    setIsOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors text-left"
                                            >
                                                <span className={category === cat ? "font-medium text-[#0077CC]" : ""}>
                                                    {cat}
                                                </span>
                                                {category === cat && <Check size={14} className="text-[#0077CC]" />}
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-4 py-3 text-sm text-stone-400 text-center">
                                            No categories found
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <Select
                        label="Visibility"
                        value={visibility}
                        onChange={setVisibility}
                        options={["public", "private"]}
                    />
                    <div className="flex items-start gap-2.5 p-3 bg-stone-50 rounded-xl border border-stone-100">
                        {visibility === "public" ? (
                            <Globe size={14} className="text-[#0077CC] mt-0.5 flex-shrink-0" />
                        ) : (
                            <Lock size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                        )}
                        <p className="text-xs text-stone-500 leading-relaxed">
                            {visibility === "public"
                                ? "This post will be visible to everyone on the internet."
                                : "Only you can see this post. It won't appear publicly."}
                        </p>
                    </div>

                    {/* Allow comments toggle */}
                    <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={15} className="text-stone-400" />
                            <span className="text-sm font-medium text-stone-700">
                                Allow comments
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={() => setAllowComments(!allowComments)}
                            className={`relative w-10 h-5.5 rounded-full transition-colors duration-200 focus:outline-none ${allowComments ? "bg-[#0077CC]" : "bg-stone-200"
                                }`}
                            style={{ height: "22px", width: "40px" }}
                        >
                            <span
                                className={`absolute top-0.5 left-0.5 w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${allowComments ? "translate-x-[18px]" : "translate-x-0"
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm order-none">
                    <h3 className="text-sm font-semibold text-stone-800 mb-4">Tags</h3>
                    <TagInput tags={tags} setTags={setTags} />
                </div>

            </div>
        </aside>
    );
}