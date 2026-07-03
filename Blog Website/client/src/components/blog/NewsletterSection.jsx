import { motion } from "motion/react";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterSection() {
    return (
        <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#0D1B2A] rounded-2xl px-8 py-12 md:px-14 md:py-16 text-center"
        >
            <div className="w-12 h-12 rounded-2xl bg-[#0077CC]/20 flex items-center justify-center mx-auto mb-5">
                <Mail size={22} className="text-[#4DB8FF]" />
            </div>

            <h2 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Stories worth reading, delivered weekly.
            </h2>
            <p className="text-stone-400 text-sm leading-relaxed max-w-md mx-auto mb-8">
                Join over 12,000 readers who get our best articles on design,
                technology, and culture — every Sunday morning.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-stone-500 text-sm focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#0077CC]/30 transition-all"
                />
                <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center justify-center gap-2 bg-[#0077CC] hover:bg-[#005FA3] text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
                >
                    Subscribe
                    <ArrowRight size={15} />
                </motion.button>
            </div>

            <p className="text-stone-600 text-xs mt-4">
                No spam, ever. Unsubscribe at any time.
            </p>
        </motion.section>
    );
}