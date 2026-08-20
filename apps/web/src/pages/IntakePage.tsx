import { ArrowRight, Check, CreditCard, FileInput, KeyRound, LockKeyhole, RotateCcw, Send, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react'
import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader, SecureNotice } from '../components/UI'
import { demoTickets } from '../data/demo'
import { createTicketKey } from '../data/scenario'
import { useDemoState } from '../state/useDemoState'
import type { RiskLevel } from '../types'

type FormErrors = Partial<Record<'title' | 'description' | 'service' | 'acceptance', string>>

const example = {
  title: 'Add rate limiting to the account-recovery endpoint',
  description: 'Limit repeated recovery attempts and return a stable response after the threshold while keeping account existence private.',
  service: 'identity-service',
  acceptance: 'Return HTTP 429 after the configured threshold.\nInclude a Retry-After header.\nKeep responses identical for known and unknown accounts.\nCover the reset window with unit tests.',
}

const demoIcons = [CreditCard, KeyRound, Send, ShoppingBag]

export function IntakePage() {
  const navigate = useNavigate()
  const { submitTicket, resetTicket, ticket, isCustomTicket } = useDemoState()
  const [title, setTitle] = useState(isCustomTicket ? ticket.title.replace(/[.]$/, '') : '')
  const [description, setDescription] = useState(isCustomTicket ? ticket.description : '')
  const [service, setService] = useState(isCustomTicket ? ticket.service : '')
  const [risk, setRisk] = useState<RiskLevel>(isCustomTicket ? ticket.risk : 'Medium')
  const [acceptance, setAcceptance] = useState(isCustomTicket ? ticket.acceptance.join('\n') : '')
  const [errors, setErrors] = useState<FormErrors>({})

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const criteria = acceptance.split('\n').map((item) => item.trim()).filter(Boolean).slice(0, 8)
    const nextErrors: FormErrors = {}
    if (title.trim().length < 12) nextErrors.title = 'Enter a clear summary of at least 12 characters.'
    if (description.trim().length < 30) nextErrors.description = 'Add enough context for the agents to understand the intended behavior.'
    if (service.trim().length < 2) nextErrors.service = 'Name the service or application in scope.'
    if (criteria.length === 0) nextErrors.acceptance = 'Add at least one measurable acceptance criterion.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    submitTicket({
      key: createTicketKey(title),
      title: title.trim().replace(/[.]?$/, '.'),
      description: description.trim(),
      service: service.trim().toLowerCase().replace(/\s+/g, '-'),
      risk,
      owner: 'Demo visitor · local workspace',
      acceptance: criteria,
      source: 'custom',
    })
    navigate('/workflow')
  }

  const loadExample = () => {
    setTitle(example.title)
    setDescription(example.description)
    setService(example.service)
    setRisk('High')
    setAcceptance(example.acceptance)
    setErrors({})
  }

  const openReference = () => {
    resetTicket()
    navigate('/workflow')
  }

  const runDemo = (demo: (typeof demoTickets)[number]) => {
    submitTicket(demo)
    navigate('/workflow')
  }

  return (
    <div className="page-container">
      <PageHeader
        eyebrow="Ticket intake · Safe demonstration mode"
        title="Choose a demo ticket—or create your own"
        description="Start with a ready-made, non-confidential scenario or describe a change of your own. Both paths run the same deterministic planning, validation, policy, and approval walkthrough."
        action={<span className="decision-badge badge-allowed"><ShieldCheck size={12} /> 4 safe scenarios</span>}
      />

      <SecureNotice><span><strong className="font-semibold text-white">Prefer not to enter a ticket?</strong> Choose any ready-made scenario below. They contain no company or customer information and require no typing, sign-in, repository connection, or Docker service.</span></SecureNotice>

      <section className="mt-6" aria-labelledby="demo-ticket-heading">
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><div className="eyebrow mb-2">Recommended starting point</div><h2 id="demo-ticket-heading" className="text-xl font-semibold text-white">Ready-made demo tickets</h2><p className="mt-2 text-sm text-slate-500">Explore realistic SDLC scenarios without supplying any information.</p></div>
          <span className="tag"><LockKeyhole size={12} /> Safe sample data</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
          {demoTickets.map((demo, index) => {
            const Icon = demoIcons[index]
            const riskClass = demo.risk === 'Low' ? 'badge-allowed' : demo.risk === 'High' ? 'badge-blocked' : 'badge-approval'
            return <article key={demo.key} className="group flex min-h-[290px] flex-col rounded-xl border border-line/80 bg-panel/70 p-5 transition hover:-translate-y-0.5 hover:border-electric/35 hover:bg-panel">
              <div className="flex items-start justify-between gap-3"><span className="workflow-icon accent-blue"><Icon size={17} /></span><span className={`decision-badge ${riskClass}`}>{demo.risk} risk</span></div>
              <div className="mt-5 flex items-center gap-2"><span className="font-mono text-[10px] font-semibold text-electric">{demo.key}</span>{index === 0 && <span className="rounded-full bg-teal-400/10 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-teal-300">Full code diff</span>}</div>
              <h3 className="mt-3 text-sm font-semibold leading-6 text-white">{demo.title}</h3>
              <div className="mt-auto pt-5"><div className="mb-4 flex items-center justify-between gap-3 text-[10px] text-slate-500"><span>{demo.service}</span><span className="text-right">{demo.acceptance.length} acceptance checks</span></div><button type="button" onClick={() => runDemo(demo)} className="button button-secondary w-full group-hover:border-electric/40 group-hover:text-white">Run {demo.key} demo <ArrowRight size={14} /></button></div>
            </article>
          })}
        </div>
      </section>

      <div className="my-9 flex items-center gap-4" aria-hidden="true"><span className="h-px flex-1 bg-line/70" /><span className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">or use a safe scenario of your own</span><span className="h-px flex-1 bg-line/70" /></div>

      <SecureNotice><span><strong className="font-semibold text-white">Custom tickets are optional and browser-only:</strong> content is never sent to an API, repository, or model provider. Use a made-up or sanitized scenario—never enter credentials, customer data, internal ticket text, or confidential source code.</span></SecureNotice>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <form onSubmit={submit} className="surface overflow-hidden" noValidate>
          <div className="border-b border-line/70 p-6 md:p-7">
            <div className="flex items-center gap-3"><span className="workflow-icon accent-blue"><FileInput size={17} /></span><div><h2 className="font-semibold text-white">Optional custom ticket</h2><p className="mt-1 text-xs text-slate-500">Use only sanitized or made-up information. Fields stay in this browser.</p></div></div>
          </div>
          <div className="space-y-6 p-6 md:p-7">
            <Field label="Ticket summary" error={errors.title} hint={`${title.length}/140`}>
              <input id="ticket-title" value={title} onChange={(event) => setTitle(event.target.value.slice(0, 140))} className="form-control" placeholder="Add rate limiting to the account recovery endpoint" aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? 'ticket-title-error' : undefined} />
            </Field>

            <Field label="Problem and intended behavior" error={errors.description} hint={`${description.length}/900`}>
              <textarea id="ticket-description" value={description} onChange={(event) => setDescription(event.target.value.slice(0, 900))} className="form-control min-h-32 resize-y" placeholder="Explain the current behavior, the desired outcome, and important constraints." aria-invalid={Boolean(errors.description)} aria-describedby={errors.description ? 'ticket-description-error' : undefined} />
            </Field>

            <div className="grid gap-5 sm:grid-cols-[1fr_180px]">
              <Field label="Service or application" error={errors.service}>
                <input id="ticket-service" value={service} onChange={(event) => setService(event.target.value.slice(0, 64))} className="form-control" placeholder="identity-service" aria-invalid={Boolean(errors.service)} aria-describedby={errors.service ? 'ticket-service-error' : undefined} />
              </Field>
              <Field label="Initial risk">
                <select id="ticket-risk" value={risk} onChange={(event) => setRisk(event.target.value as RiskLevel)} className="form-control">
                  <option>Low</option><option>Medium</option><option>High</option>
                </select>
              </Field>
            </div>

            <Field label="Acceptance criteria" error={errors.acceptance} hint="One criterion per line · up to 8">
              <textarea id="ticket-acceptance" value={acceptance} onChange={(event) => setAcceptance(event.target.value.slice(0, 1000))} className="form-control min-h-36 resize-y" placeholder={'Return HTTP 429 after the configured threshold.\nInclude a Retry-After header.\nCover the limit reset behavior with unit tests.'} aria-invalid={Boolean(errors.acceptance)} aria-describedby={errors.acceptance ? 'ticket-acceptance-error' : undefined} />
            </Field>

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-line/70 pt-6 sm:flex-row sm:items-center">
              <button type="button" onClick={loadExample} className="button button-secondary"><Sparkles size={14} /> Fill safe example</button>
              <button type="submit" className="button button-primary px-5">Run custom workflow <ArrowRight size={15} /></button>
            </div>
          </div>
        </form>

        <aside className="space-y-5">
          <section className="surface p-6">
            <div className="eyebrow mb-3">What the demo creates</div>
            <h2 className="text-lg font-semibold text-white">A bounded evidence package</h2>
            <div className="mt-5 space-y-4">
              {[
                ['01', 'Normalized plan', 'Intent, constraints, assumptions, and review checkpoints.'],
                ['02', 'Repository analysis', 'A safe change-surface proposal without repository access.'],
                ['03', 'Validation map', 'Acceptance criteria connected to deterministic checks.'],
                ['04', 'Approval package', 'A simulated draft PR summary that requires explicit approval.'],
              ].map(([number, heading, copy]) => <div key={number} className="flex gap-3"><span className="font-mono text-[10px] text-electric">{number}</span><div><div className="text-xs font-semibold text-slate-200">{heading}</div><p className="mt-1 text-[11px] leading-5 text-slate-500">{copy}</p></div></div>)}
            </div>
          </section>

          <section className="rounded-xl border border-violet-400/20 bg-violet-400/[0.045] p-5">
            <div className="flex gap-3"><ShieldCheck size={18} className="mt-0.5 shrink-0 text-violet-300" /><div><h2 className="text-sm font-semibold text-white">The safety boundary stays intact</h2><p className="mt-2 text-xs leading-5 text-slate-400">Whether you choose a demo or enter a custom scenario, tool calls, tests, code changes, GitHub actions, and approvals remain simulated.</p></div></div>
          </section>

          <section className="surface p-5"><div className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-teal-300" /><div><h2 className="text-sm font-semibold text-white">Current scenario</h2><p className="mt-2 text-xs leading-5 text-slate-400"><span className="font-mono text-blue-200">{ticket.key}</span> · {ticket.title}</p></div></div></section>
          <button type="button" onClick={openReference} className="button button-secondary w-full"><RotateCcw size={14} /> Restore PAY-1842 reference</button>
        </aside>
      </div>
    </div>
  )
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: ReactNode }) {
  const id = `ticket-${label === 'Ticket summary' ? 'title' : label === 'Problem and intended behavior' ? 'description' : label === 'Service or application' ? 'service' : label === 'Initial risk' ? 'risk' : 'acceptance'}`
  return <div><div className="mb-2 flex items-center justify-between gap-3"><label htmlFor={id} className="text-xs font-semibold text-slate-300">{label}</label>{hint && <span className="text-[10px] text-slate-600">{hint}</span>}</div>{children}{error && <p id={`${id}-error`} role="alert" className="mt-2 text-xs text-red-300">{error}</p>}</div>
}
