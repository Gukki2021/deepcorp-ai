import { useState } from 'react'
import SearchPage from './components/SearchPage'
import ReportPage from './components/ReportPage'
import LoadingPage from './components/LoadingPage'
import './App.css'

const DEMO_DATA = {
  "Grab Holdings": {
    name: "Grab Holdings Inc.",
    ticker: "GRAB (NASDAQ)",
    logo: "🚗",
    industry: "Technology / Super App",
    founded: "2012",
    hq: "Singapore",
    employees: "~8,900",
    website: "grab.com",
    summary: "Southeast Asia's leading superapp platform offering ride-hailing, food delivery, digital payments, and financial services across 8 countries with 35M+ monthly transacting users.",
    marketAnalysis: {
      marketSize: "$180B+ (SEA digital economy)",
      marketShare: "~55% ride-hailing, ~50% food delivery in SEA",
      growth: "Revenue grew 17% YoY to $2.7B in FY2025",
      competitors: ["GoTo (Gojek+Tokopedia)", "ShopeeFood", "Foodpanda", "Bolt"],
      moat: "Network effects, regulatory licenses across 8 countries, integrated ecosystem"
    },
    capitalBackground: {
      totalFunding: "$14.9B+",
      ipoDate: "Dec 2021 (via SPAC at $40B valuation)",
      currentMarketCap: "$18.2B",
      majorInvestors: ["SoftBank Vision Fund", "Uber", "Toyota", "Microsoft", "GIC (Singapore)"],
      recentRounds: "Post-IPO equity, achieving profitability in Q3 2024"
    },
    investmentScore: 72,
    investmentVerdict: "MODERATE BUY",
    stockInsights: {
      currentPrice: "$5.12",
      fiftyTwoWeekRange: "$3.08 - $5.73",
      peRatio: "N/A (recently profitable)",
      analystTarget: "$5.80",
      recommendation: "Grab achieved its first-ever profitability in 2024. Strong market position in SEA but faces intense competition. Good long-term play on SEA digital growth. Consider accumulating on dips below $4.50."
    },
    keyRisks: [
      "Intense competition from GoTo and regional players",
      "Regulatory risks across multiple Southeast Asian markets",
      "Currency fluctuation exposure (SGD, IDR, MYR, THB, PHP)",
      "Profitability sustainability not yet proven long-term"
    ],
    keyStrengths: [
      "Dominant market position in 8 SEA countries",
      "Superapp ecosystem creates high switching costs",
      "Growing financial services (GrabFin) revenue stream",
      "First-mover advantage in SEA ride-hailing and delivery"
    ],
    dataSources: [
      { name: "Company Filings (SEC/EDGAR)", type: "Bright Data" },
      { name: "grab.com", type: "ActionBook" },
      { name: "World Bank SEA Data", type: "Bright Data" },
      { name: "Financial News", type: "Bright Data" },
      { name: "Analyst Reports", type: "ActionBook" },
      { name: "Social Sentiment", type: "Bright Data" }
    ]
  },
  "Tesla": {
    name: "Tesla, Inc.",
    ticker: "TSLA (NASDAQ)",
    logo: "⚡",
    industry: "Automotive / Clean Energy",
    founded: "2003",
    hq: "Austin, Texas, USA",
    employees: "~140,000",
    website: "tesla.com",
    summary: "World's most valuable automaker and clean energy company, leading the EV revolution with vehicles, energy storage, solar products, and autonomous driving technology.",
    marketAnalysis: {
      marketSize: "$980B+ (Global EV market by 2030)",
      marketShare: "~18% global EV market",
      growth: "Revenue $97B in FY2024, energy segment +67% YoY",
      competitors: ["BYD", "Volkswagen Group", "Hyundai-Kia", "Rivian", "NIO"],
      moat: "Brand, Supercharger network, vertical integration, FSD data advantage"
    },
    capitalBackground: {
      totalFunding: "IPO in 2010 at $17/share",
      ipoDate: "June 2010 (NASDAQ)",
      currentMarketCap: "$1.15T",
      majorInvestors: ["Elon Musk (13%)", "Vanguard", "BlackRock", "State Street"],
      recentRounds: "Self-funded via cash flow"
    },
    investmentScore: 58,
    investmentVerdict: "HOLD",
    stockInsights: {
      currentPrice: "$362",
      fiftyTwoWeekRange: "$138 - $488",
      peRatio: "~120x",
      analystTarget: "$295",
      recommendation: "Trades at significant premium. Prices in AI/robotaxi optionality. Wait for pullback below $280 for better entry."
    },
    keyRisks: [
      "Extremely high valuation (120x P/E)",
      "Rising competition from BYD and Chinese EV makers",
      "Key-man risk: heavy dependence on Elon Musk",
      "FSD regulatory timeline uncertain"
    ],
    keyStrengths: [
      "Leading global EV brand",
      "Supercharger network becoming industry standard",
      "Energy storage business growing rapidly",
      "Autonomous driving data advantage"
    ],
    dataSources: [
      { name: "SEC EDGAR Filings", type: "Bright Data" },
      { name: "tesla.com", type: "ActionBook" },
      { name: "Yahoo Finance", type: "Bright Data" },
      { name: "Reuters / Bloomberg", type: "Bright Data" },
      { name: "Reddit Sentiment", type: "ActionBook" },
      { name: "World Bank Energy Data", type: "Bright Data" }
    ]
  }
}

function App() {
  const [page, setPage] = useState('search')
  const [report, setReport] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (query) => {
    setSearchQuery(query)
    setPage('loading')
    setTimeout(() => {
      const matchKey = Object.keys(DEMO_DATA).find(k =>
        query.toLowerCase().includes(k.toLowerCase()) ||
        k.toLowerCase().includes(query.toLowerCase())
      )
      setReport(matchKey ? DEMO_DATA[matchKey] : DEMO_DATA["Grab Holdings"])
      setPage('report')
    }, 4000)
  }

  return (
    <div className="app">
      {page === 'search' && <SearchPage onSearch={handleSearch} />}
      {page === 'loading' && <LoadingPage query={searchQuery} />}
      {page === 'report' && <ReportPage data={report} onBack={() => setPage('search')} />}
    </div>
  )
}

export default App
