import { AlertTriangle, Check, Clock3, LockKeyhole, ShieldCheck, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'
import type { Decision } from '../types'

export function PageHeader({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-5 border-b border-line/70 pb-7 md:flex-row md:items-end">
      <div className="max-w-3xl">
        <div className="eyebrow mb-3">{eyebrow}</div>
        <h1 className="text-3xl font-semibold tracking-[-0.035em] text-white md:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {action}
    </div>
  )
}

export function DecisionBadge({ decision }: { decision: Decision }) {
  const map = {
    allowed: { label: 'Allowed', icon: Check, className: 'badge-allowed' },
    approval_required: { label: 'Approval required', icon: Clock3, className: 'badge-approval' },
    blocked: { label: 'Blocked', icon: XCircle, className: 'badge-blocked' },
  }
  const item = map[decision]
  const Icon = item.icon
  return <span className={`decision-badge ${item.className}`}><Icon size={12} />{item.label}</span>
}

export function Metric({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'teal' | 'amber' }) {
  return (
    <div className="metric-card">
      <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</span>
      <span className={`mt-2 block text-lg font-semibold ${tone === 'teal' ? 'text-teal-300' : tone === 'amber' ? 'text-amber-300' : 'text-white'}`}>{value}</span>
    </div>
  )
}

export function SectionTitle({ icon, eyebrow, title, description }: { icon?: ReactNode; eyebrow?: string; title: string; description?: string }) {
  return (
    <div className="mb-5">
      {eyebrow && <div className="eyebrow mb-2">{eyebrow}</div>}
      <h2 className="flex items-center gap-2 text-lg font-semibold text-white">{icon}{title}</h2>
      {description && <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>}
    </div>
  )
}

export function RiskBanner({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.055] p-4 text-sm leading-6 text-amber-100/80"><AlertTriangle className="mt-0.5 shrink-0 text-amber-300" size={18} />{children}</div>
}

export function SecureNotice({ children }: { children: ReactNode }) {
  return <div className="flex gap-3 rounded-xl border border-teal-400/20 bg-teal-400/[0.045] p-4 text-sm leading-6 text-slate-300"><ShieldCheck className="mt-0.5 shrink-0 text-teal-300" size={18} />{children}</div>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="surface flex min-h-56 flex-col items-center justify-center p-8 text-center"><LockKeyhole className="mb-4 text-slate-600" size={28} /><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p></div>
}

