import { Ban, Check, ChevronDown, CircleDot, Clock3, Eye, FileKey2, Fingerprint, LockKeyhole, ScanSearch, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { DecisionBadge, PageHeader, SectionTitle } from '../components/UI'
import { policyEvents } from '../data/demo'

const principles = [
  { icon: Ban, title: 'Deny by default', text: 'Unknown agents, tools, arguments, and environments are rejected.' },
  { icon: Fingerprint, title: 'Verified identity', text: 'Each request is evaluated against the authenticated agent role.' },
  { icon: ScanSearch, title: 'Schema validation', text: 'Typed arguments, bounded values, and repository scope are checked first.' },
  { icon: LockKeyhole, title: 'Least privilege', text: 'Roles receive the narrowest operation required for their stage.' },
  { icon: Clock3, title: 'Approval gates', text: 'External state changes stop until an explicit human decision.' },
  { icon: FileKey2, title: 'Audit evidence', text: 'A correlation-safe decision record is appended for every request.' },
]

export function GovernancePage() {
  const [expanded, setExpanded] = useState(policyEvents[2].id)
  return (
    <div className="page-container">
      <PageHeader eyebrow="Secure MCP Tool Gateway" title="Policy enforcement between agents and tools" description="The gateway is the only path to capability. It validates identity and intent, decides policy, records evidence, and invokes a simulated adapter only when permitted." action={<span className="decision-badge badge-allowed"><ShieldCheck size={12} /> Policy active</span>} />
      <div className="mb-6 grid gap-3 md:grid-cols-3"><div className="metric-card"><span className="detail-label">Policy posture</span><span className="mt-2 block text-base font-semibold text-white">Deny by default</span></div><div className="metric-card"><span className="detail-label">Evaluated requests</span><span className="mt-2 block text-base font-semibold text-white">5 recorded</span></div><div className="metric-card"><span className="detail-label">External mutations</span><span className="mt-2 block text-base font-semibold text-amber-300">0 executed</span></div></div>
      <section className="surface overflow-hidden">
        <div className="border-b border-line/70 p-5"><SectionTitle icon={<Eye size={17} className="text-electric" />} title="Decision audit trail" description="Select an event to inspect the evaluated identity, request, arguments, result, and rationale." /></div>
        <div className="hidden grid-cols-[150px_1fr_190px_150px_36px] gap-4 border-b border-line/70 bg-white/[0.018] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-600 lg:grid"><span>Agent identity</span><span>Requested tool</span><span>Policy result</span><span>Time</span><span /></div>
        <div>{policyEvents.map((event) => <div key={event.id} className="border-b border-line/60 last:border-0"><button type="button" onClick={() => setExpanded(expanded === event.id ? '' : event.id)} className="grid w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-white/[0.018] lg:grid-cols-[150px_1fr_190px_150px_36px] lg:gap-4" aria-expanded={expanded === event.id}><span><span className="block text-xs font-semibold text-slate-200">{event.agent}</span><span className="mt-1 block font-mono text-[9px] text-slate-600">{event.role}</span></span><code className="text-xs text-blue-200">{event.tool}</code><DecisionBadge decision={event.result} /><span className="font-mono text-[10px] text-slate-600">{event.time}</span><ChevronDown size={14} className={`text-slate-600 transition-transform ${expanded === event.id ? 'rotate-180' : ''}`} /></button>{expanded === event.id && <div className="grid gap-4 border-t border-line/50 bg-ink/50 px-5 py-5 md:grid-cols-3"><AuditDetail label="Validated arguments" value={event.arguments} mono /><AuditDetail label="Policy reason" value={event.reason} /><AuditDetail label="Approval requirement" value={event.approval} /><div className="md:col-span-3 flex items-center gap-2 font-mono text-[9px] text-slate-600"><CircleDot size={11} className="text-teal-400" /> Immutable demo event · {event.id} · hash chain verified</div></div>}</div>)}</div>
      </section>
      <section className="mt-6"><SectionTitle eyebrow="Control model" title="Six enforcement layers" /><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{principles.map(({ icon: Icon, title, text }) => <article key={title} className="surface p-5"><span className="flex h-9 w-9 items-center justify-center rounded-lg border border-electric/15 bg-electric/[0.07] text-blue-300"><Icon size={17} /></span><h3 className="mt-4 text-sm font-semibold text-white">{title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></article>)}</div></section>
      <div className="mt-6 flex gap-3 rounded-xl border border-teal-400/15 bg-teal-400/[0.035] p-5"><Check className="mt-0.5 shrink-0 text-teal-300" size={17} /><p className="text-sm leading-6 text-slate-400"><strong className="text-slate-200">Public demo guarantee:</strong> adapters are local simulations. The gateway has no credential source, production network path, or integration capable of mutating an external system.</p></div>
    </div>
  )
}

function AuditDetail({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) { return <div><div className="detail-label">{label}</div><div className={`mt-2 text-xs leading-5 text-slate-300 ${mono ? 'font-mono text-[10px] text-blue-200' : ''}`}>{value}</div></div> }
