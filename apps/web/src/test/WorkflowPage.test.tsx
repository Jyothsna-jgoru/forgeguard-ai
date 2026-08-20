import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { WorkflowPage } from '../pages/WorkflowPage'
import { DemoStateProvider } from '../state/DemoState'

function renderWorkflow() {
  return render(<MemoryRouter><DemoStateProvider><WorkflowPage /></DemoStateProvider></MemoryRouter>)
}

describe('Workflow explorer', () => {
  it('shows complete seeded workflow evidence', () => {
    renderWorkflow()
    expect(screen.getByRole('heading', { name: 'Multi-agent workflow explorer' })).toBeInTheDocument()
    expect(screen.getByText('12 passed')).toBeInTheDocument()
    expect(screen.getAllByText('github.create_draft_pr').length).toBeGreaterThan(0)
  })

  it('resets approval and pauses at the first stage when replay is selected', async () => {
    const user = userEvent.setup()
    window.localStorage.setItem('forgeguard.demo.approval.v1', 'approved')
    renderWorkflow()

    expect(screen.getByText('Draft PR approved')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Replay/i }))

    expect(screen.getByText('Awaiting approval')).toBeInTheDocument()
    expect(screen.getByText('1 stages complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start replay/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Advance one stage/i })).toBeInTheDocument()
    expect(window.localStorage.getItem('forgeguard.demo.approval.v1')).toBeNull()
  })

  it('shows the persisted approval outcome', () => {
    window.localStorage.setItem('forgeguard.demo.approval.v1', 'approved')
    renderWorkflow()
    expect(screen.getByText('Draft PR approved')).toBeInTheDocument()
    expect(screen.getByText('7 stages complete')).toBeInTheDocument()
    expect(screen.getByText('Approved')).toBeInTheDocument()
    expect(screen.getByText('Approval satisfied')).toBeInTheDocument()
    expect(screen.queryByText('Approval required')).not.toBeInTheDocument()
  })
})

