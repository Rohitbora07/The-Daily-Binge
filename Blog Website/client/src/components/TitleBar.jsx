import {ArrowRight} from "lucide-react"
import { useNavigate } from "react-router-dom"
function TitleBar({ Icon, title, destination }) {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-between mt-10 mb-6 pb-4 border-b border-stone-200/80">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-stone-200/80 flex items-center justify-center bg-white shadow-sm text-[#0077CC]">
                    <Icon size={15} />
                </div>
                <h2 className="text-lg md:text-xl font-serif font-semibold tracking-tight text-stone-900">
                    {title}
                </h2>
            </div>

            <button
                onClick={() => navigate(destination)}
                className="group flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded-full text-[#0077CC] bg-[#0077CC]/5 hover:bg-[#0077CC] hover:text-white active:scale-95 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >
                <span>View all</span>
                <ArrowRight 
                    size={14} 
                    className="transition-transform duration-200 group-hover:translate-x-1" 
                />
            </button>
        </div>
    )
}

export default TitleBar
