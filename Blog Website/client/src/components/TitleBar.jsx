import {ArrowRight} from "lucide-react"
import { useNavigate } from "react-router-dom"
function TitleBar({ Icon, title, destination }) {
    const navigate = useNavigate()
    return (
        <div className="flex items-center justify-between my-8 pb-4 border-b border-stone-200/60">
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg border border-stone-300 flex items-center justify-center bg-stone-50/50">
                    <Icon size={13} className="text-[#0077CC]" />
                </div>
                <h2 className="text-xl font-serif font-medium tracking-tight text-stone-900">{title}</h2>
            </div>

            <div
                onClick={() => navigate(destination)}
                className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider py-2 px-3 rounded-3xl text-[#0077CC] hover:text-[#014c81] hover:bg-[#3c8ec8] transition-colors"
            >
                View all <ArrowRight size={13} />
            </div>
        </div>
    )
}

export default TitleBar
