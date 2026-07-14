
function InputBar({ icon: Icon, ...props }) {
    return (
        <div className="relative w-full">
            {Icon && (
                <Icon
                    size={15}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
                />
            )}
            <input
                {...props}
                className={`w-full ${Icon ? "pl-10" : "pl-4"} pr-4 py-3 rounded-xl border border-stone-200 bg-white text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:border-[#0077CC] focus:ring-2 focus:ring-[#E0F0FF] transition-all`}
            />
        </div>
    )
}

export default InputBar