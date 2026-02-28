import { useState } from 'react'

export default function ApiKeyPage({ onKeySet }) {
  const [key, setKey] = useState('')
  const [err, setErr] = useState('')

  const handleSubmit = () => {
    const trimmed = key.trim()
    if (!trimmed.startsWith('sk-ant-')) {
      setErr('API key should start with sk-ant-')
      return
    }
    onKeySet(trimmed)
  }

  return (
    <div className="search-page">
      <div className="search-logo">🔑</div>
      <h1 className="search-title" style={{ fontSize: '1.75rem' }}>Enter Claude API Key</h1>
      <p className="search-subtitle">
        Your key is stored in your browser only — never sent to any server.
        Get a free key at{' '}
        <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
          console.anthropic.com
        </a>
      </p>

      <div className="search-input-wrap">
        <input
          type="password"
          placeholder="sk-ant-..."
          value={key}
          autoFocus
          onChange={(e) => { setKey(e.target.value); setErr('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="search-btn" onClick={handleSubmit}>
          Save &amp; Continue →
        </button>
        {err && <div className="search-error">{err}</div>}
      </div>

      <div className="search-footer" style={{ marginTop: '2rem' }}>
        <span>🔒 Stored in localStorage only</span>
        <span>·</span>
        <span>Never leaves your browser</span>
      </div>
    </div>
  )
}
