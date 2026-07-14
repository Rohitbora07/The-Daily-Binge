import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ArrowRight, Hash } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categories = ["Animation", "Anime", "Archaeology", "Architecture Spaces", "Art Culture", "Astronomy", "Automotive", "Beauty Cosmetics", "Biographies Memoirs", "Books Literature", "Branding Identity", "Business Finance", "Career Workplace", "Celebrity Pop Culture", "Cinema", "Climate Environment", "Comedy Satire", "Comics", "Crime Justice", "Data Analytics", "Dating Romance", "Digital Media", "Documentaries", "Economics", "Education", "Entertainment", "Entrepreneurship", "Events Festivals", "Fan Fiction", "Family Parenting", "Fashion Style", "Fitness Nutrition", "Food Drink", "Futurism", "Gadgets Gear", "Gaming", "Geography Maps", "Government Policy", "Green Living", "Health Wellness", "History", "Hobbies Crafts", "Home Living", "Human Rights", "Industry Manufacturing", "Innovation", "Internet Culture", "Investing Crypto", "International Relations", "Journalism News", "Jobs Freelancing", "Justice Law", "K-Pop", "Kids Family", "Kitchen Cooking", "Language Linguistics", "Leadership Management", "Lifestyle", "Local Community", "Luxury Leisure", "Manga", "Marketing Advertising", "Mental Health", "Mindfulness Meditation", "Movies", "Movies TV", "Music", "Navigating Adulthood", "Nature", "Nature Wildlife", "Networks Security", "Nonprofit Charity", "Nutrition Diet", "Oceanography", "Online Privacy", "Opinion Editorial", "Organizational Culture", "Outdoor Adventure", "Philosophy", "Photography Video", "Politics Government", "Productivity Focus", "Psychology", "Quantum Science", "Quality of Life", "Quotes Inspiration", "Real Estate", "Relationships", "Religion Spirituality", "Remote Work", "Robotics", "Scale Modeling", "Science Space", "Screenwriting", "Social Issues", "Sports", "Sports Recreation", "Startups", "Sustainability", "Technology", "Theater Stage","Slice of Life",  "Transportation", "Travel Leisure", "True Crime", "Universe Cosmos", "Universities College", "Urban City Life", "Vehicles Transit",, "Video Games", "Visual Arts", "Volunteering", "Weather Climate", "Wealth Management", "Web Software", "Writing Content", "Workplace Culture", "Mystery",  "Yoga", "Youth Education", "YouTube","Youth Culture", "Zoology Nature"];

const grouped = categories.reduce((acc, cat) => {
    const letter = cat[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(cat);
    return acc;
}, {});

const letters = Object.keys(grouped).sort();
const palette = [
    { color: "#0077CC", bg: "#E0F0FF" },
    { color: "#7c3aed", bg: "#f5f3ff" },
    { color: "#059669", bg: "#ecfdf5" },
    { color: "#d97706", bg: "#fffbeb" },
    { color: "#e11d48", bg: "#fff1f2" },
    { color: "#0891b2", bg: "#ecfeff" },
];

export default function Category() {
    const [search, setSearch] = useState("");
    const [activeLetter, setActiveLetter] = useState(null);

    const filteredSearch = search.trim().toLowerCase();
    const visibleGroups = letters.filter((letter) => {
        if (activeLetter && activeLetter !== letter) return false;
        if (!filteredSearch) return true;
        return grouped[letter].some((catName) =>
            catName.toLowerCase().includes(filteredSearch)
        );
    });

    const navigate = useNavigate()

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            className="min-h-screen bg-stone-50 mt-20"
        >
            {/* ── Hero Search ── */}
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-14 md:py-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-xl mx-auto text-center"
                    >
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
                                placeholder="Filter categories…"
                                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 shadow-sm focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ── Alphabet Jump bar ── */}
            <div className="bg-white border-b border-stone-100 sticky sm:top-[100px] top-[130px] z-20">
                <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-3 overflow-x-auto">
                    <div className="flex items-center gap-1 min-w-max mx-auto w-fit">
                        <button
                            onClick={() => setActiveLetter(null)}
                            className={`text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all duration-200 ${!activeLetter
                                ? "bg-[#0077CC] text-white"
                                : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                                }`}
                        >
                            All
                        </button>
                        {letters.map((letter) => (
                            <button
                                key={letter}
                                onClick={() =>
                                    setActiveLetter(activeLetter === letter ? null : letter)
                                }
                                className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg transition-all duration-200 ${activeLetter === letter
                                    ? "bg-[#0077CC] text-white"
                                    : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
                                    }`}
                            >
                                {letter}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Category groups ── */}
            <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-14">
                <AnimatePresence mode="wait">
                    {visibleGroups.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center py-24 text-center"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                                <Hash size={22} className="text-stone-300" />
                            </div>
                            <p className="text-stone-700 font-semibold mb-1">
                                No categories found
                            </p>
                            <p className="text-sm text-stone-400">
                                Try a different search term.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={search + activeLetter}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-12 sm:space-y-16"
                        >
                            {visibleGroups.map((letter, gi) => {
                                const cats = grouped[letter].filter((catName) =>
                                    !filteredSearch || catName.toLowerCase().includes(filteredSearch)
                                );

                                return (
                                    <motion.section
                                        key={letter}
                                        initial={{ opacity: 0, y: 24 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-40px" }}
                                        transition={{ duration: 0.45, ease: "easeOut" }}
                                        id={`letter-${letter}`}
                                    >
                                        {/* Letter heading */}
                                        <div className="flex items-center gap-4 mb-6 sm:mb-8">
                                            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0D1B2A] flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <span className="font-serif text-xl sm:text-2xl font-bold text-white">
                                                    {letter}
                                                </span>
                                            </div>
                                            <div className="flex-1 h-px bg-stone-200" />
                                            <span className="text-xs text-stone-400 font-medium flex-shrink-0">
                                                {cats.length} {cats.length === 1 ? "topic" : "topics"}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                            {cats.map((catName, ci) => {
                                                const { color, bg } = palette[(gi + ci) % palette.length];
                                                return (
                                                    <motion.a
                                                        key={catName}
                                                        onClick={()=> navigate(`${catName}`)}
                                                        initial={{ opacity: 0, y: 14 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true, margin: "-20px" }}
                                                        transition={{ duration: 0.35, delay: 0.04 * ci }}
                                                        whileHover={{ y: -3 }}
                                                        className="group bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between gap-3 cursor-pointer no-underline"
                                                    >
                                                        <div className="flex items-center justify-between gap-2">
                                                            <div className="flex items-center gap-2.5 min-w-0 w-full">
                                                                <div
                                                                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                                                                    style={{ background: bg }}
                                                                >
                                                                    <span
                                                                        className="text-xs font-bold"
                                                                        style={{ color }}
                                                                    >
                                                                        {catName[0]}
                                                                    </span>
                                                                </div>
                                                                <span className="text-sm font-semibold text-stone-900 truncate group-hover:text-[#0077CC] transition-colors duration-200 flex-1">
                                                                    {catName}
                                                                </span>
                                                            </div>

                                                            <motion.div
                                                                initial={{ x: 0, opacity: 0 }}
                                                                whileHover={{ x: 2 }}
                                                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0"
                                                            >
                                                                <ArrowRight size={14} style={{ color }} />
                                                            </motion.div>
                                                        </div>
                                                    </motion.a>
                                                );
                                            })}
                                        </div>
                                    </motion.section>
                                );
                            })}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}