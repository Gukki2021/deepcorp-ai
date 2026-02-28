import { useState } from 'react'

export default function ApiKeyPage({ onKeySet }) {
  const [gemini, setGemini] = useState(localStorage.getItem('gemini_key') || '')
  const [brightdata, setBrightdata] = useState(localStorage.getItem('brightdata_key') || '')
  const [err, setErr] = useState('')

  const handleSubmit = () => {
    const g = gemini.trim()
    if (!g) { setErr('Gemini API key is required'); return }
    onKeySet({ gemini: g, brightdata: brightdata.trim() })
  }

  return (
    <div className="search-page">
      <div className="search-logo">⚙️</div>
      <h1 className="search-title" style={{ fontSize: '1.75rem' }}>API Configuration</h1>
      <p className="search-subtitle">
        Keys are stored in your browser only — never sent to any server.
      </p>

      <div className="search-input-wrap">
        {/* Gemini Key */}
        <div style={{ marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.375rem', fontWeight: 600 }}>
            GEMINI API KEY <span style={{ color: 'var(--red)' }}>*</span>
            <span style={{ fontWeight: 400, marginLeft: '0.5rem' }}>
              — free at{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>
                aistudio.google.com
              </a>
            </span>
          </label>
          <input
            type="password"
            placeholder="AIza..."
            value={gemini}
            autoFocus
            onChange={(e) => { setGemini(e.target.value); setErr('') }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-dark)', borderRadius: '6px', fontSize: '0.9375rem', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
          />
        </div>

        {/* Bright Data Key */}
        <div style={{ marginBottom: '0.75rem' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', marginBottom: '0.375rem', fontWeight: 600 }}>
            BRIGHT DATA API KEY
            <span style={{ fontWeight: 400, color: 'var(--text-lighter)', marginLeft: '0.5rem' }}>
              — optional, for richer real-time web data
            </span>
          </label>
          <input
            type="password"
            placeholder="Bright Data API token..."
            value={brightdata}
            onChange={(e) => setBrightdata(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid var(--border-dark)', borderRadius: '6px', fontSize: '0.9375rem', fontFamily: 'inherit', color: 'var(--text)', background: 'var(--bg)', outline: 'none' }}
          />
        </div>

        <button className="search-btn" onClick={handleSubmit}>
          Save &amp; Start Researching →
        </button>
        {err && <div className="search-error">{err}</div>}
      </div>

      <div style={{ marginTop: '1.5rem', padding: '0.875rem 1rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '6px', maxWidth: '560px', width: '100%' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-lighter)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Data Sources</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>🔍 <strong>Gemini + Google Search</strong> — real-time search grounding (free)</div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-light)' }}>🌐 <strong>Bright Data SERP</strong> — enterprise web scraping layer (optional)</div>
        </div>
      </div>

      <div className="search-footer" style={{ marginTop: '1.5rem' }}>
        <span>🔒 Stored locally only</span>
        <span>·</span>
        <span>Never leaves your browser</span>
      </div>
    </div>
  )
}
