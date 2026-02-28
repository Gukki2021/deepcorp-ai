import { useState, useEffect } from 'react'

const STEPS = [
  { icon: '🌐', label: 'Searching the web for latest data...', tag: 'Web Search' },
  { icon: '📰', label: 'Reading financial reports & news...', tag: 'Claude AI' },
  { icon: '📊', label: 'Analyzing market position & competitors...', tag: 'Claude AI' },
  { icon: '📝', label: 'Generating investment report...', tag: 'Claude AI' },
]

export default function LoadingPage({ query }) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActive(i + 1), (i + 1) * 3500)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="loading-page">
      <p className="loading-eyebrow">Researching</p>
      <h2 className="loading-title">
        Analyzing <span>"{query}"</span>
      </h2>

      <div className="step-list">
        {STEPS.map((s, i) => (
          <div
            key={i}
            className={`step-row ${i < active ? 'done' : ''} ${i === active ? 'active' : ''}`}
          >
            <span className="step-icon">{s.icon}</span>
            <span className="step-label">{s.label}</span>
            <span className="step-tag">{s.tag}</span>
            {i < active ? (
              <span className="check">✓</span>
            ) : i === active ? (
              <span className="dot-spinner" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
