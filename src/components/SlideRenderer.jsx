import CodePanel from './CodePanel'

export default function SlideRenderer({ slide, showToast }) {
  const { type, content } = slide

  return (
    <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col justify-between max-h-full h-full">
      {/* Top colorful gradient accent line */}
      <div className={`h-1.5 w-full flex-shrink-0 ${getAccentGradient(slide.module || 0)}`} />

      {/* Slide body */}
      <div className="p-5 sm:p-7 md:p-8 lg:p-10 flex-1 flex flex-col justify-center overflow-hidden">
        {renderSlideContent(type, content, showToast)}
      </div>
    </div>
  )
}

function getAccentGradient(moduleNum) {
  switch (moduleNum) {
    case 0: return 'bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500'
    case 1: return 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
    case 2: return 'bg-gradient-to-r from-rose-500 via-amber-500 to-orange-500'
    case 3: return 'bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500'
    case 4: return 'bg-gradient-to-r from-purple-500 via-violet-500 to-indigo-500'
    case 5: return 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500'
    case 6: return 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500'
    default: return 'bg-gradient-to-r from-violet-600 to-pink-500'
  }
}

function renderSlideContent(type, c, showToast) {
  switch (type) {
    case 'title': return <TitleSlide c={c} />
    case 'concept': return <ConceptSlide c={c} showToast={showToast} />
    case 'challenge': return <ChallengeSlide c={c} showToast={showToast} />
    case 'challenge-double': return <ChallengeDoubleSlide c={c} />
    case 'demo': return <DemoSlide c={c} showToast={showToast} />
    case 'info': return <InfoSlide c={c} />
    case 'closing': return <ClosingSlide c={c} showToast={showToast} />
    default: return <div>Slide content not found</div>
  }
}

/* ═══════════════════════════════════════════════════════
   SLIDE 1: TITLE SLIDE (Clean Centered, No Code Box, No Avatar Letters)
   ═══════════════════════════════════════════════════════ */
