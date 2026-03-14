export default function Loading() {
    return (
        <div className="min-h-screen bg-[#f7f7f5] flex items-center justify-center">
            <div className="flex flex-col items-center gap-5">
                <div className="w-12 h-12 bg-[#1a1a17] rounded-xl flex items-center justify-center animate-pulse">
                    <span className="text-[#CBFF00] font-bold text-base">K</span>
                </div>
                <div className="flex gap-1.5">
                    {[0, 1, 2].map((i) => (
                        <div
                            key={i}
                            className="w-2 h-2 bg-[#CBFF00] rounded-full animate-bounce"
                            style={{ animationDelay: `${i * 150}ms` }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}