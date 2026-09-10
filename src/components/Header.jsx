export default function Header({ slideTitle, slideNumber, total, progress, onToggleFullscreen, isFullscreen, onOpenQuiz }) {
  return (
    <header className="flex-shrink-0 bg-white border-b border-slate-200 sticky top-0 z-30 select-none">
      <div className="flex items-center justify-between px-5 md:px-8 py-3">
        {/* Left: Topic Title */}
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-sm md:text-base text-slate-900 tracking-tight">
            Memory Debugging with Valgrind
          </span>
          <span className="hidden sm:inline-block text-slate-300">|</span>
          <span className="hidden sm:inline-block text-xs font-semibold text-slate-500 truncate max-w-xs md:max-w-md">
            {slideTitle}
          </span>
        </div>

        {/* Right: Counter, Quiz, Fullscreen */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Slide counter */}
          <div className="font-mono text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200">
            <span className="text-violet-600">{String(slideNumber).padStart(2, '0')}</span>
            <span className="text-slate-400 mx-1">/</span>
            <span>{String(total).padStart(2, '0')}</span>
          </div>

          {/* Quiz Button */}
          <button
            onClick={onOpenQuiz}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <span>⚡</span>
            <span>Quiz</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={onToggleFullscreen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer border border-slate-200"
            title="Toggle Fullscreen"
          >
            <span>{isFullscreen ? '✕' : '⛶'}</span>
            <span className="hidden sm:inline">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-[3px] bg-slate-100 w-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-violet-600 via-indigo-500 to-pink-500 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </header>
  )
}