function TitleSlide({ c }) {
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6 md:space-y-8 my-auto">
      {/* Kicker */}
      <div>
        <span className="inline-block font-mono text-xs font-bold tracking-wider text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-4 py-1.5 uppercase">
          {c.kicker}
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
        Memory Debugging <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600">
          with Valgrind
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-base sm:text-lg text-slate-600 font-medium max-w-xl mx-auto">
        {c.subtitle}
      </p>

      {/* Team Info & Clean Member Pills (No letter circles) */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Presented by Team <span className="text-slate-800 font-bold">{c.team}</span>
        </p>
        <div className="flex flex-wrap gap-2.5 justify-center">
          {c.members.map((m) => (
            <span
              key={m}
              className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold shadow-2xs"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CONCEPT SLIDES
   ═══════════════════════════════════════════════════════ */
function ConceptSlide({ c, showToast }) {
  return (
    <div className="space-y-4 md:space-y-5 my-auto">
      {/* Header */}
      <div>
        <Tag text={c.tag} />
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
          {c.heading}
        </h2>
      </div>

      {/* Pull Quote */}
      {c.pullQuote && (
        <div className="rounded-xl bg-gradient-to-r from-violet-50 via-purple-50 to-pink-50 border border-violet-200 p-4 md:p-5">
          <p className="text-lg md:text-xl font-bold text-violet-950 font-sans tracking-tight">
            {c.pullQuote.replace(/^"|"$/g, '')}
          </p>
          <p className="text-[11px] text-violet-600 font-mono mt-1 font-semibold uppercase tracking-wider">
            — Core Axiom of Systems Programming
          </p>
        </div>
      )}

      {/* 4 Feature Bullet Cards */}
      {c.bullets && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {c.bullets.map((b, i) => {
            const colors = [
              'border-rose-200 bg-rose-50/40 text-rose-950',
              'border-amber-200 bg-amber-50/40 text-amber-950',
              'border-violet-200 bg-violet-50/40 text-violet-950',
              'border-blue-200 bg-blue-50/40 text-blue-950',
            ]
            return (
              <div
                key={i}
                className={`p-3.5 rounded-xl border ${colors[i % colors.length]}`}
              >
                <p className="text-xs sm:text-sm font-semibold leading-relaxed">
                  {b}
                </p>
              </div>
            )
          })}
        </div>
      )}

      {/* Code Snippet */}
      {c.code && (
        <CodePanel
          filename={c.code.filename}
          text={c.code.text}
          language={c.code.language}
          showToast={showToast}
        />
      )}

      {/* Layout specific elements */}
      {c.layout === 'stack-heap' && <StackHeapVisual c={c} />}
      {c.cards && <FunctionCards cards={c.cards} />}
      {c.defCards && <DefCards cards={c.defCards} />}
      {c.callout && <Callout text={c.callout} />}
      {c.footer && (
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700">
          💡 {c.footer}
        </div>
      )}
      {c.pipeline && <Pipeline steps={c.pipeline} />}
      {c.toolDiagram && <ToolDiagram d={c.toolDiagram} />}
      {c.shadowMemory && <ShadowMemory d={c.shadowMemory} />}
      {c.twoCol && <TwoColExplainer d={c.twoCol} />}
      {c.comparison && <DebugComparison d={c.comparison} />}
      {c.commandCards && <CommandCards cards={c.commandCards} showToast={showToast} />}
      {c.questionCards && <QuestionCards cards={c.questionCards} />}
      {c.limitCards && <LimitCards cards={c.limitCards} />}
      {(c.vsTable || c.recapTable) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
          {c.vsTable && (
            <div className="lg:col-span-5">
              <VSTable d={c.vsTable} />
            </div>
          )}
          {c.recapTable && (
            <div className="lg:col-span-7">
              <RecapTable d={c.recapTable} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CHALLENGE SLIDE (Q1 - Q5)
   ═══════════════════════════════════════════════════════ */
function ChallengeSlide({ c, showToast }) {
  return (
    <div className="space-y-3.5 my-auto">
      {/* Header with Q badge */}
      <div className="flex items-center gap-2.5">
        <span className="font-mono text-[11px] font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 px-3 py-1 rounded-full uppercase">
          {c.tag || 'LIVE CHALLENGE'}
        </span>
        <span className="font-mono text-xs font-bold text-violet-700 bg-violet-100 border border-violet-200 px-2.5 py-0.5 rounded-full">
          {c.badge}
        </span>
      </div>

      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
        {c.heading}
      </h2>

      {c.conceptNote && (
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          {c.conceptNote}
        </p>
      )}

      {/* Code Editor Panel */}
      <CodePanel
        filename={c.code.filename}
        text={c.code.text}
        language={c.code.language}
        showToast={showToast}
      />

      {/* Visual Diagram if available */}
      {c.indexDiagram && <IndexDiagram d={c.indexDiagram} />}

      {/* Prompt banner */}
      <div className="p-3 rounded-xl bg-violet-50 border border-violet-200 flex items-center justify-between text-xs text-violet-950 font-semibold">
        <span>❓ What does Valgrind report for this code snippet?</span>
        <span className="font-mono text-violet-600 font-bold">Classroom Discussion</span>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CHALLENGE DOUBLE SLIDE (Q6 - Q10)
   ═══════════════════════════════════════════════════════ */
function ChallengeDoubleSlide({ c }) {
  return (
    <div className="space-y-3.5 my-auto">
      <div>
        <Tag text={c.tag} />
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          {c.heading}
        </h2>
      </div>

      <div className={`grid grid-cols-1 ${c.challenges.length === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-3`}>
        {c.challenges.map((ch, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex flex-col"
          >
            <div className="px-3.5 py-2 bg-white border-b border-slate-200 flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-white bg-gradient-to-r from-violet-600 to-pink-600 px-2 py-0.5 rounded">
                {ch.badge}
              </span>
              <span className="text-xs font-bold text-slate-800 truncate">
                {ch.title}
              </span>
            </div>
            <div className="p-2 flex-1">
              <pre className="text-[11px] font-mono bg-[#0f172a] text-slate-200 rounded-lg p-3 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {ch.code}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   DEMO SLIDE (Slide 14, 15)
   ═══════════════════════════════════════════════════════ */
function DemoSlide({ c, showToast }) {
  return (
    <div className="space-y-3.5 my-auto">
      <div>
        <Tag text={c.tag} />
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
          {c.heading}
        </h2>
      </div>

      {c.prompt && (
        <div className="p-2.5 rounded-lg bg-violet-50 border border-violet-200 text-xs font-semibold text-violet-900">
          🔍 {c.prompt}
        </div>
      )}

      {/* Split Code and Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {c.code && (
          <CodePanel
            filename={c.code.filename}
            text={c.code.text}
            language={c.code.language}
            showToast={showToast}
          />
        )}
        {c.output && (
          <CodePanel
            filename={c.output.filename}
            text={c.output.text}
            language={c.output.language}
            showToast={showToast}
          />
        )}
      </div>

      {/* Glossary */}
      {c.glossary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {c.glossary.map((g, i) => (
            <div key={i} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50">
              <div className="text-[11px] font-mono font-bold text-violet-700">{g.term}</div>
              <div className="text-[11px] text-slate-600 mt-0.5 leading-snug">{g.def}</div>
            </div>
          ))}
        </div>
      )}

      {/* Anatomy */}
      {c.anatomy && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {c.anatomy.map((a, i) => (
            <div key={i} className="p-2 rounded-lg border border-slate-200 bg-slate-50 flex items-start gap-2">
              <span className="text-xs font-bold text-violet-700">{a.num}</span>
              <div>
                <div className="text-[11px] font-bold text-slate-900">{a.label}</div>
                <div className="text-[10px] text-slate-500">{a.desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {c.takeaway && <Callout text={c.takeaway} />}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   CLOSING SLIDE (Slide 20 - Clean, No Avatar Letter Logos)
   ═══════════════════════════════════════════════════════ */
function ClosingSlide({ c, showToast }) {
  return (
    <div className="text-center space-y-5 my-auto max-w-3xl mx-auto">
      <div>
        <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold font-mono">
          PRESENTATION COMPLETE
        </span>
      </div>

      <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
        Congratulations — <br />
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-600">
          You've debugged your first heap.
        </span>
      </h2>

      <div className="space-y-2">
        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
          Presented by Team <span className="text-slate-800 font-bold">{c.team}</span>
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {c.members.map((m) => (
            <span
              key={m}
              className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold"
            >
              {m}
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto text-left pt-2">
        <CodePanel
          filename={c.terminal.filename}
          text={c.terminal.lines}
          language="bash"
          showToast={showToast}
        />
      </div>
    </div>
  )
}

function InfoSlide({ c }) {
  return (
    <div className="text-center space-y-4 my-auto">
      <Tag text={c.tag} />
      <h2 className="text-3xl font-extrabold text-slate-900">{c.heading}</h2>
      {c.subtitle && <p className="text-slate-600 text-sm">{c.subtitle}</p>}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════
   SUBCOMPONENTS
   ═══════════════════════════════════════════════════════ */

function Tag({ text }) {
  if (!text) return null
  return (
    <div>
      <span className="inline-block font-mono text-[10px] font-bold tracking-wider text-violet-700 bg-violet-50 border border-violet-200 rounded-full px-3 py-0.5 uppercase">
        {text}
      </span>
    </div>
  )
}

function Callout({ text }) {
  return (
    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 text-xs font-medium flex items-center gap-2.5">
      <span className="text-amber-600 text-sm flex-shrink-0">⚠️</span>
      <p>{text}</p>
    </div>
  )
}

function StackHeapVisual({ c }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Stack Frame */}
        <div className="p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-blue-700 uppercase">
              {c.stack.label}
            </span>
            <span className="text-[10px] font-mono text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
              LIFO
            </span>
          </div>
          <div className="space-y-1">
            {c.stack.items.map((item, i) => (
              <div
                key={i}
                className="py-1.5 px-2.5 rounded-lg bg-white border border-blue-200 font-mono text-xs font-semibold text-blue-950 text-center"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-blue-700 mt-2 font-medium">{c.stack.desc}</p>
        </div>

        {/* Heap Frame */}
        <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono font-bold text-emerald-700 uppercase">
              {c.heap.label}
            </span>
            <span className="text-[10px] font-mono text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
              Dynamic
            </span>
          </div>
          <div className="space-y-1">
            {c.heap.items.map((item, i) => (
              <div
                key={i}
                className="py-1.5 px-2.5 rounded-lg bg-white border border-emerald-200 font-mono text-xs font-semibold text-emerald-950 text-center"
              >
                {item}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-emerald-700 mt-2 font-medium">{c.heap.desc}</p>
        </div>
      </div>

      {/* Comparison Table */}
      {c.table && (
        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-3.5 py-1.5 font-mono font-bold text-slate-500 uppercase">Feature</th>
                <th className="text-left px-3.5 py-1.5 font-mono font-bold text-blue-700 uppercase">Stack</th>
                <th className="text-left px-3.5 py-1.5 font-mono font-bold text-emerald-700 uppercase">Heap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {c.table.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-3.5 py-1.5 font-semibold text-slate-800">{row.feature}</td>
                  <td className="px-3.5 py-1.5 text-slate-600">{row.stack}</td>
                  <td className="px-3.5 py-1.5 text-slate-600">{row.heap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function FunctionCards({ cards }) {
  const colorMap = {
    purple: 'border-violet-200 bg-violet-50/50 text-violet-800',
    green: 'border-emerald-200 bg-emerald-50/50 text-emerald-800',
    blue: 'border-blue-200 bg-blue-50/50 text-blue-800',
    red: 'border-rose-200 bg-rose-50/50 text-rose-800',
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {cards.map((card, i) => {
        const cls = colorMap[card.color] || colorMap.purple
        return (
          <div key={i} className={`p-3.5 rounded-xl border ${cls}`}>
            <div className="text-xs font-mono font-bold mb-1">{card.name}</div>
            <div className="text-xs text-slate-700 leading-relaxed">{card.desc}</div>
          </div>
        )
      })}
    </div>
  )
}

function DefCards({ cards }) {
  const borders = [
    'border-violet-200 bg-violet-50/40 text-violet-800',
    'border-rose-200 bg-rose-50/40 text-rose-800',
    'border-amber-200 bg-amber-50/40 text-amber-800',
    'border-pink-200 bg-pink-50/40 text-pink-800',
    'border-blue-200 bg-blue-50/40 text-blue-800',
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className={`p-3.5 rounded-xl border ${borders[i % borders.length]}`}
        >
          <div className="text-xs font-bold mb-1 text-slate-900">{card.name}</div>
          <div className="text-xs text-slate-600 leading-relaxed">{card.desc}</div>
        </div>
      ))}
    </div>
  )
}

function Pipeline({ steps }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 overflow-x-auto">
      <div className="flex items-center gap-2 min-w-[400px]">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-center flex-1">
              <div className="text-xs font-bold text-slate-900">{step.label}</div>
              <div className="text-[10px] font-mono text-slate-400">{step.sub}</div>
            </div>
            {i < steps.length - 1 && (
              <span className="text-slate-400 font-bold text-xs">→</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ToolDiagram({ d }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
      <div className="text-center">
        <span className="px-3 py-1 rounded-lg bg-slate-900 text-white text-xs font-mono font-bold">
          {d.framework} SUITE
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        {d.tools.map((tool, i) => (
          <div
            key={i}
            className={`p-2.5 rounded-lg text-center border ${tool.highlight ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-slate-800 border-slate-200'}`}
          >
            <div className="text-xs font-mono font-bold">{tool.name}</div>
            {tool.desc && <div className="text-[10px] opacity-80">{tool.desc}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

function ShadowMemory({ d }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2 overflow-x-auto">
      {[d.row1, d.row2].map((row, ri) => (
        <div key={ri} className="flex items-center gap-3 min-w-[400px]">
          <div className="w-40 text-xs font-mono font-bold text-slate-600 text-right">
            {row.label}
          </div>
          <div className="flex gap-1.5">
            {row.cells.map((cell, ci) => (
              <div
                key={ci}
                className={`w-14 h-8 rounded-md flex items-center justify-center font-mono text-xs font-bold border ${ri === 0 ? 'bg-white border-slate-300 text-slate-800' : 'bg-violet-100 border-violet-300 text-violet-800'}`}
              >
                {cell}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function TwoColExplainer({ d }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[d.left, d.right].map((col, ci) => (
        <div key={ci} className="p-3.5 rounded-xl border border-slate-200 bg-white">
          <div className="text-xs font-mono font-bold text-violet-700 mb-2 uppercase">
            {col.title}
          </div>
          <div className="space-y-1.5">
            {col.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-0.5 border-b border-slate-100 last:border-0">
                <span className="text-slate-600">{item.q}</span>
                <span className={`font-mono font-bold ${item.a.startsWith('✓') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.a}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function CommandCards({ cards, showToast }) {
  return (
    <div className="space-y-1.5">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
        Essential Valgrind Flags
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {cards.map((card, i) => (
          <div
            key={i}
            className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-violet-300 transition-all flex flex-col justify-between shadow-2xs group"
          >
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <code className="text-[11px] font-mono font-bold text-violet-700 bg-white px-2 py-0.5 rounded border border-slate-200 truncate">
                {card.cmd}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(card.cmd)
                  if (showToast) showToast('Command copied!')
                }}
                className="text-[10px] font-mono text-slate-400 hover:text-violet-600 px-1.5 py-0.5 rounded bg-white border border-slate-200 cursor-pointer flex-shrink-0"
                title="Copy flag command"
              >
                Copy
              </button>
            </div>
            <p className="text-[11px] text-slate-600 leading-tight">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function DebugComparison({ d }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="p-3.5 rounded-xl border border-rose-200 bg-rose-50/40">
        <div className="text-xs font-mono font-bold text-rose-700 mb-1">{d.without.label}</div>
        <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-rose-200">{d.without.text}</div>
      </div>
      <div className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/40">
        <div className="text-xs font-mono font-bold text-emerald-700 mb-1">{d.with.label}</div>
        <div className="font-mono text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-emerald-200">{d.with.text}</div>
      </div>
    </div>
  )
}

function IndexDiagram({ d }) {
  return (
    <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center gap-2">
      {d.valid.map((idx) => (
        <div key={idx} className="w-11 h-11 rounded-lg bg-emerald-50 border border-emerald-300 flex flex-col items-center justify-center">
          <span className="text-xs font-mono font-bold text-emerald-800">[{idx}]</span>
          <span className="text-[8px] font-bold text-emerald-600">VALID</span>
        </div>
      ))}
      <div className="w-11 h-11 rounded-lg bg-rose-100 border-2 border-rose-500 flex flex-col items-center justify-center animate-pulse">
        <span className="text-xs font-mono font-bold text-rose-800">[{d.invalid}]</span>
        <span className="text-[8px] font-bold text-rose-600">OOB</span>
      </div>
    </div>
  )
}

function QuestionCards({ cards }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
        Valgrind Tool Selection
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {cards.map((card, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-white shadow-2xs">
            <div className="text-[11px] text-slate-600 mb-1 leading-snug">{card.q}</div>
            <div className="text-xs font-mono font-bold text-violet-700 truncate">→ {card.a}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function LimitCards({ cards }) {
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
        Key Tool Limitations
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {cards.map((card, i) => (
          <div key={i} className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
            <div className="text-xs font-bold text-slate-900 mb-0.5 truncate">{card.title}</div>
            <div className="text-[11px] text-slate-600 leading-snug">{card.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function VSTable({ d }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {d.headers.map((h, i) => (
              <th key={i} className="text-left px-3.5 py-2 font-mono font-bold text-slate-700 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {d.rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              {row.map((cell, j) => (
                <td key={j} className={`px-3.5 py-1.5 ${j === 0 ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RecapTable({ d }) {
  return (
    <div className="rounded-xl border border-slate-200 overflow-hidden bg-white">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            {d.headers.map((h, i) => (
              <th key={i} className="text-left px-3.5 py-2 font-mono font-bold text-violet-700 uppercase">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {d.rows.map((row, i) => (
            <tr key={i} className="hover:bg-slate-50/50">
              <td className="px-3.5 py-1.5 font-semibold text-slate-900">{row[0]}</td>
              <td className="px-3.5 py-1.5 font-mono text-violet-600 font-medium">{row[1]}</td>
              <td className="px-3.5 py-1.5 font-medium text-emerald-700">{row[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
