import { ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="ForgeGuard AI home">
      <span className="brand-mark"><ShieldCheck size={20} strokeWidth={2.2} /></span>
      {!compact && (
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-white">ForgeGuard <span className="text-electric">AI</span></span>
          <span className="block text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">Secure delivery control</span>
        </span>
      )}
    </Link>
  )
}

