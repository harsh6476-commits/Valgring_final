export default function Sidebar({ modules, slides, currentSlide, isOpen, onClose, onGoTo }) {
  const currentSlideData = slides[currentSlide]

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full z-50
          w-84 bg-white border-r border-slate-200 shadow-2xl
          transform transition-transform duration-300 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          flex flex-col overflow-hidden
        `}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between flex-shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white text-xs font-bold font-mono">
              #
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Lecture Roadmap</h3>
              <p className="text-[11px] text-slate-500 font-mono">20 Slides · 6 Modules</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modules List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {modules.map((mod) => {
            const moduleSlides = slides.filter(
              s => s.id >= mod.slideRange[0] && s.id <= mod.slideRange[1]
            )
            const firstSlideIdx = slides.findIndex(s => s.id === mod.slideRange[0])
            const isActiveModule =
              currentSlideData.id >= mod.slideRange[0] &&
              currentSlideData.id <= mod.slideRange[1]

            return (
              <div
                key={mod.id}
                className={`
                  rounded-2xl border transition-all overflow-hidden
                  ${isActiveModule
                    ? 'bg-violet-50/70 border-violet-200/80 shadow-xs'
                    : 'bg-white border-slate-200/70 hover:border-slate-300 hover:bg-slate-50/60'
                  }
                `}
              >
                {/* Module title header */}
                <button
                  onClick={() => {
                    onGoTo(firstSlideIdx)
                    onClose()
                  }}
                  className="w-full text-left p-3.5 flex items-center gap-3 cursor-pointer"
                >
                  <span
                    className={`
                      w-8 h-8 rounded-xl flex items-center justify-center font-mono text-xs font-bold flex-shrink-0 transition-colors
                      ${isActiveModule
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                      }
                    `}
                  >
                    {String(mod.id).padStart(2, '0')}
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isActiveModule ? 'text-violet-900' : 'text-slate-800'}`}>
                        {mod.label}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 font-medium">
                        {mod.slideRange[0]}–{mod.slideRange[1]}
                      </span>
                    </div>

                    {/* Slide dots within this module */}
                    <div className="flex gap-1.5 mt-2 items-center">
                      {moduleSlides.map((s) => {
                        const idx = slides.indexOf(s)
                        const isCurrent = idx === currentSlide
                        return (
                          <div
                            key={s.id}
                            className={`
                              h-1.5 rounded-full transition-all
                              ${isCurrent
                                ? 'w-4 bg-violet-600'
                                : 'w-1.5 bg-slate-300'
                              }
                            `}
                          />
                        )
                      })}
                    </div>
                  </div>
                </button>
              </div>
            )
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/70 flex-shrink-0">
          <div className="text-[11px] font-mono text-slate-500 text-center">
            Valgrind & Memcheck Guide
          </div>
        </div>
      </aside>
    </>
  )
}
