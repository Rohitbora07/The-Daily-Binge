export default function Field({ label, hint, children }) {
    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-stone-700">{label}</label>
                {hint && <span className="text-xs text-stone-400">{hint}</span>}
            </div>
            {children}
        </div>
    )
}
