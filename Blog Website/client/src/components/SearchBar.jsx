// import React from 'react'
import {Search} from "lucide-react"

function SearchBar({value, setVal}) {
    return (
        <div className=" flex items-center w-full mb-10">
            <Search
                size={16}
                className="absolute ml-4 text-stone-400"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => setVal(e.target.value)}
                placeholder="Filter Blogs....."
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 shadow-sm focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all"
            />
        </div>
    )
}

export default SearchBar
