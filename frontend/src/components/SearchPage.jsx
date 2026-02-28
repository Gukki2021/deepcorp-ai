import { useState } from 'react'

const EXAMPLES = ['Grab Holdings', 'Tesla', 'OpenAI', 'ByteDance', 'Stripe', 'Palantir']

export default function SearchPage({ onSearch, error, onChangeKey }) {
  const [query, setQuery] = useState('')

  const submit = (q) => {
    const v = (q || query).trim()
    if (v) onSearch(v)
  }

  return (
    <div className="search-page">
      <div className="search-logo">🔍</div>
      <h1 className="search-title">DeepCorp AI</h1>
      <p className="search-subtitle">
        AI-powered company intelligence. Real-time research &amp; investment analysis on any company.
      </p>

      <div className="search-input-wrap">
        <input
          type="text"
          placeholder="Company name or URL — e.g. Tesla, Grab, OpenAI..."
          value={query}
          autoFocus
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
        />
        <button className="search-btn" onClick={() => submit()}>
          Generate Intelligence Report →
        </button>
        {error && <div className="search-error">⚠ {error}</div>}
      </div>

      <div className="search-hints">
        {EXAMPLES.map((ex) => (
          <span key={ex} className="hint-chip" onClick={() => submit(ex)}>
            {ex}
          </span>
        ))}
      </div>

      <div className="search-footer">
        <span>Powered by Claude AI</span>
        <span>·</span>
        <span>Web Search</span>
        <span>·</span>
        <button
          onClick={onChangeKey}
          style={{ background: 'none', border: 'none', color: 'var(--text-lighter)', fontSize: '0.75rem', cursor: 'pointer', padding: 0 }}
        >
          Change API Key
        </button>
      </div>
    </div>
  )
}
