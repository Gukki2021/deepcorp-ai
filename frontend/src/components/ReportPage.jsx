export default function ReportPage({ data, onBack }) {
  const d = data
  const scoreClass = d.investmentScore >= 70 ? 'high' : d.investmentScore >= 50 ? 'medium' : 'low'
  const verdictClass = d.investmentVerdict.includes('BUY') ? 'buy' : d.investmentVerdict.includes('HOLD') ? 'hold' : 'sell'

  return (
    <div className="report-page">
      {/* Header */}
      <div className="report-header">
        <div className="report-nav">
          <button className="back-btn" onClick={onBack}>← New Search</button>
          <span className="report-brand">DeepCorp AI</span>
        </div>
        <div className="report-actions">
          <button className="action-btn" onClick={() => window.print()}>📄 Export PDF</button>
        </div>
      </div>

      {/* Company Hero */}
      <div className="company-hero">
        <div className="company-logo">{d.logo}</div>
        <div className="company-info">
          <h1>{d.name}</h1>
          <div className="company-meta">
            <span>📈 {d.ticker}</span>
            <span>🏢 {d.industry}</span>
            <span>📍 {d.hq}</span>
            <span>📅 Founded {d.founded}</span>
            <span>👥 {d.employees}</span>
          </div>
          <p className="company-summary">{d.summary}</p>
        </div>
      </div>

      {/* Investment Score */}
      <div className="score-section">
        <div className="score-circle">
          <div className={`score-number ${scoreClass}`}>{d.investmentScore}</div>
          <div className="score-label">Investment Score</div>
          <div className={`verdict ${verdictClass}`}>{d.investmentVerdict}</div>
        </div>
        <div className="score-details">
          <div className="score-row">
            <span className="label">Current Price</span>
            <span className="value">{d.stockInsights.currentPrice}</span>
          </div>
          <div className="score-row">
            <span className="label">52-Week Range</span>
            <span className="value">{d.stockInsights.fiftyTwoWeekRange}</span>
          </div>
          <div className="score-row">
            <span className="label">P/E Ratio</span>
            <span className="value">{d.stockInsights.peRatio}</span>
          </div>
          <div className="score-row">
            <span className="label">Analyst Target</span>
            <span className="value">{d.stockInsights.analystTarget}</span>
          </div>
          <div className="score-row">
            <span className="label">Market Cap</span>
            <span className="value">{d.capitalBackground.currentMarketCap}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="report-grid">
        {/* Market Analysis */}
        <div className="report-card">
          <div className="card-title">📊 Market Analysis</div>
          <div className="card-stat"><span className="label">Market Size</span><span className="value">{d.marketAnalysis.marketSize}</span></div>
          <div className="card-stat"><span className="label">Market Share</span><span className="value">{d.marketAnalysis.marketShare}</span></div>
          <div className="card-stat"><span className="label">Growth</span><span className="value">{d.marketAnalysis.growth}</span></div>
          <div className="card-stat"><span className="label">Moat</span><span className="value" style={{fontSize:'0.8rem',maxWidth:'200px',textAlign:'right'}}>{d.marketAnalysis.moat}</span></div>
          <div style={{marginTop:'0.8rem'}}>
            <div className="card-title" style={{marginBottom:'0.5rem'}}>Competitors</div>
            <div className="competitor-tags">
              {d.marketAnalysis.competitors.map((c, i) => <span key={i} className="competitor-tag">{c}</span>)}
            </div>
          </div>
        </div>

        {/* Capital Background */}
        <div className="report-card">
          <div className="card-title">💰 Capital Background</div>
          <div className="card-stat"><span className="label">Total Funding</span><span className="value">{d.capitalBackground.totalFunding}</span></div>
          <div className="card-stat"><span className="label">IPO</span><span className="value">{d.capitalBackground.ipoDate}</span></div>
          <div className="card-stat"><span className="label">Market Cap</span><span className="value">{d.capitalBackground.currentMarketCap}</span></div>
          <div className="card-stat"><span className="label">Recent Activity</span><span className="value" style={{fontSize:'0.8rem',maxWidth:'200px',textAlign:'right'}}>{d.capitalBackground.recentRounds}</span></div>
          <div style={{marginTop:'0.8rem'}}>
            <div className="card-title" style={{marginBottom:'0.5rem'}}>Major Investors</div>
            <div className="investor-tags">
              {d.capitalBackground.majorInvestors.map((inv, i) => <span key={i} className="investor-tag">{inv}</span>)}
            </div>
          </div>
        </div>

        {/* Key Strengths */}
        <div className="report-card">
          <div className="card-title">💪 Key Strengths</div>
          <ul className="card-list strengths">
            {d.keyStrengths.map((s, i) => <li key={i}>{s}</li>)}
          </ul>
        </div>

        {/* Key Risks */}
        <div className="report-card">
          <div className="card-title">⚠️ Key Risks</div>
          <ul className="card-list risks">
            {d.keyRisks.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
        </div>

        {/* AI Recommendation */}
        <div className="report-card full">
          <div className="card-title">🤖 AI Investment Recommendation</div>
          <div className="recommendation-text">
            {d.stockInsights.recommendation}
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="sources-section">
        <div className="card-title">🔗 Data Sources (Collected by AI Agents)</div>
        <div className="sources-grid">
          {d.dataSources.map((src, i) => (
            <div key={i} className="source-item">
              <span className={`source-badge ${src.type === 'Bright Data' ? 'bright' : 'action'}`}>
                {src.type}
              </span>
              {src.name}
            </div>
          ))}
        </div>
      </div>

      <div className="report-footer">
        Generated by DeepCorp AI — Agent Forge Hackathon 2025<br/>
        Powered by Bright Data · ActionBook · Acontext · Claude AI
      </div>
    </div>
  )
}
