import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE || ''

function App() {
  const [page, setPage] = useState('search')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const handleSearch = async (q) => {
    setQuery(q)
    setError(null)
    setPage('loading')
    try {
      const res = await fetch(`${API_BASE}/api/research?company=${encodeURIComponent(q)}`)
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      const data = await res.json()
      setReport(data)
      setPage('report')
    } catch (err) {
      setError(err.message)
      setPage('search')
    }
  }

  return (
    <div>
      {page === 'search' && <SearchPage onSearch={handleSearch} error={error} />}
      {page === 'loading' && <LoadingPage query={query} />}
      {page === 'report' && <ReportPage data={report} onBack={() => setPage('search')} />}
    </div>
  )
}

export default App
