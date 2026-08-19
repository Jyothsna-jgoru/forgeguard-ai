import { AlertTriangle, Check, ClipboardCheck, FileText, Layers3, Search, Tag } from 'lucide-react'
import { PageHeader, RiskBanner, SectionTitle } from '../components/UI'
import { demoTicket, implementationPlan, ragContext } from '../data/demo'

export function TicketPage() {
  return (
    <div className="page-container">
      <PageHeader eyebrow="Ticket intake · PAY-1842" title="Idempotent payment retries" description="The normalized work item, implementation intent, and retrieved engineering context supplied to the agent harness." action={<span className="decision-badge badge-approval"><AlertTriangle size={12} /> Medium risk</span>} />
      <div className="grid gap-6 xl:grid-cols-[1.25fr_.75fr]">
        <div className="space-y-6">
          <section className="surface p-6 md:p-7">
            <div className="mb-6 flex flex-wrap gap-2"><span className="tag"><Tag size={12} /> {demoTicket.key}</span><span className="tag"><Layers3 size={12} /> {demoTicket.service}</span><span className="tag">Owner · {demoTicket.owner}</span></div>
            <h2 className="text-xl font-semibold leading-8 text-white">{demoTicket.title}</h2><p className="mt-5 text-sm leading-7 text-slate-400">{demoTicket.description}</p>
            <div className="mt-7 border-t border-line/70 pt-7"><SectionTitle icon={<ClipboardCheck size={18} className="text-teal-300" />} title="Acceptance criteria" /><ul className="space-y-3">{demoTicket.acceptance.map((item) => <li key={item} className="flex gap-3 text-sm leading-6 text-slate-300"><span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-teal-400/40 bg-teal-400/10"><Check size={10} className="text-teal-300" /></span>{item}</li>)}</ul></div>
          </section>
          <RiskBanner><span><strong className="font-semibold text-amber-100">Risk rationale:</strong> the payment processor call is financially sensitive, but the proposed work is scoped to validation and replay behavior. No production data, deployment, or provider integration is available to the demo.</span></RiskBanner>
        </div>

        <aside className="surface h-fit p-6"><SectionTitle eyebrow="Normalized context" title="Impact assessment" /><dl className="space-y-4 text-sm">{[['Primary service','payment-service'],['API surface','POST /api/payments'],['Change type','Behavior + tests'],['Data migration','None'],['External dependency','None'],['Review gate','Required']].map(([label,value]) => <div key={label} className="flex justify-between gap-4 border-b border-line/50 pb-3 last:border-0"><dt className="text-slate-500">{label}</dt><dd className="text-right font-medium text-slate-200">{value}</dd></div>)}</dl></aside>
      </div>

      <section className="mt-6 surface p-6 md:p-7"><SectionTitle eyebrow="Planner output" title="Implementation plan" description="Ordered to keep the HTTP contract, retry state, processing behavior, and evidence independently reviewable." /><ol className="grid gap-3 lg:grid-cols-4">{implementationPlan.map((item, index) => <li key={item.title} className="rounded-xl border border-line/80 bg-ink/45 p-5"><span className="flex h-7 w-7 items-center justify-center rounded-lg border border-electric/25 bg-electric/10 font-mono text-[11px] text-blue-300">0{index + 1}</span><h3 className="mt-5 text-sm font-semibold text-white">{item.title}</h3><p className="mt-2 text-xs leading-5 text-slate-500">{item.detail}</p></li>)}</ol></section>

      <section className="mt-6 surface p-6 md:p-7"><SectionTitle icon={<Search size={18} className="text-violet-300" />} eyebrow="Local retrieval · Top 3 matches" title="RAG-retrieved engineering context" description="A deterministic local index selects relevant standards and repository guidance. No external model or service is called." /><div className="grid gap-3 lg:grid-cols-3">{ragContext.map((item) => <article key={item.source} className="rounded-xl border border-line bg-white/[0.018] p-5"><div className="flex items-center justify-between"><FileText size={16} className="text-slate-500" /><span className="font-mono text-[10px] text-teal-400">match {item.score}</span></div><h3 className="mt-4 text-xs font-semibold text-blue-200">{item.source}</h3><p className="mt-3 text-xs leading-5 text-slate-400">{item.text}</p></article>)}</div></section>
    </div>
  )
}

