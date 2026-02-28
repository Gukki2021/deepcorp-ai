import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import ApiKeyPage from './components/ApiKeyPage'
import { researchCompany } from './claude'
import './App.css'

function getKey() {
  return localStorage.getItem('anthropic_key') || ''
}

function App() {
  const [page, setPage] = useState(getKey() ? 'search' : 'apikey')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const handleKeySet = (key) => {
    localStorage.setItem('anthropic_key', key)
    setPage('search')
  }

  const handleSearch = async (q) => {
    const key = getKey()
    if (!key) { setPage('apikey'); return }
    setQuery(q)
    setError(null)
    setPage('loading')
    try {
      const data = await researchCompany(q, key)
      setReport(data)
      setPage('report')
    } catch (err) {
      setError(err.message || 'Research failed')
      setPage('search')
    }
  }

  return (
    <div>
      {page === 'apikey' && <ApiKeyPage onKeySet={handleKeySet} />}
      {page === 'search' && (
        <SearchPage
          onSearch={handleSearch}
          error={error}
          onChangeKey={() => setPage('apikey')}
        />
      )}
      {page === 'loading' && <LoadingPage query={query} />}
      {page === 'report' && (
        <ReportPage data={report} onBack={() => setPage('search')} />
      )}
    </div>
  )
}

export default App
