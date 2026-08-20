import { useState } from 'react'
import { Activity, Blocks, BookOpen, Braces, CheckCircle2, FileInput, Menu, Network, ShieldCheck, Ticket, X } from 'lucide-react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Brand } from './Brand'
import { useDemoState } from '../state/useDemoState'

const nav = [
  { to: '/intake', label: 'New ticket', icon: FileInput },
  { to: '/workflow', label: 'Workflow', icon: Activity },
  { to: '/ticket', label: 'Ticket', icon: Ticket },
  { to: '/changes', label: 'Changes', icon: Braces },
  { to: '/governance', label: 'Governance', icon: ShieldCheck },
  { to: '/approval', label: 'Approval', icon: CheckCircle2 },
  { to: '/architecture', label: 'Architecture', icon: Network },
  { to: '/docs', label: 'Docs', icon: BookOpen },
]

function Navigation({ onNavigate }: { onNavigate?: () => void }) {
  const { approved } = useDemoState()
  return (
    <nav className="mt-8 space-y-1" aria-label="Demo navigation">
      {nav.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
          <Icon size={17} aria-hidden="true" /><span>{label}</span>
          {to === '/approval' && <span className={`ml-auto h-2 w-2 rounded-full ${approved ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,.7)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,.7)]'}`} aria-label={approved ? 'Approval completed' : 'Approval ready'} />}
        </NavLink>
      ))}
    </nav>
  )
}

export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const { ticket, isCustomTicket } = useDemoState()

  return (
    <div className="min-h-screen bg-ink text-slate-200">
      <a href="#main-content" className="skip-link">Skip to content</a>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-line/80 bg-[#091321]/95 px-5 py-6 backdrop-blur-xl lg:block">
        <Brand />
        <Navigation />
        <div className="absolute inset-x-5 bottom-5 rounded-xl border border-teal-400/15 bg-teal-400/[0.04] p-3">
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold text-teal-300"><span className="status-dot" /> DEMO MODE</div>
          <p className="text-[11px] leading-relaxed text-slate-500">{isCustomTicket ? 'Local ticket · deterministic outputs · no external mutations' : 'Seeded workflow · simulated tools · no external mutations'}</p>
        </div>
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-line/70 bg-ink/85 px-4 backdrop-blur-xl lg:ml-64 lg:px-8">
        <div className="lg:hidden"><Brand compact /></div>
        <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <Blocks size={14} /> <span>ForgeGuard</span><span>/</span><span className="capitalize text-slate-300">{location.pathname.slice(1) || 'overview'}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-md border border-line bg-white/[0.025] px-2.5 py-1.5 font-mono text-[10px] text-slate-400 sm:inline">{isCustomTicket ? `RUN-${ticket.key}` : 'RUN-2026-0818-0042'}</span>
          <span className="flex items-center gap-2 text-[11px] font-medium text-teal-300"><span className="status-dot" /> Completed</span>
          <button type="button" onClick={() => setMenuOpen(true)} className="icon-button lg:hidden" aria-label="Open navigation"><Menu size={19} /></button>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/70" onClick={() => setMenuOpen(false)} aria-label="Close navigation overlay" />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-line bg-[#091321] p-5 shadow-2xl">
            <div className="flex items-center justify-between"><Brand /><button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={18} /></button></div>
            <Navigation onNavigate={() => setMenuOpen(false)} />
          </aside>
        </div>
      )}

      <main id="main-content" className="min-h-[calc(100vh-4rem)] lg:ml-64">
        <Outlet />
      </main>
    </div>
  )
}
