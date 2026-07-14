import { motion } from "motion/react";
import { ArrowUp, PenSquare } from "lucide-react";

const ROUTES_CONFIG = [
    { title: "Home", path: "/", requiresAuth: false },
    { title: "Explore", path: "/explore", requiresAuth: false },
    { title: "Categories", path: "/explore/category", requiresAuth: true },
];

function Footer() {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-20 border-t border-[#1E3040]/60 bg-[#0A141D]"
        >
            <div className="max-w-6xl mx-auto px-6 py-12 md:py-16">
                
                {/* Top Section */}
                <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                    
                    {/* Brand Identity */}
                    <div className="space-y-4 max-w-md">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0077CC] text-white shadow-lg shadow-[#0077CC]/20">
                                <PenSquare size={18} />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white">
                                The Daily Binge
                            </span>
                        </div>
                        <p className="text-sm leading-relaxed text-[#8BA3BB]">
                            Discover thoughtful stories, share your ideas, and connect with readers who appreciate meaningful writing.
                        </p>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex flex-wrap gap-x-8 gap-y-3 border-t border-[#1E3040]/40 pt-6 md:border-t-0 md:pt-0">
                        {ROUTES_CONFIG.map((route) => (
                            <motion.a
                                key={route.path}
                                href={route.path}
                                whileHover={{ y: -2 }}
                                className="text-sm font-medium text-[#8BA3BB] transition-colors hover:text-white"
                            >
                                {route.title}
                            </motion.a>
                        ))}
                    </nav>

                </div>

                {/* Decorative Divider */}
                <div className="my-10 h-[1px] bg-gradient-to-r from-[#1E3040]/10 via-[#1E3040] to-[#1E3040]/10" />

                {/* Bottom Section */}
                <div className="flex flex-col-reverse gap-6 sm:flex-row sm:items-center sm:justify-between">
                    
                    {/* Copyright & Meta */}
                    <div className="space-y-1">
                        <p className="text-xs font-semibold tracking-wide text-[#D4E4F0]/80">
                            © 2026 The Daily Binge
                        </p>
                        <p className="text-xs text-[#8BA3BB]/70">
                            Crafted with care for writers, readers, and storytellers.
                        </p>
                    </div>

                    {/* Back to Top Button */}
                    <motion.button
                        whileHover={{ y: -3, borderColor: "#0077CC" }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() =>
                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            })
                        }
                        className="flex items-center gap-2 self-start rounded-xl border border-[#1E3040] bg-[#101E2C] px-4 py-2.5 text-xs font-medium text-[#8BA3BB] transition-colors hover:text-[#0077CC]"
                    >
                        <ArrowUp size={14} />
                        Back to top
                    </motion.button>
                </div>

            </div>
        </motion.footer>
    );
}

export default Footer;