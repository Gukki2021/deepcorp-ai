import { useState, useEffect } from 'react'

const STEPS = [
  { icon: '🌐', text: 'Scraping financial databases & news...', tag: 'Bright Data' },
  { icon: '🖥️', text: 'Browsing company website & social media...', tag: 'ActionBook' },
  { icon: '🧠', text: 'Managing agent workflow context...', tag: 'Acontext' },
  { icon: '📊', text: 'Analyzing data & generating report...', tag: 'Claude AI' },
]

export default function LoadingPage({ query }) {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const timers = STEPS.map((_, i) =>
      setTimeout(() => setActiveStep(i + 1), (i + 1) * 900)
    )
    return () => timers.forEach(clearTimeout)
  }, [])

  return (
    <div className="loading-page">
      <h2 className="loading-title">Researching</h2>
      <p className="loading-query">"{query}"</p>

      <div className="agent-steps">
        {STEPS.map((step, i) => (
          <div key={i} className={`agent-step ${i < activeStep ? 'done' : ''} ${i === activeStep ? 'active' : ''}`}>
            <span className="step-icon">{step.icon}</span>
            <span className="step-text">{step.text}</span>
            <span className="step-tag">{step.tag}</span>
            {i < activeStep ? (
              <span className="checkmark">✓</span>
            ) : i === activeStep ? (
              <span className="spinner" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}
