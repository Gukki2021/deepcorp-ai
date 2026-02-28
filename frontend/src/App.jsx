import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import { researchCompany } from './research'
import './App.css'

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
      const data = await researchCompany(q, null, null)
      setReport(data)
      setPage('report')
    } catch (err) {
      setError(err.message || 'Research failed')
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
