import { useMemo, useState, type ReactNode } from 'react'
import { demoTicket } from '../data/demo'
import type { EngineeringTicket } from '../types'
import { DemoStateContext, type DemoState } from './DemoStateContext'

const APPROVAL_STORAGE_KEY = 'forgeguard.demo.approval.v1'
const TICKET_STORAGE_KEY = 'forgeguard.demo.ticket.v1'

function readStoredApproval(): boolean {
  try {
    return window.localStorage.getItem(APPROVAL_STORAGE_KEY) === 'approved'
  } catch {
    return false
  }
}

function readStoredTicket(): EngineeringTicket {
  try {
    const value: unknown = JSON.parse(window.localStorage.getItem(TICKET_STORAGE_KEY) ?? 'null')
    if (
      value && typeof value === 'object' &&
      'key' in value && typeof value.key === 'string' &&
      'title' in value && typeof value.title === 'string' &&
      'description' in value && typeof value.description === 'string' &&
      'service' in value && typeof value.service === 'string' &&
      'owner' in value && typeof value.owner === 'string' &&
      'risk' in value && ['Low', 'Medium', 'High'].includes(String(value.risk)) &&
      'acceptance' in value && Array.isArray(value.acceptance) && value.acceptance.every((item) => typeof item === 'string')
    ) return value as EngineeringTicket
  } catch {
    // Fall through to the reference ticket when browser storage is unavailable or invalid.
  }
  return demoTicket
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [approved, setApproved] = useState(readStoredApproval)
  const [ticket, setTicket] = useState(readStoredTicket)

  const value = useMemo<DemoState>(() => ({
    approved,
    ticket,
    isCustomTicket: ticket.key !== demoTicket.key,
    approve: () => {
      try {
        window.localStorage.setItem(APPROVAL_STORAGE_KEY, 'approved')
      } catch {
        // The in-memory demo remains interactive if browser storage is unavailable.
      }
      setApproved(true)
    },
    resetApproval: () => {
      try {
        window.localStorage.removeItem(APPROVAL_STORAGE_KEY)
      } catch {
        // Reset the in-memory state even when browser storage is unavailable.
      }
      setApproved(false)
    },
    submitTicket: (nextTicket) => {
      try {
        window.localStorage.setItem(TICKET_STORAGE_KEY, JSON.stringify(nextTicket))
        window.localStorage.removeItem(APPROVAL_STORAGE_KEY)
      } catch {
        // The in-memory scenario remains available if browser storage is unavailable.
      }
      setTicket(nextTicket)
      setApproved(false)
    },
    resetTicket: () => {
      try {
        window.localStorage.removeItem(TICKET_STORAGE_KEY)
        window.localStorage.removeItem(APPROVAL_STORAGE_KEY)
      } catch {
        // Reset the in-memory scenario even when browser storage is unavailable.
      }
      setTicket(demoTicket)
      setApproved(false)
    },
  }), [approved, ticket])

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}
