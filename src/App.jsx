import { useState, useEffect, useCallback } from 'react'
import slides from './data/slides'
import Header from './components/Header'
import SlideRenderer from './components/SlideRenderer'
import Footer from './components/Footer'
import QuizModal from './components/QuizModal'
import Toast from './components/Toast'

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [quizOpen, setQuizOpen] = useState(false)
  const [toast, setToast] = useState('')

  const total = slides.length

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }, [])

  const goTo = useCallback((idx) => {
    if (idx >= 0 && idx < total) {
      setCurrentSlide(idx)
    }
  }, [total])

  const goNext = useCallback(() => goTo(currentSlide + 1), [currentSlide, goTo])
  const goPrev = useCallback(() => goTo(currentSlide - 1), [currentSlide, goTo])

  const toggleFullscreen = useCallback(() => {
    const doc = document
    const docEl = doc.documentElement

    const requestFs = docEl.requestFullscreen || docEl.webkitRequestFullscreen || docEl.mozRequestFullScreen || docEl.msRequestFullscreen
    const exitFs = doc.exitFullscreen || doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen
    const isFs = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement)

    if (!isFs) {
      if (requestFs) {
        requestFs.call(docEl).then(() => setIsFullscreen(true)).catch(() => {})
      }
    } else {
      if (exitFs) {
        exitFs.call(doc).then(() => setIsFullscreen(false)).catch(() => {})
      }
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (quizOpen) return
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        goNext()
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault()
        toggleFullscreen()
      }
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goNext, goPrev, toggleFullscreen, quizOpen, isFullscreen])

  // Track fullscreen changes
  useEffect(() => {
    const handler = () => {
      const isFs = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement)
      setIsFullscreen(isFs)
    }
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    document.addEventListener('mozfullscreenchange', handler)
    document.addEventListener('MSFullscreenChange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
      document.removeEventListener('mozfullscreenchange', handler)
      document.removeEventListener('MSFullscreenChange', handler)
    }
  }, [])

  const slide = slides[currentSlide]
  const progress = ((currentSlide + 1) / total) * 100

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased text-slate-900 select-none">
      {/* Top Header */}
      <Header
        slideTitle={slide.title}
        slideNumber={currentSlide + 1}
        total={total}
        progress={progress}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onOpenQuiz={() => setQuizOpen(true)}
      />

      {/* Main Slide Deck Viewport: perfectly fits screen without page scrolling */}
      <main className="flex-1 overflow-hidden p-3 sm:p-5 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="w-full max-w-5xl h-full flex flex-col justify-center animate-fade-in-up" key={currentSlide}>
          <SlideRenderer slide={slide} showToast={showToast} />
        </div>
      </main>

      {/* Bottom Navigation Footer */}
      <Footer
        currentSlide={currentSlide}
        total={total}
        onPrev={goPrev}
        onNext={goNext}
        onGoTo={goTo}
      />

      {/* Quiz Modal */}
      {quizOpen && (
        <QuizModal onClose={() => setQuizOpen(false)} showToast={showToast} />
      )}

      {/* Toast Notification */}
      <Toast message={toast} />
    </div>
  )
}
