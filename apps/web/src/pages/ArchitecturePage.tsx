import { Box, Braces, Database, KeyRound, Network, ShieldCheck } from 'lucide-react'
import { MermaidDiagram } from '../components/MermaidDiagram'
import { PageHeader, SectionTitle } from '../components/UI'

const diagram = `flowchart LR
  subgraph PUBLIC["Public / Browser Trust Zone"]
    UI["React Demo UI"]
    SEED["Seeded Read-only Data"]
  end
  subgraph CONTROL["ForgeGuard Control Plane"]
    API["FastAPI"]
    GRAPH["LangGraph Harness"]
    RAG["Local RAG Store"]
    GATE["Secure MCP Gateway"]
    APPROVE{"Human Approval Gate"}
  end
  subgraph TOOLS["Isolated Tool Zone"]
    REPO["Sample Repository"]
    TEST["Sandboxed Tests"]
    PR["Draft PR Simulator"]
  end
  subgraph EVIDENCE["Evidence Zone"]
    DB[("PostgreSQL")]
    AUDIT[("Audit Events")]
  end
  UI --> SEED
  UI -. "optional local API" .-> API
  API --> GRAPH
  GRAPH <--> RAG
  GRAPH --> GATE
  GATE --> REPO
  GATE --> TEST
  GATE --> APPROVE
  APPROVE --> PR
  GRAPH --> DB
  GATE --> AUDIT
  APPROVE --> AUDIT
  classDef public fill:#101d31,stroke:#5b8cff,color:#dbeafe
  classDef control fill:#112432,stroke:#2dd4bf,color:#ccfbf1
  classDef tool fill:#1b1734,stroke:#9b87f5,color:#ede9fe
  classDef evidence fill:#261e18,stroke:#fbbf24,color:#fef3c7
  class UI,SEED public
  class API,GRAPH,RAG,GATE,APPROVE control
  class REPO,TEST,PR tool
  class DB,AUDIT evidence`

const layers = [
  { icon: Braces, title: 'Experience layer', text: 'React renders the complete seeded scenario independently of a hosted backend, making the public site reliable and read-only.' },
  { icon: Network, title: 'Orchestration layer', text: 'A deterministic LangGraph state machine routes each bounded agent stage and preserves workflow state.' },
  { icon: Database, title: 'Context & evidence', text: 'A local retrieval index supplies approved context; PostgreSQL stores workflow and audit records for local operation.' },
  { icon: ShieldCheck, title: 'Policy control plane', text: 'The MCP-style gateway mediates capability through typed requests, a role matrix, approval gates, and audit events.' },
  { icon: Box, title: 'Isolated tool adapters', text: 'Repository reading, tests, and draft PR creation are simulated against the included sample project.' },
  { icon: KeyRound, title: 'Human authority', text: 'External-action intent stops at an explicit checkpoint. Demo approval produces only a local artifact.' },
]

export function ArchitecturePage() {
  return <div className="page-container"><PageHeader eyebrow="System design · Trust-aware architecture" title="Control plane for governed agent execution" description="ForgeGuard separates reasoning, context, tool capability, approval authority, and evidence so each boundary can be evaluated independently." />
    <section className="surface overflow-hidden"><div className="border-b border-line/70 p-5"><SectionTitle icon={<Network size={18} className="text-electric" />} title="Architecture and data flow" description="Solid arrows show local service data flow. The dashed edge is the optional connection used only when the local API is running." /></div><div className="overflow-x-auto bg-[#091321] p-4 md:p-7"><MermaidDiagram definition={diagram} /></div></section>
    <section className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">{layers.map(({ icon: Icon, title, text }, index) => <article key={title} className="surface p-5"><div className="flex items-center justify-between"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-electric/[0.08] text-blue-300"><Icon size={17} /></span><span className="font-mono text-[9px] text-slate-700">0{index + 1}</span></div><h2 className="mt-4 text-sm font-semibold text-white">{title}</h2><p className="mt-2 text-xs leading-5 text-slate-500">{text}</p></article>)}</section>
    <div className="mt-6 grid gap-6 lg:grid-cols-2"><section className="surface p-6"><SectionTitle eyebrow="Trust boundaries" title="Crossing a boundary is explicit" /><div className="space-y-4">{[['Browser → API','Only structured demo requests; public experience does not depend on this edge.'],['Harness → Gateway','Signed agent identity, typed tool intent, environment, and correlation ID.'],['Gateway → Adapter','Invocation occurs only after allow or recorded human approval.'],['Control plane → Evidence','Append-oriented records exclude secret values and preserve decision lineage.']].map(([title,text]) => <div key={title} className="border-l border-electric/40 pl-4"><h3 className="text-xs font-semibold text-blue-200">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></div>)}</div></section><section className="surface p-6"><SectionTitle eyebrow="Safety invariants" title="Conditions the design preserves" /><ul className="space-y-3">{['No agent can invoke an adapter directly.','Unregistered tools fail closed.','Production deployment and secret retrieval are unconditionally blocked.','External mutations require an explicit human decision.','The public site works without credentials or a service connection.','Audit records capture decisions without capturing secrets.'].map((item) => <li key={item} className="flex gap-3 text-xs leading-5 text-slate-400"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-400" />{item}</li>)}</ul></section></div>
  </div>
}

