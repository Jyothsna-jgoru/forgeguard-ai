import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { ApprovalPage } from '../pages/ApprovalPage'
import { DemoStateProvider } from '../state/DemoState'

describe('Human approval checkpoint', () => {
  it('creates a simulated artifact after explicit approval', async () => {
    const user = userEvent.setup()
    render(<DemoStateProvider><ApprovalPage /></DemoStateProvider>)
    expect(screen.getByText(/performs no GitHub mutation/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Approve Draft PR' }))
    expect(screen.getByRole('heading', { name: /Simulated draft pull request created/i })).toBeInTheDocument()
    expect(window.localStorage.getItem('forgeguard.demo.approval.v1')).toBe('approved')
    expect(screen.getByText('APR-2026-0042')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reset checkpoint/i })).toBeInTheDocument()
  })
})
