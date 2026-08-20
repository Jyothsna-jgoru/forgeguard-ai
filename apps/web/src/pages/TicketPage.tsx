import { AlertTriangle, Check, ClipboardCheck, FileText, Layers3, Search, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeader, RiskBanner, SectionTitle } from '../components/UI'
import { buildImplementationPlan, buildRagContext } from '../data/scenario'
import { useDemoState } from '../state/useDemoState'

export function TicketPage() {
  const { ticket, isCustomTicket } = useDemoState()
  const plan = buildImplementationPlan(ticket)
  const context = buildRagContext(ticket)
  const riskClass = ticket.risk === 'Low' ? 'badge-allowed' : ticket.risk === 'High' ? 'badge-blocked' : 'badge-approval'
  return (
    <div className="page-container">
      <PageHeader eyebrow={`Ticket intake · ${ticket.key}`} title={isCustomTicket ? 'Visitor-submitted engineering ticket' : 'Idempotent payment retries'} description="The normalized work item, implementation intent, and retrieved engineering context supplied to the agent harness." action={<div className="flex flex-wrap gap-2"><span className={`decision-badge ${riskClass}`}><AlertTriangle size={12} /> {ticket.risk} risk</span><Link to="/intake" className="button button-secondary">{isCustomTicket ? 'Edit ticket' : 'Try your ticket'}</Link></div>} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-6">
          <section className="surface p-6 md:p-7">
            <div className="mb-6 flex flex-wrap gap-2"><span className="tag"><Tag size={12} /> {ticket.key}</span><span className="tag"><Layers3 size={12} /> {ticket.service}</span><span className="tag">Owner · {ticket.owner}</span></div>
            <h2 className="text-xl font-semibold leading-8 text-white">{ticket.title}</h2><p className="mt-5 text-sm leading-7 text-slate-400">{ticket.description}</p>
            <div className="mt-7 border-t border-line/70 pt-7"><SectionTitle icon={<ClipboardCheck size={18} className="text-teal-300" />} title="Acceptance criteria" /><ul className="space-y-3">{ticket.acceptance.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10"><Check size={10} className="text-teal-300" /></span>{item}</li>)}</ul></div>
          </section>
          <RiskBanner><span><strong className="font-semibold text-amber-100">Risk rationale:</strong> {isCustomTicket ? `the visitor classified this scenario as ${ticket.risk.toLowerCase()} risk. ForgeGuard keeps the proposal local, treats ticket text as untrusted input, and requires approval before the simulated external action.` : 'the payment processor call is financially sensitive, but the proposed work is scoped to validation and replay behavior. No production data, deployment, or provider integration is available to the demo.'}</span></RiskBanner>
        </div>

        <aside className="surface h-fit p-6"><SectionTitle eyebrow="Normalized context" title="Impact assessment" /><dl className="space-y-4 text-sm">{[['Primary service',ticket.service],['Scenario source',isCustomTicket ? 'Local visitor input' : 'Seeded reference'],['Change type',isCustomTicket ? 'Structured proposal' : 'Behavior + tests'],['Acceptance checks',String(ticket.acceptance.length)],['External dependency','None connected'],['Review gate','Required']].map(([label,value]) => <div key={label} className="flex justify-between gap-4 border-b border-line/50 pb-3 last:border-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-200">{value}</dd></div>)}</dl></aside>
      </div>

      <section className="mt-6 surface p-6 md:p-7"><SectionTitle eyebrow="Planner output" title="Implementation plan" description="Ordered to keep intent, change scope, validation evidence, and human review independently inspectable." /><ol className="grid gap-3 lg:grid-cols-4">{plan.map((item, index) => <li key={item.title} className="rounded-xl border border-line/80 bg-ink/45 p-5"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-electric/25 bg-electric/10 font-mono text-[11px] text-blue-300">0{index + 1}</span><h3 className="mt-5 text-sm font-semibold text-white">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p></li>)}</ol></section>

      <section className="mt-6 surface p-6 md:p-7"><SectionTitle icon={<Search size={18} className="text-violet-300" />} eyebrow="Local retrieval · Top 3 matches" title="RAG-retrieved engineering context" description="A deterministic local index selects relevant standards and repository guidance. No external model or service is called." /><div className="grid gap-3 lg:grid-cols-3">{context.map((item) => <article key={item.source} className="rounded-xl border border-line bg-white/[0.018] p-5"><div className="flex items-center justify-between"><FileText size={16} className="text-slate-500" /><span className="font-mono text-[10px] text-teal-400">match {item.score}</span></div><h3 className="mt-4 text-xs font-semibold text-blue-200">{item.source}</h3><p className="mt-3 text-xs leading-5 text-slate-400">{item.text}</p></article>)}</div></section>
    </div>
  )
}
