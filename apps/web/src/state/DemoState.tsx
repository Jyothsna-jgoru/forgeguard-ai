import { useMemo, useState, type ReactNode } from 'react'
import { DemoStateContext, type DemoState } from './DemoStateContext'

const APPROVAL_STORAGE_KEY = 'forgeguard.demo.approval.v1'

function readStoredApproval(): boolean {
  try {
    return window.localStorage.getItem(APPROVAL_STORAGE_KEY) === 'approved'
  } catch {
    return false
  }
}

export function DemoStateProvider({ children }: { children: ReactNode }) {
  const [approved, setApproved] = useState(readStoredApproval)

  const value = useMemo<DemoState>(() => ({
    approved,
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
  }), [approved])

  return <DemoStateContext.Provider value={value}>{children}</DemoStateContext.Provider>
}
