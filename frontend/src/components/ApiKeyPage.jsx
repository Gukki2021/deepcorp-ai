import { useState } from 'react'

export default function ApiKeyPage({ onKeySet }) {
  const [key, setKey] = useState(localStorage.getItem('bd_key') || '')
  const [err, setErr] = useState('')

  const handleSubmit = () => {
    const k = key.trim()
    if (!k) { setErr('Please enter your Bright Data API token'); return }
    onKeySet(k)
  }

  return (
    <div className="search-page">
      <div className="search-logo">🌐</div>
      <h1 className="search-title" style={{ fontSize: '1.75rem' }}>Connect Bright Data</h1>
      <p className="search-subtitle">
        Enter your Bright Data API token to enable real-time web scraping.
        Your key is stored in your browser only.
      </p>

      <div className="search-input-wrap">
        <input
          type="password"
          placeholder="Bright Data API Token..."
          value={key}
          autoFocus
          onChange={(e) => { setKey(e.target.value); setErr('') }}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="search-btn" onClick={handleSubmit}>
          Connect &amp; Start →
        </button>
        {err && <div className="search-error">{err}</div>}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        maxWidth: '560px',
        width: '100%',
      }}>
        <p style={{ fontSize: '0.6875rem', fontWeight: 600, color: 'var(--text-lighter)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
          Where to find your token
        </p>
        <ol style={{ paddingLeft: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {[
            'Login to brightdata.com',
            'Go to Account Settings → API Token',
            'Copy the token and paste above',
          ].map((s, i) => (
            <li key={i} style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{s}</li>
          ))}
        </ol>
      </div>

      <div style={{
        marginTop: '1rem',
        padding: '0.75rem 1rem',
        background: 'var(--accent-bg)',
        border: '1px solid rgba(35,131,226,0.2)',
        borderRadius: '6px',
        maxWidth: '560px',
        width: '100%',
        fontSize: '0.8125rem',
        color: 'var(--accent)',
      }}>
        🤖 AI analysis powered by <strong>Pollinations AI</strong> — completely free, no extra key needed
      </div>

      <div className="search-footer" style={{ marginTop: '1.5rem' }}>
        <span>🔒 Token stored locally</span>
        <span>·</span>
        <span>Never sent to any third-party server</span>
      </div>
    </div>
  )
}
