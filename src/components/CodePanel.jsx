import { useState, useCallback } from 'react'

export default function CodePanel({ filename, text, language, label, showToast }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const cleanText = typeof text === 'string'
      ? text
      : Array.isArray(text)
        ? text.map(l => typeof l === 'object' ? (l.prompt ? `$ ${l.text}` : l.text) : l).join('\n')
        : ''

    navigator.clipboard.writeText(cleanText).then(() => {
      setCopied(true)
      if (showToast) showToast('Copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {
      if (showToast) showToast('Failed to copy')
    })
  }, [text, showToast])

  const renderContent = () => {
    if (Array.isArray(text)) {
      return text.map((line, i) => {
        if (typeof line === 'object') {
          return (
            <div key={i} className="leading-relaxed flex items-start gap-2">
              {line.prompt && <span className="text-emerald-400 font-bold select-none">$</span>}
              <span className={line.prompt ? 'text-slate-100 font-medium' : 'text-slate-300'}>
                {line.text}
              </span>
            </div>
          )
        }
        return (
          <div key={i} className="leading-relaxed text-slate-300">
            {line}
          </div>
        )
      })
    }

    return (
      <pre className="whitespace-pre-wrap text-slate-200 leading-relaxed font-mono">
        {highlightC(text || '', language)}
      </pre>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-slate-800 bg-[#0f172a] my-1 sm:my-1.5">
      {/* Top terminal bar */}
      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1e293b] border-b border-slate-700/60">
        <div className="flex items-center gap-2.5">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
          </div>
          <span className="font-mono text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {filename || 'terminal'}
          </span>
        </div>

        <button
          onClick={handleCopy}
          className={`
            text-[10px] font-mono font-semibold px-2 py-0.5 rounded transition-all flex items-center gap-1 cursor-pointer
            ${copied
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600/50'
            }
          `}
        >
          {copied ? (
            <>
              <span>✓</span>
              <span>Copied</span>
            </>
          ) : (
            <>
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code body with compact padding */}
      <div className="p-3 sm:p-4 font-mono text-xs overflow-x-auto text-slate-200">
        {renderContent()}
      </div>

      {/* Optional sub-label footer */}
      {label && (
        <div className="px-3.5 py-1.5 border-t border-slate-800 bg-[#0b1120]">
          <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
            {label}
          </span>
        </div>
      )}
    </div>
  )
}

function highlightC(code, lang) {
  if (!code) return code
  if (lang === 'text' || lang === 'bash') {
    return code.split('\n').map((line, i) => {
      if (line.startsWith('$')) {
        return (
          <span key={i} className="block">
            <span className="text-emerald-400 font-bold">$</span>
            <span className="text-slate-100 font-medium">{line.slice(1)}</span>
          </span>
        )
      }
      if (line.startsWith('==')) {
        return (
          <span key={i} className="block text-amber-300 font-medium">
            {line}
          </span>
        )
      }
      if (line.trimStart().startsWith('#')) {
        return (
          <span key={i} className="block text-slate-400 italic">
            {line}
          </span>
        )
      }
      return <span key={i} className="block">{line}</span>
    })
  }

  const functions = ['malloc', 'calloc', 'realloc', 'free', 'printf', 'strcpy', 'strlen', 'sizeof']
  const keywords = ['return', 'if', 'else', 'for', 'while', 'typedef', 'struct', 'NULL', 'int', 'char', 'void', 'Node', 'size_t']

  return code.split('\n').map((line, li) => {
    if (line.trimStart().startsWith('//')) {
      return <span key={li} className="block text-slate-400 italic">{line}</span>
    }
    if (line.trimStart().startsWith('#')) {
      return <span key={li} className="block text-violet-400 font-semibold">{line}</span>
    }

    const tokens = []
    let remaining = line, ki = 0

    while (remaining.length > 0) {
      let m = remaining.match(/^"([^"]*)"/)
      if (m) {
        tokens.push(<span key={`${li}-${ki++}`} className="text-emerald-300">"{m[1]}"</span>)
        remaining = remaining.slice(m[0].length)
        continue
      }

      m = remaining.match(/^\/\/.*/)
      if (m) {
        tokens.push(<span key={`${li}-${ki++}`} className="text-slate-400 italic">{m[0]}</span>)
        remaining = ''
        continue
      }

      m = remaining.match(/^[a-zA-Z_]\w*/)
      if (m) {
        const w = m[0]
        if (functions.includes(w)) {
          tokens.push(<span key={`${li}-${ki++}`} className="text-cyan-400 font-semibold">{w}</span>)
        } else if (['return', 'if', 'else', 'for', 'while', 'typedef', 'struct'].includes(w)) {
          tokens.push(<span key={`${li}-${ki++}`} className="text-violet-400 font-semibold">{w}</span>)
        } else if (['int', 'char', 'void', 'Node', 'size_t'].includes(w)) {
          tokens.push(<span key={`${li}-${ki++}`} className="text-amber-300">{w}</span>)
        } else if (w === 'NULL') {
          tokens.push(<span key={`${li}-${ki++}`} className="text-rose-400 font-bold">{w}</span>)
        } else {
          tokens.push(<span key={`${li}-${ki++}`}>{w}</span>)
        }
        remaining = remaining.slice(w.length)
        continue
      }

      m = remaining.match(/^\d+/)
      if (m) {
        tokens.push(<span key={`${li}-${ki++}`} className="text-amber-300">{m[0]}</span>)
        remaining = remaining.slice(m[0].length)
        continue
      }

      tokens.push(<span key={`${li}-${ki++}`}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }

    return <span key={li} className="block">{tokens}</span>
  })
}
