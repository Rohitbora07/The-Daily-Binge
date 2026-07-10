import { Search } from "lucide-react";

export default function SearchBar({ value, setVal }) {
    return (
        <div className="relative flex items-center w-full">
            <Search
                size={16}
                className="absolute left-4 text-stone-400 pointer-events-none transition-colors group-focus-within:text-[#0077CC]"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Search blogs by title or author..."
                className="w-full pl-11 pr-4 py-3 bg-white text-sm text-stone-700 placeholder:text-stone-400 rounded-xl border border-stone-200/80 shadow-sm focus:outline-none focus:border-[#0077CC] focus:bg-white transition-all duration-200"
            />
        </div>
    );
}