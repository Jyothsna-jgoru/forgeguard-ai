import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

describe('Custom ticket intake', () => {
  it('validates required ticket context', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/intake']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /Run custom workflow/i }))

    expect(screen.getByText(/Enter a clear summary/i)).toBeInTheDocument()
    expect(screen.getByText(/Add at least one measurable acceptance criterion/i)).toBeInTheDocument()
  })

  it('creates a local custom scenario and opens its workflow', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/intake']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: /Fill safe example/i }))
    await user.click(screen.getByRole('button', { name: /Run custom workflow/i }))

    expect(screen.getByText('Custom ticket · Deterministic demo run')).toBeInTheDocument()
    expect(screen.getByText('Add rate limiting to the account-recovery endpoint.')).toBeInTheDocument()
    expect(screen.getByText('4 mapped')).toBeInTheDocument()
    expect(window.localStorage.getItem('forgeguard.demo.ticket.v1')).toContain('identity-service')
  })

  it('runs a ready-made ticket without requiring visitor input', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter initialEntries={['/intake']}><App /></MemoryRouter>)

    await user.click(screen.getByRole('button', { name: 'Run IAM-2317 demo' }))

    expect(screen.getAllByText('IAM-2317')).not.toHaveLength(0)
    expect(screen.getByText(/adaptive rate limiting/i)).toBeInTheDocument()
    expect(screen.getByText('4 mapped')).toBeInTheDocument()
    expect(window.localStorage.getItem('forgeguard.demo.ticket.v1')).toContain('"source":"catalog"')
  })
})
