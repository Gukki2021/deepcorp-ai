import { useState } from 'react'

export default function SearchPage({ onSearch }) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) onSearch(query.trim())
  }

  return (
    <div className="search-page">
      <div className="search-logo">🔍</div>
      <h1 className="search-title">DeepCorp AI</h1>
      <p className="search-subtitle">
        AI-powered company intelligence. Enter any company name and our agents
        will research, analyze, and generate a one-page investment report.
      </p>

      <form className="search-box" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter company name (e.g. Grab, Tesla, Apple...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <button type="submit">Analyze</button>
      </form>

      <div className="search-hints">
        <span className="hint-chip" onClick={() => { setQuery('Grab Holdings'); onSearch('Grab Holdings') }}>Grab Holdings</span>
        <span className="hint-chip" onClick={() => { setQuery('Tesla'); onSearch('Tesla') }}>Tesla</span>
      </div>

      <div className="search-badge">
        <span>🌐 Bright Data Scraping</span>
        <span>🤖 ActionBook Automation</span>
        <span>🧠 Acontext Workflows</span>
        <span>✨ Claude AI Analysis</span>
      </div>
    </div>
  )
}
