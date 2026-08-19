import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ApprovalPage } from './pages/ApprovalPage'
import { ArchitecturePage } from './pages/ArchitecturePage'
import { ChangesPage } from './pages/ChangesPage'
import { DocsPage } from './pages/DocsPage'
import { GovernancePage } from './pages/GovernancePage'
import { LandingPage } from './pages/LandingPage'
import { TicketPage } from './pages/TicketPage'
import { WorkflowPage } from './pages/WorkflowPage'

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppShell />}>
        <Route path="/workflow" element={<WorkflowPage />} />
        <Route path="/ticket" element={<TicketPage />} />
        <Route path="/changes" element={<ChangesPage />} />
        <Route path="/governance" element={<GovernancePage />} />
        <Route path="/approval" element={<ApprovalPage />} />
        <Route path="/architecture" element={<ArchitecturePage />} />
        <Route path="/docs" element={<DocsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

