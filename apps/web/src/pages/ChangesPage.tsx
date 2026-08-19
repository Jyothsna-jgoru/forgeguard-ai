import { Braces, Check, FileCode2, GitCompareArrows, Info, ShieldCheck } from 'lucide-react'
import { CodeDiff } from '../components/CodeDiff'
import { PageHeader, SecureNotice } from '../components/UI'
import { proposedFiles } from '../data/demo'

export function ChangesPage() {
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

