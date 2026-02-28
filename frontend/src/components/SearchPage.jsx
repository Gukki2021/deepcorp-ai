import { useState } from 'react'

const EXAMPLES = ['Grab Holdings', 'Tesla', 'OpenAI', 'ByteDance', 'Stripe']

export default function SearchPage({ onSearch, error }) {
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
        Enter any company name. Our AI agents search the web and generate a real-time investment intelligence report.
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
        <span>Real-time Data</span>
      </div>
    </div>
  )
}
