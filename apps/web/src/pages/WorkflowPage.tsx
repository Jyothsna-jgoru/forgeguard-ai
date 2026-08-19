import { Check, ChevronDown, ChevronRight, CircleStop, Pause, Play, RotateCcw, ShieldCheck, StepForward } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DecisionBadge, Metric, PageHeader } from '../components/UI'
import { agentSteps, demoTicket } from '../data/demo'
import { useDemoState } from '../state/useDemoState'

export function WorkflowPage() {
  const { approved } = useDemoState()
  const [visibleCount, setVisibleCount] = useState(agentSteps.length)
  const [selected, setSelected] = useState(agentSteps.length - 1)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing || visibleCount >= agentSteps.length) return
    const timer = window.setTimeout(() => {
      const nextCount = Math.min(visibleCount + 1, agentSteps.length)
      setVisibleCount(nextCount)
      setSelected(nextCount - 1)
      if (nextCount >= agentSteps.length) setPlaying(false)
    }, 900)
    return () => window.clearTimeout(timer)
  }, [playing, visibleCount])

  const step = agentSteps[selected]
  const completed = useMemo(
    () => Math.min(visibleCount, agentSteps.length - (approved ? 0 : 1)),
    [approved, visibleCount],
  )
  const replay = () => { setVisibleCount(1); setSelected(0); setPlaying(true) }
  const next = () => { const nextIndex = Math.min(visibleCount, agentSteps.length - 1); setVisibleCount(Math.min(visibleCount + 1, agentSteps.length)); setSelected(nextIndex) }
  const togglePlayback = () => {
    if (visibleCount >= agentSteps.length) replay()
    else setPlaying((value) => !value)
  }

  return (
    <div className="page-container">
      <PageHeader eyebrow="Demo Scenario · Completed run" title="Multi-agent workflow explorer" description="Replay how PAY-1842 moved through planning, repository analysis, change generation, validation, policy review, documentation, and a human checkpoint." action={<div className="flex gap-2"><button type="button" onClick={replay} className="button button-secondary"><RotateCcw size={14} /> Replay</button><button type="button" onClick={togglePlayback} className="button button-primary">{playing ? <Pause size={14} /> : <Play size={14} />}{playing ? 'Pause' : visibleCount < agentSteps.length ? 'Continue' : 'Play again'}</button></div>} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><Metric label="Ticket" value={demoTicket.key} /><Metric label="Agent stages" value="6 + gate" /><Metric label="Validation" value="12 passed" tone="teal" /><Metric label="External action" value={approved ? 'Draft PR approved' : 'Awaiting approval'} tone={approved ? 'teal' : 'amber'} /></div>

      <section className="surface mb-6 overflow-hidden">
        <div className="flex flex-col justify-between gap-4 border-b border-line/70 p-5 sm:flex-row sm:items-center"><div><div className="flex items-center gap-2"><span className="rounded-md bg-electric/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-300">{demoTicket.key}</span><span className="text-[11px] text-slate-500">{demoTicket.service}</span></div><h2 className="mt-3 max-w-4xl text-base font-medium leading-6 text-white">{demoTicket.title}</h2></div><Link to="/ticket" className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">View ticket <ChevronRight size={13} /></Link></div>
        <div className="h-1 bg-slate-800"><div className="h-full bg-gradient-to-r from-electric via-violet to-teal-400 transition-all duration-500" style={{ width: `${(visibleCount / agentSteps.length) * 100}%` }} /></div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <section className="surface p-4" aria-label="Agent workflow timeline">
          <div className="mb-4 flex items-center justify-between px-2"><span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Execution timeline</span><span className="text-[10px] text-slate-600">{completed} stages complete</span></div>
          <div className="relative">
            <div className="absolute bottom-7 left-[29px] top-7 w-px bg-line" />
            {agentSteps.map((item, index) => {
              const Icon = item.icon; const isVisible = index < visibleCount; const isSelected = selected === index; const isApprovedGate = item.id === 'approval' && approved
              return <button key={item.id} type="button" disabled={!isVisible} onClick={() => setSelected(index)} className={`workflow-step-button ${isSelected ? 'workflow-step-selected' : ''} ${!isVisible ? 'opacity-35' : ''}`} aria-current={isSelected ? 'step' : undefined}><span className={`workflow-icon accent-${item.accent}`}>{isVisible ? <Icon size={16} /> : <CircleStop size={15} />}</span><span className="min-w-0 flex-1 text-left"><span className="block truncate text-xs font-semibold text-slate-200">{item.name}</span><span className="mt-1 block truncate text-[10px] text-slate-600">{isVisible ? item.tool : 'Pending replay'}</span></span><span className="font-mono text-[10px] text-slate-600">{isVisible ? (isApprovedGate ? 'approved' : item.elapsed) : '-'}</span>{isSelected ? <ChevronDown size={14} className="text-electric" /> : <ChevronRight size={14} className="text-slate-700" />}</button>
            })}
          </div>
          {visibleCount < agentSteps.length && <button type="button" onClick={next} className="button button-secondary mt-4 w-full"><StepForward size={14} /> Advance one stage</button>}
        </section>

        <section className="surface overflow-hidden" key={step.id}>
          <div className="border-b border-line/70 bg-gradient-to-r from-electric/[0.07] to-transparent p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="flex gap-4"><span className={`workflow-icon h-11 w-11 accent-${step.accent}`}><step.icon size={20} /></span><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{step.role}</div><h2 className="mt-1 text-xl font-semibold text-white">{step.name}</h2></div></div><div className="flex items-center gap-3"><span className="font-mono text-[10px] text-slate-500">{step.status === 'approval' && approved ? 'approved' : step.elapsed}</span><span className="decision-badge badge-allowed"><Check size={12} /> {step.status === 'approval' ? (approved ? 'Approved' : 'Checkpoint ready') : 'Completed'}</span></div></div></div>
          <div className="grid gap-px bg-line/60 lg:grid-cols-2">
            <div className="bg-panel/80 p-6"><Detail label="Input" text={step.input} /><Detail label="Key reasoning summary" text={step.reasoning} extraClass="mt-7" /><div className="mt-7"><div className="detail-label">Outputs</div><ul className="mt-3 space-y-2">{step.outputs.map((output) => <li key={output} className="flex gap-2 text-sm text-slate-300"><Check className="mt-0.5 shrink-0 text-teal-400" size={14} />{output}</li>)}</ul></div></div>
            <div className="bg-[#0a1525] p-6"><div className="detail-label">Tool request</div><div className="mt-3 rounded-lg border border-line bg-ink/70 p-4"><code className="text-sm font-medium text-blue-200">{step.tool}</code><div className="mt-3 border-t border-line/60 pt-3 font-mono text-[10px] leading-5 text-slate-500">agent_role: {step.role}<br />environment: demo<br />scope: samples/payment-service</div></div><div className="mt-7 flex items-center justify-between"><div className="detail-label">Gateway decision</div><DecisionBadge decision={step.decision} /></div><div className="mt-3 flex gap-3 rounded-lg border border-line/70 bg-white/[0.02] p-4"><ShieldCheck className="mt-0.5 shrink-0 text-teal-300" size={17} /><p className="text-sm leading-6 text-slate-400">{step.decisionReason}</p></div></div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Detail({ label, text, extraClass = '' }: { label: string; text: string; extraClass?: string }) { return <div className={extraClass}><div className="detail-label">{label}</div><p className="mt-3 text-sm leading-6 text-slate-300">{text}</p></div> }
