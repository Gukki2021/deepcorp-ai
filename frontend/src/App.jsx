import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import ApiKeyPage from './components/ApiKeyPage'
import { researchCompany } from './research'
import './App.css'

function App() {
  const [page, setPage] = useState(localStorage.getItem('bd_key') ? 'search' : 'apikey')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const handleKeySet = (key) => {
    localStorage.setItem('bd_key', key)
    setPage('search')
  }

  const handleSearch = async (q) => {
    const bdKey = localStorage.getItem('bd_key') || ''
    if (!bdKey) { setPage('apikey'); return }
    setQuery(q)
    setError(null)
    setPage('loading')
    try {
      const data = await researchCompany(q, bdKey)
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
        <SearchPage onSearch={handleSearch} error={error} onChangeKey={() => setPage('apikey')} />
      )}
      {page === 'loading' && <LoadingPage query={query} />}
      {page === 'report' && <ReportPage data={report} onBack={() => setPage('search')} />}
    </div>
  )
}

export default App
