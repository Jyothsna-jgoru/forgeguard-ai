import { createContext } from 'react'
import type { EngineeringTicket } from '../types'

export type DemoState = {
  approved: boolean
  ticket: EngineeringTicket
  isCustomTicket: boolean
  approve: () => void
  resetApproval: () => void
  submitTicket: (ticket: EngineeringTicket) => void
  resetTicket: () => void
}

export const DemoStateContext = createContext<DemoState | undefined>(undefined)
