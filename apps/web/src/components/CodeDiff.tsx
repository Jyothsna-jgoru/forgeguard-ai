import { Copy } from 'lucide-react'
import { useState } from 'react'
import { diffLines } from '../data/demo'

export function CodeDiff() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard?.writeText(diffLines.map((line) => `${line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ' '}${line.text}`).join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-[#07101c] shadow-2xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-line bg-white/[0.025] px-4 py-3">
        <div className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-red-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" /><span className="h-2.5 w-2.5 rounded-full bg-teal-400/70" /><span className="ml-2 font-mono text-[11px] text-slate-500">proposed-change.diff</span></div>
        <button type="button" onClick={copy} className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-[11px] text-slate-400 hover:bg-white/5 hover:text-white" aria-label="Copy proposed diff"><Copy size={13} /> {copied ? 'Copied' : 'Copy diff'}</button>
      </div>
      <div className="max-h-[620px] overflow-auto py-2 font-mono text-[11px] leading-5 sm:text-xs">
        {diffLines.map((line, index) => {
          const meta = line.type === 'meta'
          const old = 'old' in line ? line.old : ''
          const next = 'next' in line ? line.next : ''
          return (
            <div key={`${line.text}-${index}`} className={`diff-line diff-${line.type}`}>
              {!meta && <><span className="diff-number">{old}</span><span className="diff-number">{next}</span></>}
              <span className={meta ? 'px-4' : 'px-3'}>{line.text || ' '}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

