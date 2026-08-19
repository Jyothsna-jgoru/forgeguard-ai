import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { WorkflowPage } from '../pages/WorkflowPage'

describe('Workflow explorer', () => {
  it('shows complete seeded workflow evidence', () => {
    render(<MemoryRouter><WorkflowPage /></MemoryRouter>)
    expect(screen.getByRole('heading', { name: 'Multi-agent workflow explorer' })).toBeInTheDocument()
    expect(screen.getByText('12 passed')).toBeInTheDocument()
    expect(screen.getAllByText('github.create_draft_pr').length).toBeGreaterThan(0)
  })

  it('restarts the timeline when replay is selected', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><WorkflowPage /></MemoryRouter>)
    await user.click(screen.getByRole('button', { name: /Replay/i }))
    expect(screen.getByText('1 stages complete')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Advance one stage/i })).toBeInTheDocument()
  })
})
