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
    expect(screen.getAllByRole('link', { name: /Explore Live Workflow/i })[0]).toHaveAttribute('href', '/workflow')
  })

  it('renders the seeded ticket independently of an API', () => {
    renderRoute('/ticket')
    expect(screen.getByText('PAY-1842')).toBeInTheDocument()
    expect(screen.getByText(/Prevent duplicate payment processing/i)).toBeInTheDocument()
    expect(screen.getByText('RAG-retrieved engineering context')).toBeInTheDocument()
  })

  it('redirects unknown routes to the landing page', () => {
    renderRoute('/not-a-page')
    expect(screen.getByRole('heading', { name: /Secure AI orchestration/i })).toBeInTheDocument()
  })
})
