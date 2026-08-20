import { agentSteps, demoTicket, implementationPlan, prPackage, proposedFiles, ragContext } from './demo'
import type { AgentStep, EngineeringTicket } from '../types'

export function isReferenceTicket(ticket: EngineeringTicket): boolean {
  return ticket.key === demoTicket.key
}

export function createTicketKey(title: string): string {
  const hash = [...title.trim().toLowerCase()].reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 17)
  return `DEMO-${String(1000 + (hash % 9000))}`
}

export function buildImplementationPlan(ticket: EngineeringTicket) {
  if (isReferenceTicket(ticket)) return implementationPlan
  return [
    { title: 'Normalize the request', detail: `Convert ${ticket.key} into bounded requirements, explicit assumptions, and measurable acceptance checks.` },
    { title: 'Map the change surface', detail: `Inspect ${ticket.service} boundaries, dependencies, tests, and repository standards without requesting write access.` },
    { title: 'Propose the implementation', detail: 'Produce a structured, reviewable change plan in a disposable workspace; no external repository is modified.' },
    { title: 'Validate and govern', detail: `Map ${ticket.acceptance.length} acceptance criteria to tests, run policy checks, and stop at the human approval gate.` },
  ]
}

export function buildRagContext(ticket: EngineeringTicket) {
  if (isReferenceTicket(ticket)) return ragContext
  return [
    { source: 'Change Scope Standard §2.1', score: '0.92', text: `Changes to ${ticket.service} must identify affected boundaries, rollback assumptions, and directly mapped validation evidence.` },
    { source: 'Secure Engineering Policy §3.4', score: '0.88', text: 'Ticket text is untrusted input. Tool permissions remain role-scoped, schema-validated, and denied unless explicitly allowed.' },
    { source: 'Review Evidence Guide §5.2', score: '0.84', text: `${ticket.risk}-risk work requires acceptance-criteria coverage and an explicit human decision before any simulated external action.` },
  ]
}

export function buildAgentSteps(ticket: EngineeringTicket): AgentStep[] {
  if (isReferenceTicket(ticket)) return agentSteps
  const criteriaCount = ticket.acceptance.length
  return agentSteps.map((step) => {
    switch (step.id) {
      case 'planner':
        return { ...step, input: `Ticket ${ticket.key}, ${criteriaCount} acceptance criteria, demo repository profile`, reasoning: `The planner decomposed the requested ${ticket.service} change into bounded implementation, validation, and review stages without inferring repository access.`, outputs: ['4-step implementation plan', `${ticket.risk}-risk classification`, 'Human review checkpoint'] }
      case 'analyst':
        return { ...step, reasoning: `The analyst mapped likely ${ticket.service} boundaries and engineering standards. File-level claims remain a proposal because the public demo has no connected repository.`, outputs: ['Service boundary mapped', 'Relevant standards retrieved', 'Repository assumptions identified'] }
      case 'code':
        return { ...step, reasoning: 'The code stage produced a structured change proposal rather than fabricating a repository-specific patch. All proposed artifacts remain local and reviewable.', outputs: ['Reviewable change plan', 'Proposed implementation boundaries', 'No repository mutation'] }
      case 'test':
        return { ...step, input: `Structured proposal and ${criteriaCount} acceptance criteria`, reasoning: 'The validation stage mapped each criterion to deterministic checks and recorded simulated evidence without running untrusted commands.', outputs: [`${criteriaCount} acceptance checks mapped`, 'Safe validation plan generated', 'No network or external services used'] }
      case 'security':
        return { ...step, reasoning: `The policy review treated ticket content as untrusted, preserved least privilege, and classified the scenario as ${ticket.risk.toLowerCase()} risk. Any external action still requires approval.`, outputs: ['Input boundary reviewed', 'Tool scope constrained', 'Approval required for draft PR'] }
      case 'docs':
        return { ...step, reasoning: 'The documentation stage summarized intent, assumptions, validation coverage, and reviewer focus without claiming that real code was changed.', outputs: ['Engineering summary', 'Simulated draft PR description', 'Reviewer checklist'] }
      default:
        return { ...step, input: `Review package for ${ticket.key} and requested simulated external action` }
    }
  })
}

export function buildProposedFiles(ticket: EngineeringTicket) {
  if (isReferenceTicket(ticket)) return proposedFiles
  const service = ticket.service.replace(/[^a-z0-9-]/gi, '-').toLowerCase()
  return [
    { path: `services/${service}/src/request-boundary`, change: 'plan', reason: 'Update the public contract and validate the requested behavior at the system boundary.' },
    { path: `services/${service}/src/domain-behavior`, change: 'plan', reason: 'Keep the core behavior isolated, reviewable, and consistent with the ticket constraints.' },
    { path: `services/${service}/tests/unit`, change: `${ticket.acceptance.length} checks`, reason: 'Map every acceptance criterion to focused deterministic validation.' },
    { path: `docs/changes/${ticket.key.toLowerCase()}.md`, change: 'summary', reason: 'Record assumptions, risks, validation evidence, and reviewer guidance.' },
  ]
}

export function buildPrPackage(ticket: EngineeringTicket) {
  if (isReferenceTicket(ticket)) return prPackage
  const slug = ticket.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 42)
  return {
    title: `proposal(${ticket.service}): ${ticket.title.replace(/[.]$/, '')}`,
    branch: `demo/${ticket.key.toLowerCase()}-${slug}`,
    summary: `Presents a simulated, reviewable change plan for ${ticket.title.replace(/[.]$/, '').toLowerCase()}. The package maps ${ticket.acceptance.length} acceptance criteria to validation evidence and preserves the human approval boundary.`,
    checks: [`${ticket.acceptance.length} acceptance checks mapped`, 'Policy review passed', 'Untrusted input boundary checked', 'Human approval recorded'],
  }
}
