import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { App } from '../App'

function renderRoute(route: string) {
  return render(<MemoryRouter initialEntries={[route]}><App /></MemoryRouter>)
}

describe('ForgeGuard application routes', () => {
  it('renders the portfolio landing page', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { name: /Secure AI orchestration for software delivery/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Choose a Demo Ticket/i })).toHaveAttribute('href', '/intake')
  })

  it('renders the seeded ticket independently of an API', () => {
    renderRoute('/ticket')
    expect(screen.getByText('PAY-1842')).toBeInTheDocument()
    expect(screen.getByText(/Prevent duplicate payment processing/i)).toBeInTheDocument()
    expect(screen.getByText('RAG-retrieved engineering context')).toBeInTheDocument()
  })

  it('renders the local ticket intake route', () => {
    renderRoute('/intake')
    expect(screen.getByRole('heading', { name: 'Choose a demo ticket—or create your own' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Ready-made demo tickets' })).toBeInTheDocument()
    expect(screen.getByText(/Custom tickets are optional and browser-only/i)).toBeInTheDocument()
  })

  it('redirects unknown routes to the landing page', () => {
    renderRoute('/not-a-page')
    expect(screen.getByRole('heading', { name: /Secure AI orchestration/i })).toBeInTheDocument()
  })
})
