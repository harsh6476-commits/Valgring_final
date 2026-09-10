import { useState, useEffect } from 'react'
import { quizQuestions } from '../data/slides'

export default function QuizModal({ onClose, showToast }) {
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState({}) // { [qIndex]: { selected, isCorrect } }
  const [locked, setLocked] = useState(false)
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
    if (!locked && answers[currentQ] === undefined) {
      setSelected(i)
    }
  }

  const handleLockAnswer = () => {
    if (selected === null || locked) return
    const isCorrect = selected === q.correct
    setAnswers(prev => ({
      ...prev,
      [currentQ]: { selected, isCorrect }
    }))
    setLocked(true)
    if (showToast) {
      showToast(isCorrect ? '✓ Correct!' : '✗ Incorrect')
    }
  }

  const handleNext = () => {
    if (currentQ < total - 1) {
      const nextIdx = currentQ + 1
      setCurrentQ(nextIdx)
      if (answers[nextIdx] !== undefined) {
        setSelected(answers[nextIdx].selected)
        setLocked(true)
      } else {
        setSelected(null)
        setLocked(false)
      }
    } else {
      setShowResult(true)
    }
  }

  const handlePrev = () => {
    if (currentQ > 0) {
      const prevIdx = currentQ - 1
      setCurrentQ(prevIdx)
      if (answers[prevIdx] !== undefined) {
        setSelected(answers[prevIdx].selected)
        setLocked(true)
      } else {
        setSelected(null)
        setLocked(false)
      }
    }
  }

  const handleRestart = () => {
    setCurrentQ(0)
    setSelected(null)
    setAnswers({})
    setLocked(false)
    setShowResult(false)
  }

  // Calculate score
  const correctCount = Object.values(answers).filter(a => a.isCorrect).length
  const answeredCount = Object.keys(answers).length
  const scorePercent = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl md:rounded-3xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              Valgrind Memory Assessment
            </h3>
            {!showResult && (
              <span className="font-mono text-xs bg-violet-50 text-violet-700 px-2.5 py-0.5 rounded-full font-bold border border-violet-200">
                Q{currentQ + 1} of {total}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        {!showResult && (
          <div className="h-1 bg-slate-100 w-full">
            <div
              className="h-full bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500 transition-all duration-300"
              style={{ width: `${((currentQ + 1) / total) * 100}%` }}
            />
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1">
          {showResult ? (
            /* ═════════ QUIZ RESULTS SUMMARY ═════════ */
            <div className="space-y-6 py-2">
              <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white text-2xl shadow-md">
                  {scorePercent >= 80 ? '🏆' : scorePercent >= 50 ? '🎯' : '💡'}
                </div>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Assessment Complete!
                </h3>
                <div className="text-3xl sm:text-4xl font-black text-slate-900 font-mono pt-1">
                  <span className={scorePercent >= 70 ? 'text-emerald-600' : 'text-violet-600'}>
                    {correctCount}
                  </span>
                  <span className="text-slate-400 text-2xl"> / {total}</span>
                  <span className="text-sm font-bold text-slate-500 ml-2">({scorePercent}%)</span>
                </div>
                <p className="text-xs sm:text-sm font-medium text-slate-600">
                  {scorePercent === 100
                    ? '🌟 Perfect score! Master of Valgrind heap debugging.'
                    : scorePercent >= 80
                    ? '🎉 Excellent work! Strong command of memory safety & detection.'
                    : scorePercent >= 50
                    ? '👍 Good job! Review the challenge slides to master tricky edge cases.'
                    : '📚 Keep practicing! Review the leak and bounds checking modules.'}
                </p>
              </div>

              {/* Question by question review */}
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Question Breakdown
                </div>
                {quizQuestions.map((question, idx) => {
                  const ans = answers[idx]
                  const isCorrect = ans?.isCorrect
                  return (
                    <div
                      key={question.id}
                      className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-3 ${
                        isCorrect
                          ? 'bg-emerald-50/50 border-emerald-200'
                          : ans !== undefined
                          ? 'bg-rose-50/50 border-rose-200'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                            isCorrect
                              ? 'bg-emerald-500 text-white'
                              : ans !== undefined
                              ? 'bg-rose-500 text-white'
                              : 'bg-slate-300 text-slate-700'
                          }`}
                        >
                          {isCorrect ? '✓' : ans !== undefined ? '✗' : '-'}
                        </span>
                        <span className="font-semibold text-slate-800 truncate">
                          Q{idx + 1}: {question.question}
                        </span>
                      </div>
                      <span className="font-mono text-[11px] font-bold flex-shrink-0 text-slate-500">
                        Ans: {question.options[question.correct].charAt(0)}
                      </span>
                    </div>
                  )
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center pt-2 border-t border-slate-100">
                <button
                  onClick={handleRestart}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  🔄 Retake Assessment
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* ═════════ ACTIVE QUESTION SCREEN ═════════ */
            <div className="space-y-4">
              <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.question}
              </h4>

              {q.code && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-[#0f172a]">
                  <div className="px-3.5 py-1.5 bg-[#1e293b] border-b border-slate-700 text-[10px] font-mono text-slate-400">
                    snippet.c
                  </div>
                  <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                    {q.code}
                  </pre>
                </div>
              )}

              {/* Options */}
              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = selected === i
                  const isAnswerLocked = locked || answers[currentQ] !== undefined
                  const isCorrectAnswer = q.correct === i

                  let optionStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'

                  if (isAnswerLocked) {
                    if (isCorrectAnswer) {
                      optionStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold shadow-2xs'
                    } else if (isSelected && !isCorrectAnswer) {
                      optionStyle = 'bg-rose-50 border-rose-400 text-rose-950 line-through'
                    } else {
                      optionStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
                    }
                  } else if (isSelected) {
                    optionStyle = 'bg-violet-50 border-violet-500 text-violet-950 font-semibold shadow-2xs'
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={isAnswerLocked}
                      className={`
                        w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm transition-all border flex items-center justify-between
                        ${optionStyle}
                        ${!isAnswerLocked ? 'cursor-pointer' : 'cursor-default'}
                      `}
                    >
                      <span>{opt}</span>
                      {isAnswerLocked && isCorrectAnswer && (
                        <span className="text-emerald-600 font-bold text-xs ml-2 flex-shrink-0">✓ Correct</span>
                      )}
                      {isAnswerLocked && isSelected && !isCorrectAnswer && (
                        <span className="text-rose-600 font-bold text-xs ml-2 flex-shrink-0">✗ Wrong</span>
                      )}
                    </button>
                  )
                })}
              </div>



              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  onClick={handlePrev}
                  disabled={currentQ === 0}
                  className={`
                    px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                    ${currentQ === 0
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }
                  `}
                >
                  ← Prev
                </button>

                <div className="flex gap-2">
                  {!locked && answers[currentQ] === undefined && (
                    <button
                      onClick={handleLockAnswer}
                      disabled={selected === null}
                      className={`
                        px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer
                        ${selected === null
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          : 'bg-violet-600 text-white hover:bg-violet-700 shadow-xs'
                        }
                      `}
                    >
                      Lock Choice
                    </button>
                  )}
                  <button
                    onClick={handleNext}
                    className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xs hover:shadow transition-all cursor-pointer"
                  >
                    {currentQ === total - 1 ? 'See Results 📊' : 'Next →'}
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
