import { useState, useEffect } from 'react'
import { quizQuestions } from '../data/slides'

export default function QuizModal({ onClose, showToast }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(new Set())
  const [showResult, setShowResult] = useState(false)

  const q = quizQuestions[currentQ]
  const total = quizQuestions.length

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const handleSelect = (i) => {
    if (!answered.has(currentQ)) setSelected(i)
  }

  const handleSubmit = () => {
    if (selected === null) return
    setAnswered(prev => new Set([...prev, currentQ]))
  }

  const handleNext = () => {
    if (currentQ < total - 1) {
      setCurrentQ(currentQ + 1)
      setSelected(null)
    } else {
      setShowResult(true)
    }
  }

  const handlePrev = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1)
      setSelected(null)
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswered(new Set())
    setShowResult(false)
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/60 flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚡</span>
            <h3 className="font-bold text-slate-900 text-base sm:text-lg">
              Valgrind Memory Quiz
            </h3>
            {!showResult && (
              <span className="font-mono text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full font-bold border border-violet-200">
                {currentQ + 1} / {total}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress */}
        {!showResult && (
          <div className="h-1 bg-slate-100 w-full">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentQ + 1) / total) * 100}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 flex-1">
          {showResult ? (
            <div className="text-center space-y-6 py-6">
              <div className="text-5xl">🎯</div>
              <h3 className="text-2xl font-extrabold text-slate-900">
                Quiz Complete!
              </h3>
              <p className="text-slate-600 text-sm sm:text-base max-w-md mx-auto">
                You evaluated <span className="text-violet-700 font-bold">{answered.size}</span> out of{' '}
                <span className="text-violet-700 font-bold">{total}</span> code challenges.
              </p>
              <div className="flex gap-3 justify-center pt-2">
                <button
                  onClick={handleRestart}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  Try Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <h4 className="text-base font-bold text-slate-900 leading-snug">
                {q.question}
              </h4>

              {q.code && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a]">
                  <div className="px-4 py-2 bg-[#1e293b] border-b border-slate-700 text-[11px] font-mono text-slate-400">
                    snippet.c
                  </div>
                  <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {q.code}
                  </pre>
                </div>
              )}

              <div className="space-y-2.5">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`
                      w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm transition-all border
                      ${selected === i
                        ? 'bg-violet-50 border-violet-400 text-violet-950 font-semibold shadow-xs'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }
                      ${answered.has(currentQ) ? 'cursor-default opacity-60' : 'cursor-pointer'}
                    `}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentQ === 0}
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                    ${currentQ === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }
                  `}
                >
                  ← Prev
                </button>

                <div className="flex gap-2.5">
                  {!answered.has(currentQ) && (
                    <button
                      onClick={handleSubmit}
                      disabled={selected === null}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer
                        ${selected === null
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100'
                        }
                      `}
                    >
                      Lock Choice
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                  >
                    {currentQ === total - 1 ? 'Finish' : 'Next →'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
