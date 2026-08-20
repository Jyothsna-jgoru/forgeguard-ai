import { ArrowRight, Braces, Check, FileCode2, GitCompareArrows, Info, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { CodeDiff } from '../components/CodeDiff'
import { PageHeader, SectionTitle, SecureNotice } from '../components/UI'
import { proposedFiles } from '../data/demo'
import { buildProposedFiles } from '../data/scenario'
import { useDemoState } from '../state/useDemoState'

export function ChangesPage() {
  const { ticket, isCustomTicket } = useDemoState()
  if (isCustomTicket) return <CustomChangePlan ticket={ticket} />
  return (
    <div className="page-container">
      <PageHeader eyebrow="Proposed changes · Review workspace" title="A patch, not a repository mutation" description="The Code Agent produced this unified diff inside an isolated demo workspace. It is review evidence only and has not been applied to any external repository." action={<span className="decision-badge badge-allowed"><GitCompareArrows size={12} /> +74 / −6 lines</span>} />
      <SecureNotice><span><strong className="font-semibold text-white">Review boundary:</strong> all file paths belong to the self-contained sample under <code className="text-teal-200">samples/payment-service</code>. The public demo cannot write to GitHub or a user repository.</span></SecureNotice>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section><div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 text-sm font-semibold text-white"><Braces size={17} className="text-electric" /> Unified diff</h2><span className="text-[10px] uppercase tracking-wider text-slate-600">Java · JUnit 5</span></div><CodeDiff /></section>
        <aside className="space-y-4">
          <section className="surface p-5"><h2 className="flex items-center gap-2 text-sm font-semibold text-white"><FileCode2 size={17} className="text-violet-300" /> Proposed files</h2><div className="mt-5 space-y-4">{proposedFiles.map((file) => <div key={file.path} className="border-b border-line/60 pb-4 last:border-0 last:pb-0"><div className="flex items-start justify-between gap-3"><code className="break-all text-[10px] leading-4 text-blue-200">{file.path}</code><span className="shrink-0 font-mono text-[9px] text-teal-400">{file.change}</span></div><p className="mt-2 text-[11px] leading-5 text-slate-500">{file.reason}</p></div>)}</div></section>
          <section className="surface p-5"><h2 className="flex items-center gap-2 text-sm font-semibold text-white"><ShieldCheck size={17} className="text-teal-300" /> Review notes</h2><ul className="mt-4 space-y-3">{['Key values are not logged or returned.','Processor calls are replay-protected.','Conflicting payloads fail closed.','Store is intentionally replaceable.'].map((item) => <li key={item} className="flex gap-2 text-xs leading-5 text-slate-400"><Check className="mt-0.5 shrink-0 text-teal-400" size={13} />{item}</li>)}</ul></section>
          <div className="flex gap-3 rounded-xl border border-blue-400/15 bg-blue-400/[0.045] p-4"><Info className="mt-0.5 shrink-0 text-blue-300" size={16} /><p className="text-[11px] leading-5 text-slate-400">A production implementation would replace the in-memory store with an atomic, durable backend and define retention explicitly.</p></div>
        </aside>
      </div>
    </div>
  )
}

function CustomChangePlan({ ticket }: { ticket: ReturnType<typeof useDemoState>['ticket'] }) {
  const files = buildProposedFiles(ticket)
  return (
    <div className="page-container">
      <PageHeader eyebrow={`Custom scenario · ${ticket.key}`} title="Structured change proposal" description="Without a connected repository, ForgeGuard produces an honest change-surface plan instead of fabricating source code or claiming that a patch was applied." action={<span className="decision-badge badge-allowed"><GitCompareArrows size={12} /> Reviewable plan</span>} />
      <SecureNotice><span><strong className="font-semibold text-white">Portfolio demo boundary:</strong> these paths describe likely implementation areas for <code className="text-teal-200">{ticket.service}</code>. No repository was read or modified.</span></SecureNotice>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_370px]">
        <section className="surface p-6 md:p-7">
          <SectionTitle icon={<Braces size={18} className="text-electric" />} eyebrow="Code Agent output" title="Proposed implementation areas" description="Each artifact remains a planning statement until a human connects it to real repository context." />
          <div className="space-y-3">{files.map((file, index) => <article key={file.path} className="rounded-xl border border-line/70 bg-ink/45 p-5"><div className="flex items-start justify-between gap-4"><div className="flex min-w-0 gap-3"><span className="font-mono text-[10px] text-electric">0{index + 1}</span><div><code className="break-all text-xs text-blue-200">{file.path}</code><p className="mt-2 text-xs leading-5 text-slate-400">{file.reason}</p></div></div><span className="tag shrink-0">{file.change}</span></div></article>)}</div>
        </section>
        <aside className="space-y-5">
          <section className="surface p-6"><SectionTitle icon={<Check size={17} className="text-teal-300" />} title="Acceptance coverage" /><div className="space-y-3">{ticket.acceptance.map((criterion) => <div key={criterion} className="flex gap-3 text-xs leading-5 text-slate-400"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-400/10"><Check size={12} className="text-teal-300" /></span>{criterion}</div>)}</div></section>
          <section className="rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-5"><div className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-amber-300" /><div><h2 className="text-sm font-semibold text-white">Human context still matters</h2><p className="mt-2 text-xs leading-5 text-slate-400">A repository-aware implementation would require confirmed language, architecture, dependencies, and test conventions. ForgeGuard does not invent them.</p></div></div></section>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1"><Link to="/ticket" className="button button-secondary">Review ticket</Link><Link to="/approval" className="button button-primary">Open approval package <ArrowRight size={14} /></Link></div>
        </aside>
      </div>
    </div>
  )
}
