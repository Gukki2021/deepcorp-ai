export default function ReportPage({ data: d, onBack }) {
  const score = d.investmentScore || 0
  const verdict = (d.investmentVerdict || '').toUpperCase()
  const calloutClass =
    verdict.includes('STRONG BUY') || verdict.includes('BUY')
      ? 'buy'
      : verdict.includes('HOLD')
      ? 'hold'
      : verdict.includes('MODERATE')
      ? 'moderate'
      : 'sell'

  return (
    <div className="report-page">
      {/* Top bar */}
      <div className="report-topbar">
        <div className="topbar-left">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <span className="topbar-sep">/</span>
          <span className="topbar-current">{d.name}</span>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="topbar-brand">DeepCorp AI</span>
          <button className="export-btn" onClick={() => window.print()}>Export PDF</button>
        </div>
      </div>

      <div className="report-content">
        {/* Company header */}
        <div className="company-header">
          <div className="company-icon">{d.logo || '🏢'}</div>
          <h1 className="company-name">{d.name}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            <span className="tag tag-gray">{d.ticker}</span>
            <span className="tag tag-gray">{d.industry}</span>
          </div>
          {d.summary && <p className="company-summary">{d.summary}</p>}
        </div>

        {/* Properties */}
        <div className="props-section">
          <p className="section-label">Properties</p>
          <div className="props-grid">
            {[
              ['Founded', d.founded],
              ['HQ', d.hq],
              ['Employees', d.employees],
              ['Website', d.website],
              ['Market Cap', d.capitalBackground?.currentMarketCap],
              ['IPO / Status', d.capitalBackground?.ipoDate],
            ].map(([k, v]) =>
              v ? (
                <div className="prop-row" key={k}>
                  <span className="prop-key">{k}</span>
                  <span className="prop-val">{v}</span>
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Investment Score */}
        <div className={`score-callout ${calloutClass}`}>
          <div className="score-number-big">{score}</div>
          <div className="score-meta">
            <div className="score-verdict">{verdict}</div>
            <div className="score-recommendation">
              {d.stockInsights?.recommendation}
            </div>
          </div>
        </div>

        {/* Stock Metrics */}
        {d.stockInsights && (
          <div className="report-section">
            <h2 className="section-title">📈 Stock Metrics</h2>
            <div className="stock-grid">
              {[
                ['Price', d.stockInsights.currentPrice],
                ['52-Week Range', d.stockInsights.fiftyTwoWeekRange],
                ['P/E Ratio', d.stockInsights.peRatio],
                ['Analyst Target', d.stockInsights.analystTarget],
              ].map(([label, val]) => (
                <div className="stock-cell" key={label}>
                  <div className="stock-cell-label">{label}</div>
                  <div className="stock-cell-value">{val || '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market Analysis */}
        {d.marketAnalysis && (
          <div className="report-section">
            <h2 className="section-title">🏪 Market Analysis</h2>
            <table className="data-table">
              <tbody>
                {[
                  ['Market Size', d.marketAnalysis.marketSize],
                  ['Market Share', d.marketAnalysis.marketShare],
                  ['Recent Growth', d.marketAnalysis.growth],
                  ['Competitive Moat', d.marketAnalysis.moat],
                ].map(([k, v]) =>
                  v ? (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ) : null
                )}
                {d.marketAnalysis.competitors?.length > 0 && (
                  <tr>
                    <td>Competitors</td>
                    <td>
                      <div className="tags-wrap">
                        {d.marketAnalysis.competitors.map((c) => (
                          <span key={c} className="tag tag-red">{c}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Capital Background */}
        {d.capitalBackground && (
          <div className="report-section">
            <h2 className="section-title">💰 Capital Background</h2>
            <table className="data-table">
              <tbody>
                {[
                  ['Total Funding', d.capitalBackground.totalFunding],
                  ['IPO / Status', d.capitalBackground.ipoDate],
                  ['Market Cap', d.capitalBackground.currentMarketCap],
                  ['Recent Activity', d.capitalBackground.recentRounds],
                ].map(([k, v]) =>
                  v ? (
                    <tr key={k}>
                      <td>{k}</td>
                      <td>{v}</td>
                    </tr>
                  ) : null
                )}
                {d.capitalBackground.majorInvestors?.length > 0 && (
                  <tr>
                    <td>Major Investors</td>
                    <td>
                      <div className="tags-wrap">
                        {d.capitalBackground.majorInvestors.map((inv) => (
                          <span key={inv} className="tag tag-blue">{inv}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Strengths & Risks */}
        <div className="two-col">
          <div className="col-card">
            <div className="col-card-header">Key Strengths</div>
            <div className="col-card-body">
              <ul className="bullet-list strengths">
                {(d.keyStrengths || []).map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </div>
          <div className="col-card">
            <div className="col-card-header">Key Risks</div>
            <div className="col-card-body">
              <ul className="bullet-list risks">
                {(d.keyRisks || []).map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="ai-callout">
          <p className="ai-callout-header">AI Investment Recommendation</p>
          <p className="ai-callout-text">{d.stockInsights?.recommendation}</p>
        </div>

        {/* Footer */}
        <div className="report-footer">
          <span>Generated by DeepCorp AI · {new Date().toLocaleDateString()}</span>
          {d.dataSources?.length > 0 && (
            <div className="sources-list">
              {d.dataSources.map((src) => (
                <a
                  key={src}
                  className="source-link"
                  href={src.startsWith('http') ? src : `https://${src}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {src}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
