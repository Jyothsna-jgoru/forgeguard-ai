import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('Custom ticket intake', () => {
  it('validates required ticket context', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/intake']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /Run secure workflow/i }))

    expect(screen.getByText(/Enter a clear summary/i)).toBeInTheDocument()
    expect(screen.getByText(/Add at least one measurable acceptance criterion/i)).toBeInTheDocument()
  })

  it('creates a local custom scenario and opens its workflow', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/intake']}><App /></MemoryRouter>)

    await user.type(screen.getByLabelText('Ticket summary'), 'Add rate limiting to account recovery')
    await user.type(screen.getByLabelText('Problem and intended behavior'), 'Limit repeated recovery attempts and return a stable response after the threshold is reached.')
    await user.type(screen.getByLabelText('Service or application'), 'identity service')
    await user.type(screen.getByLabelText('Acceptance criteria'), 'Return HTTP 429 after five attempts.\nInclude a Retry-After header.')
    await user.click(screen.getByRole('button', { name: /Run secure workflow/i }))

    expect(screen.getByText('Custom ticket · Deterministic demo run')).toBeInTheDocument()
    expect(screen.getByText('Add rate limiting to account recovery.')).toBeInTheDocument()
    expect(screen.getByText('2 mapped')).toBeInTheDocument()
    expect(window.localStorage.getItem('forgeguard.demo.ticket.v1')).toContain('identity-service')
  })
})
