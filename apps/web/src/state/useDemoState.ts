import { useContext } from 'react'
import { DemoStateContext, type DemoState } from './DemoStateContext'

export function useDemoState(): DemoState {
  const state = useContext(DemoStateContext)
  if (!state) throw new Error('useDemoState must be used inside DemoStateProvider')
  return state
}
