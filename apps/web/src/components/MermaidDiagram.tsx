import { useEffect, useId, useState } from 'react'

export function MermaidDiagram({ definition }: { definition: string }) {
  const reactId = useId().replace(/:/g, '')
  const [svg, setSvg] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    const renderDiagram = async () => {
      const mermaid = (await import('mermaid')).default
      mermaid.initialize({ startOnLoad: false, theme: 'base', securityLevel: 'strict', themeVariables: {
        background: '#0d1829', primaryColor: '#12223a', primaryTextColor: '#dbeafe', primaryBorderColor: '#38557d', lineColor: '#5b8cff', secondaryColor: '#0e2a32', tertiaryColor: '#1e1838', fontFamily: 'Inter, sans-serif', fontSize: '13px',
      } })
      const { svg: rendered } = await mermaid.render(`diagram-${reactId}`, definition)
      if (active) setSvg(rendered)
    }
    renderDiagram().catch(() => { if (active) setError(true) })
    return () => { active = false }
  }, [definition, reactId])

  if (error) return <div className="p-8 text-center text-sm text-slate-500">Architecture diagram could not be rendered.</div>
  if (!svg) return <div className="flex h-96 items-center justify-center"><span className="loading-ring" aria-label="Loading architecture diagram" /></div>
  return <div className="mermaid-wrap" role="img" aria-label="ForgeGuard system architecture" dangerouslySetInnerHTML={{ __html: svg }} />
}
