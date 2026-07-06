import { useState } from "react";
import { motion } from "motion/react";
import { TrendingUp, Bookmark, UserPlus, UserCheck, BadgeCheck } from "lucide-react";

const rising = [
    { id: 1, title: "CSS Container Queries Are Here — And They Change Everything", pct: "+245%", time: "last 24h", cover: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=80&h=80&fit=crop" },
    { id: 2, title: "The Rise of Edge Computing", pct: "+182%", time: "last 24h", cover: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=80&h=80&fit=crop" },
    { id: 3, title: "Science of Sleep: What Research Says", pct: "+130%", time: "last 12h", cover: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=80&h=80&fit=crop" },
];

const bookmarked = [
    { id: 1, title: "Why TypeScript Is No Longer Optional", count: "2,480", cover: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=80&h=80&fit=crop" },
    { id: 2, title: "The Art of Minimalist Design", count: "1,930", cover: "https://images.unsplash.com/photo-1545239351-cefa43af60f3?w=80&h=80&fit=crop" },
    { id: 3, title: "Building with Vite in 2025", count: "1,640", cover: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=80&h=80&fit=crop" },
];

const authors = [
    { name: "Sarah Chen", role: "Staff Writer", followers: "12.4k", verified: true, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face" },
    { name: "James Okafor", role: "Tech Editor", followers: "8.7k", verified: true, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" },
    { name: "Priya Nair", role: "Design Writer", followers: "5.2k", verified: false, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face" },
];

function SideWidget({ icon: Icon, title, children, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden"
        >
            <div className="px-5 py-4 border-b border-stone-100 flex items-center gap-2">
                <Icon size={14} className="text-[#0077CC]" />
                <h3 className="text-sm font-semibold text-stone-800">{title}</h3>
            </div>
            {children}
        </motion.div>
    );
}

export default function TrendingSidebar() {
    const [followed, setFollowed] = useState({});

    return (
        <div className="space-y-5">

            {/* Rising Fast */}
            <SideWidget icon={TrendingUp} title="Rising Fast" delay={0.1}>
                <ul className="divide-y divide-stone-100">
                    {rising.map((item, i) => (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.12 + 0.05 * i }}
                            className="flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors cursor-pointer group"
                        >
                            <img src={item.cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform duration-300" />
                            <div className="min-w-0 flex-1">
                                <p className="text-xs font-semibold text-stone-800 line-clamp-2 group-hover:text-[#0077CC] transition-colors leading-snug">
                                    {item.title}
                                </p>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                                        {item.pct}
                                    </span>
                                    <span className="text-[10px] text-stone-400">{item.time}</span>
                                </div>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </SideWidget>

            {/* Most Bookmarked */}
            <SideWidget icon={Bookmark} title="Most Bookmarked" delay={0.18}>
                <ul className="divide-y divide-stone-100">
                    {bookmarked.map((item, i) => (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.2 + 0.05 * i }}
                            className="flex items-center gap-3 px-5 py-3.5 hover:bg-stone-50 transition-colors cursor-pointer group"
                        >
                            <img src={item.cover} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0 group-hover:scale-105 transition-transform duration-300" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-800 line-clamp-2 group-hover:text-[#0077CC] transition-colors leading-snug">
                                    {item.title}
                                </p>
                                <p className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                                    <Bookmark size={10} /> {item.count} bookmarks
                                </p>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            </SideWidget>

            {/* Top Authors */}
            <SideWidget icon={UserPlus} title="Top Authors This Week" delay={0.26}>
                <ul className="divide-y divide-stone-100">
                    {authors.map((author, i) => (
                        <motion.li
                            key={author.name}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.28 + 0.06 * i }}
                            className="flex items-center gap-3 px-5 py-4"
                        >
                            <img src={author.avatar} alt={author.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs font-semibold text-stone-800 truncate">{author.name}</p>
                                    {author.verified && <BadgeCheck size={12} className="text-[#0077CC] flex-shrink-0" />}
                                </div>
                                <p className="text-[10px] text-stone-400 truncate">{author.role} · {author.followers} followers</p>
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.04 }}
                                whileTap={{ scale: 0.96 }}
                                onClick={() => setFollowed(p => ({ ...p, [author.name]: !p[author.name] }))}
                                className={`flex-shrink-0 flex items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-200 min-w-[56px] justify-center ${followed[author.name]
                                        ? "bg-stone-100 text-stone-600 hover:bg-red-50 hover:text-red-500"
                                        : "bg-[#0077CC] text-white hover:bg-[#005FA3]"
                                    }`}
                            >
                                {followed[author.name] ? <UserCheck size={11} /> : <UserPlus size={11} />}
                                {followed[author.name] ? "Following" : "Follow"}
                            </motion.button>
                        </motion.li>
                    ))}
                </ul>
            </SideWidget>
        </div>
    );
}