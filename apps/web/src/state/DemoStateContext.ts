import { createContext } from 'react'

export type DemoState = {
  approved: boolean
  approve: () => void
  resetApproval: () => void
}

export const DemoStateContext = createContext<DemoState | undefined>(undefined)
