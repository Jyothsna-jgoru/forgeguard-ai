import { AlertTriangle, Check, CheckCircle2, ClipboardCheck, FileCode2, GitBranch, GitPullRequestDraft, RotateCcw, ShieldCheck, TestTube2 } from 'lucide-react'
import { useState } from 'react'
import { PageHeader, RiskBanner, SectionTitle } from '../components/UI'
import { implementationPlan, prPackage, proposedFiles } from '../data/demo'

export function ApprovalPage() {
  const [approved, setApproved] = useState(false)
  return (
    <div className="page-container">
      <PageHeader eyebrow="Human checkpoint · APV-0042" title={approved ? 'Simulated draft pull request created' : 'Review package ready for approval'} description={approved ? 'The demo recorded an explicit approval and generated a local draft PR artifact. No GitHub API call was made.' : 'Automated work stops here. Review the plan, files, validation evidence, risk notes, and generated summary before authorizing the simulated transition.'} action={approved ? <span className="decision-badge badge-allowed"><CheckCircle2 size={12} /> Approved</span> : <span className="decision-badge badge-approval"><AlertTriangle size={12} /> Human action required</span>} />

      {approved ? <ApprovedPackage onReset={() => setApproved(false)} /> : <ReviewPackage onApprove={() => setApproved(true)} />}
    </div>
  )
}

function ReviewPackage({ onApprove }: { onApprove: () => void }) {
  return <>
    <RiskBanner><span><strong className="font-semibold text-amber-100">Approval is deliberately local.</strong> This action updates browser state for the demonstration and appends a simulated audit record. It cannot create a branch or pull request outside ForgeGuard.</span></RiskBanner>
    <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_390px]">
      <div className="space-y-6">
        <section className="surface p-6"><SectionTitle icon={<ClipboardCheck size={17} className="text-electric" />} title="Plan and proposed scope" /><div className="grid gap-3 md:grid-cols-2">{implementationPlan.map((item, index) => <div key={item.title} className="flex gap-3 rounded-lg border border-line/70 bg-ink/40 p-4"><span className="font-mono text-[10px] text-electric">0{index + 1}</span><div><div className="text-xs font-semibold text-slate-200">{item.title}</div><p className="mt-1 text-[11px] leading-5 text-slate-500">{item.detail}</p></div></div>)}</div><div className="mt-6 space-y-3">{proposedFiles.map((file) => <div key={file.path} className="flex items-center justify-between gap-4 border-t border-line/50 pt-3"><div className="flex min-w-0 items-center gap-3"><FileCode2 size={14} className="shrink-0 text-slate-600" /><code className="truncate text-[10px] text-blue-200">{file.path}</code></div><span className="shrink-0 font-mono text-[9px] text-teal-400">{file.change}</span></div>)}</div></section>
        <section className="surface p-6"><SectionTitle icon={<GitPullRequestDraft size={17} className="text-violet-300" />} title="Generated pull-request summary" /><h3 className="text-base font-semibold text-white">{prPackage.title}</h3><p className="mt-3 text-sm leading-6 text-slate-400">{prPackage.summary}</p><div className="mt-5 rounded-lg border border-line bg-ink/55 p-4"><div className="detail-label">Reviewer focus</div><ul className="mt-3 space-y-2 text-xs text-slate-400"><li>• Confirm retry-key retention and atomicity requirements for the target runtime.</li><li>• Validate HTTP 409 matches the service API error contract.</li><li>• Confirm request fingerprinting includes every payment-defining field.</li></ul></div></section>
      </div>
      <aside className="space-y-5">
        <section className="surface p-6"><SectionTitle icon={<TestTube2 size={17} className="text-teal-300" />} title="Validation evidence" /><div className="space-y-3">{['PaymentServiceTest · 8 passed','PaymentControllerTest · 4 passed','Processor invoked once on retry','Conflicting payload rejected','Sensitive logging scan clear'].map((item) => <div key={item} className="flex items-center gap-3 text-xs text-slate-300"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-400/10 text-teal-300"><Check size={12} /></span>{item}</div>)}</div></section>
        <section className="surface p-6"><SectionTitle icon={<ShieldCheck size={17} className="text-amber-300" />} title="Risk review" /><dl className="space-y-3 text-xs">{[['Security findings','0 critical · 0 high'],['Residual note','In-memory store is demo-only'],['Policy decision','Approval required'],['External changes','None performed']].map(([label,value]) => <div key={label} className="flex justify-between gap-3"><dt className="text-slate-500">{label}</dt><dd className="text-right text-slate-300">{value}</dd></div>)}</dl></section>
        <button type="button" onClick={onApprove} className="button button-primary w-full py-3.5"><ShieldCheck size={17} /> Approve Draft PR</button><p className="text-center text-[10px] leading-4 text-slate-600">Demo mode only · records local approval · performs no GitHub mutation</p>
      </aside>
    </div>
  </>
}

function ApprovedPackage({ onReset }: { onReset: () => void }) {
  return <div className="mx-auto max-w-5xl"><div className="mb-6 overflow-hidden rounded-2xl border border-teal-400/25 bg-gradient-to-br from-teal-400/[0.08] via-panel to-electric/[0.06] p-7 shadow-glow"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-start"><div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-400/15 text-teal-300"><GitPullRequestDraft size={23} /></span><div><div className="eyebrow mb-2">Draft pull request · simulated</div><h2 className="text-xl font-semibold leading-7 text-white">{prPackage.title}</h2><div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] text-slate-500"><span className="flex items-center gap-1.5"><GitBranch size={12} /> {prPackage.branch}</span><span>→</span><span>main</span></div></div></div><span className="decision-badge badge-allowed"><Check size={12} /> Draft ready</span></div><p className="mt-6 border-t border-teal-400/10 pt-5 text-sm leading-6 text-slate-400">{prPackage.summary}</p></div>
    <div className="grid gap-6 md:grid-cols-2"><section className="surface p-6"><SectionTitle title="Changed files" />{proposedFiles.map((file) => <div key={file.path} className="mb-3 flex items-center justify-between gap-3 border-b border-line/50 pb-3 last:mb-0 last:border-0"><code className="truncate text-[10px] text-blue-200">{file.path.split('/').at(-1)}</code><span className="font-mono text-[9px] text-teal-400">{file.change}</span></div>)}</section><section className="surface p-6"><SectionTitle title="Checks and review state" />{prPackage.checks.map((item) => <div key={item} className="mb-3 flex items-center gap-3 text-xs text-slate-300"><CheckCircle2 size={15} className="text-teal-300" />{item}</div>)}</section></div>
    <section className="surface mt-6 p-6"><div className="grid gap-5 sm:grid-cols-3"><div><div className="detail-label">Approval record</div><div className="mt-2 font-mono text-xs text-blue-200">APR-2026-0042</div></div><div><div className="detail-label">Actor</div><div className="mt-2 text-xs text-slate-300">Demo visitor · explicit action</div></div><div><div className="detail-label">Audit result</div><div className="mt-2 text-xs text-teal-300">Hash chain verified</div></div></div></section>
    <button type="button" onClick={onReset} className="button button-secondary mt-6"><RotateCcw size={14} /> Reset checkpoint</button></div>
}

