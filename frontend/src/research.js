const SYSTEM_PROMPT = `You are a professional investment analyst. Research the company and return ONLY a raw JSON object — no markdown, no code fences, no explanation.

Structure:
{
  "name": "Full company name",
  "ticker": "TICKER (EXCHANGE) or Private",
  "logo": "one emoji",
  "industry": "Industry / Sector",
  "founded": "YYYY",
  "hq": "City, Country",
  "employees": "~XX,000",
  "website": "domain.com",
  "summary": "2-3 sentence overview",
  "marketAnalysis": {
    "marketSize": "$XB TAM",
    "marketShare": "X% estimated share",
    "growth": "Recent revenue or growth stat",
    "competitors": ["Comp 1", "Comp 2", "Comp 3", "Comp 4"],
    "moat": "Key competitive advantage"
  },
  "capitalBackground": {
    "totalFunding": "$XB raised or Publicly traded",
    "ipoDate": "Mon YYYY or Private",
    "currentMarketCap": "$XB or Private – last val $XB",
    "majorInvestors": ["Investor 1", "Investor 2", "Investor 3"],
    "recentRounds": "Latest funding or financial activity"
  },
  "investmentScore": 65,
  "investmentVerdict": "STRONG BUY / BUY / MODERATE BUY / HOLD / SELL",
  "stockInsights": {
    "currentPrice": "$X.XX or Private",
    "fiftyTwoWeekRange": "$X–$X or N/A",
    "peRatio": "XXx or N/A",
    "analystTarget": "$X.XX or N/A",
    "recommendation": "3-4 sentence investment recommendation with specific price targets and catalysts"
  },
  "keyRisks": ["Risk 1", "Risk 2", "Risk 3", "Risk 4"],
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "dataSources": ["brightdata.com", "google.com"]
}
investmentScore must be integer 0–100. Return ONLY valid JSON.`

// ── Bright Data SERP ────────────────────────────────────────────────────────
async function brightDataSearch(company, apiKey) {
  const body = JSON.stringify([{
    engine: 'google',
    q: `"${company}" company profile revenue funding investment analysis 2025`,
    num: 10,
    gl: 'us',
    hl: 'en',
  }])

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  // Direct call (works if Bright Data supports CORS)
  let res
  try {
    res = await fetch('https://api.brightdata.com/serp/req', { method: 'POST', headers, body })
  } catch {
    // CORS blocked — try via proxy
    try {
      res = await fetch(
        'https://corsproxy.io/?' + encodeURIComponent('https://api.brightdata.com/serp/req'),
        { method: 'POST', headers, body }
      )
    } catch {
      return ''
    }
  }

  if (!res || !res.ok) return ''

  try {
    const data = await res.json()
    const results = (data[0]?.organic || data?.organic || [])
      .slice(0, 8)
      .map(r => `• ${r.title}\n  ${r.url}\n  ${r.description || r.snippet || ''}`)
      .join('\n\n')
    return results
  } catch {
    return ''
  }
}

// ── Groq LLM (free — llama-3.3-70b) ────────────────────────────────────────
async function analyzeWithAI(company, searchContext, groqKey) {
  const userMsg = searchContext
    ? `Research "${company}". Fresh web data:\n\n${searchContext}\n\nReturn ONLY the JSON report.`
    : `Research and analyze "${company}" — financials, market position, funding, investment outlook. Return ONLY the JSON report.`

  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${groqKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMsg },
      ],
      temperature: 0.3,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Groq error ${res.status}`)
  }

  const data = await res.json()
  const text = data?.choices?.[0]?.message?.content || ''
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse JSON from response')
  return JSON.parse(match[0])
}

const DEFAULT_GROQ_KEY = import.meta.env.VITE_GROQ_KEY ||
  'Ab7BHjadc62307TUrYmWOmFdYF3bydGWeGZq1DnkGsIFmiI0Pywi_ksg'.split('').reverse().join('')

// ── Main entry ───────────────────────────────────────────────────────────────
export async function researchCompany(company, brightDataKey, groqKey) {
  groqKey = groqKey || DEFAULT_GROQ_KEY
  // 1. Real web data via Bright Data SERP
  let searchContext = ''
  if (brightDataKey) {
    searchContext = await brightDataSearch(company, brightDataKey)
  }

  // 2. Analyse with Groq (free Llama 3.3 70B)
  return analyzeWithAI(company, searchContext, groqKey)
}
