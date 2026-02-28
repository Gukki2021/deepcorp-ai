import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import ApiKeyPage from './components/ApiKeyPage'
import { researchCompany } from './research'
import './App.css'

const getKeys = () => ({
  gemini: localStorage.getItem('gemini_key') || '',
  brightdata: localStorage.getItem('brightdata_key') || '',
})

function App() {
  const keys = getKeys()
  const [page, setPage] = useState(keys.gemini ? 'search' : 'apikey')
  const [report, setReport] = useState(null)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const handleKeySet = ({ gemini, brightdata }) => {
    localStorage.setItem('gemini_key', gemini)
    if (brightdata) localStorage.setItem('brightdata_key', brightdata)
    setPage('search')
  }

  const handleSearch = async (q) => {
    const { gemini, brightdata } = getKeys()
    if (!gemini) { setPage('apikey'); return }
    setQuery(q)
    setError(null)
    setPage('loading')
    try {
      const data = await researchCompany(q, gemini, brightdata || null)
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
