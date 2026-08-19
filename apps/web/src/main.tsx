import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App'
import './styles.css'

const query = window.location.search
if (query.startsWith('?/')) {
  const decoded = query.slice(2).split('&').map((value) => value.replace(/~and~/g, '&')).join('?')
  window.history.replaceState(null, '', `${import.meta.env.BASE_URL}${decoded}${window.location.hash}`)
}

const basename = import.meta.env.BASE_URL === '/' ? undefined : import.meta.env.BASE_URL.replace(/\/$/, '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)

