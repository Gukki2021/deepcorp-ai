import { GoogleGenerativeAI } from '@google/generative-ai'

const SYSTEM_PROMPT = `You are a professional investment analyst. Based on the company research provided, return ONLY a raw JSON object with this exact structure (no markdown, no code fences):

{
  "name": "Full official company name",
  "ticker": "TICKER (EXCHANGE) or Private",
  "logo": "one relevant emoji",
  "industry": "Industry / Sector",
  "founded": "YYYY",
  "hq": "City, Country",
  "employees": "~XX,000",
  "website": "domain.com",
  "summary": "2-3 sentence company overview",
  "marketAnalysis": {
    "marketSize": "$XB total addressable market",
    "marketShare": "estimated % share",
    "growth": "Recent revenue or growth figure",
    "competitors": ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4"],
    "moat": "Key competitive advantage in 1-2 sentences"
  },
  "capitalBackground": {
    "totalFunding": "$XB raised or Publicly traded",
    "ipoDate": "Mon YYYY (EXCHANGE) or Private",
    "currentMarketCap": "$XB or Private – last val $XB",
    "majorInvestors": ["Investor 1", "Investor 2", "Investor 3"],
    "recentRounds": "Most recent funding or financial activity"
  },
  "investmentScore": 65,
  "investmentVerdict": "STRONG BUY / BUY / MODERATE BUY / HOLD / SELL",
  "stockInsights": {
    "currentPrice": "$X.XX or Private",
    "fiftyTwoWeekRange": "$X–$X or N/A",
    "peRatio": "XXx or N/A",
    "analystTarget": "$X.XX or N/A",
    "recommendation": "3-4 sentence investment recommendation with specific reasoning, price targets if public, key catalysts"
  },
  "keyRisks": ["Risk 1", "Risk 2", "Risk 3", "Risk 4"],
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "dataSources": ["source1.com", "source2.com", "source3.com"]
}

investmentScore must be integer 0–100. Return ONLY the JSON.`

// --- Bright Data SERP ---
async function searchWithBrightData(company, bdKey) {
  try {
    const res = await fetch('https://api.brightdata.com/serp/req', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${bdKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{
        engine: 'google',
        q: `"${company}" company profile revenue funding investment analysis 2025`,
        num: 10,
        gl: 'us',
        hl: 'en',
      }]),
    })
    if (!res.ok) return null
    const data = await res.json()
    // Extract organic results
    const results = (data[0]?.organic || data?.organic || [])
      .slice(0, 8)
      .map(r => `Title: ${r.title}\nURL: ${r.url}\nSnippet: ${r.description || r.snippet || ''}`)
      .join('\n\n')
    return results || null
  } catch {
    return null
  }
}

// --- Gemini with Google Search grounding ---
export async function researchCompany(company, geminiKey, brightDataKey) {
  const genAI = new GoogleGenerativeAI(geminiKey)

  // Try Bright Data first for fresh web data
  let brightDataContext = ''
  if (brightDataKey) {
    const results = await searchWithBrightData(company, brightDataKey)
    if (results) {
      brightDataContext = `\n\nFresh web search results from Bright Data:\n${results}\n`
    }
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `${SYSTEM_PROMPT}

Research and analyze this company: "${company}"
${brightDataContext}
Use Google Search to find the most current information about their financials, market position, funding, and investment outlook. Return ONLY the JSON object.`

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    tools: [{ googleSearch: {} }],
  })

  const text = result.response.text()
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Could not parse response as JSON')
  return JSON.parse(match[0])
}
