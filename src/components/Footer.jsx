export default function Footer({ currentSlide, total, onPrev, onNext, onGoTo }) {
  return (
    <footer className="flex-shrink-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-4 sm:px-6 md:px-8 py-3.5 z-30">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Keyboard shortcuts hint */}
        <div className="hidden md:flex items-center gap-2 text-[11px] text-slate-500 font-mono">
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">←</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">→</span>
          <span>to navigate</span>
          <span className="mx-1 text-slate-300">·</span>
          <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700">Space</span>
          <span>next</span>
        </div>

        {/* Center: Slide indicator dots (clean without visited state) */}
        <div className="flex-1 flex justify-center items-center overflow-x-auto py-1">
          <div className="flex gap-1.5 items-center px-2">
            {Array.from({ length: total }, (_, i) => {
              const isCurrent = i === currentSlide
              return (
                <button
                  key={i}
                  onClick={() => onGoTo(i)}
                  className={`
                    transition-all duration-200 cursor-pointer rounded-full
                    ${isCurrent
                      ? 'w-7 h-2.5 bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 shadow-sm shadow-violet-500/30'
                      : 'w-2 h-2 bg-slate-300 hover:bg-slate-400'
                    }
                  `}
                  title={`Slide ${i + 1}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              )
            })}
          </div>
        </div>

        {/* Right: Prev & Next buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onPrev}
            disabled={currentSlide === 0}
            className={`
              flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${currentSlide === 0
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                : 'bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 border border-slate-300 shadow-sm hover:shadow'
              }
            `}
          >
            <span>←</span>
            <span>Prev</span>
          </button>

          <button
            onClick={onNext}
            disabled={currentSlide === total - 1}
            className={`
              flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${currentSlide === total - 1
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200/50'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-sm shadow-violet-500/25 hover:shadow-md hover:shadow-violet-500/35 active:scale-[0.98]'
              }
            `}
          >
            <span>Next</span>
            <span>→</span>
          </button>
        </div>
      </div>
    </footer>
  )
}
