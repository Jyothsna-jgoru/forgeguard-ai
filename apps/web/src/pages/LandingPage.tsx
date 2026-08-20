import { ArrowRight, Braces, Check, ChevronRight, Eye, FileSearch, FlaskConical, GitPullRequestDraft, LockKeyhole, Route, ShieldCheck, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Brand } from '../components/Brand'

const agents = [
  { icon: Route, name: 'Planner', copy: 'Turns intent and constraints into a bounded implementation plan.', color: 'text-blue-300' },
  { icon: FileSearch, name: 'Repository Analyst', copy: 'Maps relevant services, files, dependencies, and standards.', color: 'text-teal-300' },
  { icon: Braces, name: 'Code', copy: 'Produces a scoped, reviewable patch in an isolated workspace.', color: 'text-violet-300' },
  { icon: FlaskConical, name: 'Test', copy: 'Builds evidence against acceptance criteria with safe checks.', color: 'text-teal-300' },
  { icon: ShieldCheck, name: 'Security Review', copy: 'Evaluates risk, permissions, sensitive data, and escalation.', color: 'text-amber-300' },
  { icon: GitPullRequestDraft, name: 'Documentation', copy: 'Packages the change for a concise, informed human review.', color: 'text-blue-300' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-ink text-slate-200">
      <div className="hero-grid absolute inset-x-0 top-0 h-[760px] opacity-50" aria-hidden="true" />
      <div className="hero-orb hero-orb-blue" aria-hidden="true" /><div className="hero-orb hero-orb-teal" aria-hidden="true" />
      <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Brand />
        <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex" aria-label="Primary navigation">
          <a href="#platform" className="hover:text-white">Platform</a><a href="#security" className="hover:text-white">Security</a><Link to="/architecture" className="hover:text-white">Architecture</Link><Link to="/docs" className="hover:text-white">Docs</Link>
        </nav>
        <Link to="/intake" className="button button-secondary">Try a ticket <ArrowRight size={15} /></Link>
      </header>

      <main>
        <section className="relative z-10 mx-auto grid min-h-[680px] max-w-7xl items-center gap-12 px-5 pb-20 pt-16 lg:grid-cols-[1.03fr_.97fr] lg:px-8 lg:pt-12">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-electric/20 bg-electric/[0.07] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-blue-300"><Sparkles size={13} /> Interactive platform demonstration</div>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] tracking-[-0.055em] text-white sm:text-6xl lg:text-[68px]">Secure AI orchestration for <span className="gradient-text">software delivery</span></h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">ForgeGuard coordinates specialized agents through a governed delivery workflow—turning an engineering ticket into tested, policy-reviewed, human-approved change evidence.</p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link to="/intake" className="button button-primary">Submit Your Own Ticket <ArrowRight size={16} /></Link>
              <Link to="/workflow" className="button button-secondary">Explore completed workflow</Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-slate-500">
              <span className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> No sign-in</span><span className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> Local-only ticket input</span><span className="flex items-center gap-2"><Check size={14} className="text-teal-400" /> No repository access</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[590px] lg:mx-0">
            <div className="workflow-preview surface p-4 sm:p-5">
              <div className="flex items-center justify-between border-b border-line/70 pb-4"><div><div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-electric">Live workflow</div><div className="mt-1 text-sm font-semibold text-white">PAY-1842 · Idempotency validation</div></div><span className="decision-badge badge-allowed"><Check size={12} /> Complete</span></div>
              <div className="mt-5 space-y-2">
                {agents.map(({ icon: Icon, name }, index) => <div key={name} className="preview-step" style={{ animationDelay: `${index * 90}ms` }}><span className="preview-node"><Icon size={14} /></span><div className="min-w-0 flex-1"><div className="flex justify-between gap-3"><span className="text-xs font-medium text-slate-200">{name} Agent</span><span className="font-mono text-[10px] text-slate-600">{['0.8s','1.1s','1.7s','2.4s','1.0s','0.7s'][index]}</span></div><div className="mt-1 h-1 overflow-hidden rounded-full bg-slate-800"><div className="h-full rounded-full bg-gradient-to-r from-electric to-teal-400" style={{ width: `${84 + index * 2}%` }} /></div></div><Check size={14} className="text-teal-400" /></div>)}
              </div>
              <div className="mt-4 flex items-center gap-3 rounded-lg border border-amber-400/20 bg-amber-400/[0.05] p-3"><LockKeyhole size={16} className="text-amber-300" /><div className="flex-1"><div className="text-[11px] font-semibold text-amber-100">Human approval checkpoint</div><div className="text-[10px] text-amber-200/50">github.create_draft_pr</div></div><span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">Required</span></div>
            </div>
            <div className="absolute -bottom-5 -left-4 hidden rounded-xl border border-line bg-[#101c2d] p-3 shadow-xl sm:flex"><Eye size={16} className="text-teal-300" /><div className="ml-3"><div className="text-[10px] font-semibold text-white">Audit complete</div><div className="text-[9px] text-slate-500">Every tool decision recorded</div></div></div>
          </div>
        </section>

        <section id="platform" className="border-y border-line/60 bg-[#091321]/70 py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="max-w-2xl"><div className="eyebrow mb-3">Specialized by design</div><h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">One workflow. Six focused agents.</h2><p className="mt-4 leading-7 text-slate-400">Each agent receives only the context and capabilities needed for its role. The harness owns routing, state, checkpoints, and evidence.</p></div>
            <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {agents.map(({ icon: Icon, name, copy, color }) => <div key={name} className="agent-card group"><Icon className={`${color} transition-transform group-hover:-translate-y-0.5`} size={20} /><h3 className="mt-5 font-semibold text-white">{name} Agent</h3><p className="mt-2 text-sm leading-6 text-slate-500">{copy}</p><Link to="/workflow" className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-white">Inspect output <ChevronRight size={13} /></Link></div>)}
            </div>
          </div>
        </section>

        <section id="security" className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-2 lg:items-center lg:px-8">
          <div className="relative rounded-2xl border border-line bg-panel/70 p-5 shadow-glow sm:p-8">
            <div className="absolute right-5 top-5 rounded-lg border border-teal-400/15 bg-teal-400/[0.05] p-2 text-teal-300"><ShieldCheck size={20} /></div>
            <div className="eyebrow">Secure MCP Tool Gateway</div><div className="mt-6 space-y-3">
              {[['repository.read','Allowed','text-teal-300'],['test.run','Allowed','text-teal-300'],['github.create_draft_pr','Approval','text-amber-300'],['deployment.production','Blocked','text-red-300'],['secrets.read','Blocked','text-red-300']].map(([tool,result,color]) => <div key={tool} className="flex items-center justify-between rounded-lg border border-line/70 bg-ink/50 px-4 py-3"><code className="text-xs text-slate-300">{tool}</code><span className={`text-[10px] font-bold uppercase tracking-wider ${color}`}>{result}</span></div>)}
            </div>
          </div>
          <div><div className="eyebrow mb-3">Control before capability</div><h2 className="text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Every tool call is a policy decision.</h2><p className="mt-5 leading-7 text-slate-400">Agents never receive direct tool access. The gateway authenticates agent identity, validates structured arguments, enforces least privilege, and records an audit event before a simulated adapter can run.</p><div className="mt-7 grid gap-4 sm:grid-cols-2">{['Deny by default','Role-scoped access','Schema validation','Human approval gates'].map((item) => <div key={item} className="flex items-center gap-3 text-sm text-slate-300"><span className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-400/10 text-teal-300"><Check size={13} /></span>{item}</div>)}</div><Link to="/governance" className="button button-secondary mt-8">Explore gateway decisions <ArrowRight size={15} /></Link></div>
        </section>

        <section className="border-t border-line/60 bg-gradient-to-b from-[#091321] to-ink py-20 text-center"><div className="mx-auto max-w-3xl px-5"><div className="eyebrow mb-4">See the evidence chain</div><h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Bring a ticket. Explore the governed path.</h2><p className="mx-auto mt-4 max-w-xl leading-7 text-slate-400">Use your own engineering scenario or replay PAY-1842, inspect every decision, and approve a simulated draft pull request.</p><Link to="/intake" className="button button-primary mt-8">Try Your Own Ticket <ArrowRight size={16} /></Link></div></section>
      </main>
      <footer className="border-t border-line/60 bg-[#060d18] py-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-xs text-slate-600 sm:flex-row lg:px-8"><Brand /><span>Public demonstration · Simulated integrations · No external actions</span></div></footer>
    </div>
  )
}
