import type { LucideIcon } from 'lucide-react'

export type Decision = 'allowed' | 'approval_required' | 'blocked'
export type StepStatus = 'completed' | 'approval' | 'pending'
export type RiskLevel = 'Low' | 'Medium' | 'High'
export type TicketSource = 'reference' | 'catalog' | 'custom'

export interface EngineeringTicket {
  key: string
  title: string
  description: string
  risk: RiskLevel
  service: string
  owner: string
  acceptance: string[]
  source: TicketSource
}

export interface AgentStep {
  id: string
  name: string
  role: string
  icon: LucideIcon
  accent: 'blue' | 'teal' | 'violet' | 'amber'
  status: StepStatus
  elapsed: string
  input: string
  reasoning: string
  outputs: string[]
  tool: string
  decision: Decision
  decisionReason: string
}

export interface PolicyEvent {
  id: string
  time: string
  agent: string
  role: string
  tool: string
  arguments: string
  result: Decision
  reason: string
  approval: string
}
