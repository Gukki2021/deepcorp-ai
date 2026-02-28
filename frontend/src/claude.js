import Anthropic from '@anthropic-ai/sdk'

const SYSTEM = `You are a professional investment analyst. Research the company and return ONLY a raw JSON object — no markdown, no code fences, no explanation.

Required structure:
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
    "marketSize": "$XB total addressable market",
    "marketShare": "X% share",
    "growth": "Recent revenue/growth stat",
    "competitors": ["Competitor 1", "Competitor 2", "Competitor 3", "Competitor 4"],
    "moat": "Key competitive advantage"
  },
  "capitalBackground": {
    "totalFunding": "$XB raised or Publicly traded",
    "ipoDate": "Mon YYYY or Private",
    "currentMarketCap": "$XB or Private – last val $XB",
    "majorInvestors": ["Investor 1", "Investor 2", "Investor 3"],
    "recentRounds": "Latest funding activity"
  },
  "investmentScore": 65,
  "investmentVerdict": "STRONG BUY / BUY / MODERATE BUY / HOLD / SELL",
  "stockInsights": {
    "currentPrice": "$X.XX or Private",
    "fiftyTwoWeekRange": "$X–$X or N/A",
    "peRatio": "XXx or N/A",
    "analystTarget": "$X.XX or N/A",
    "recommendation": "3-4 sentence investment recommendation with specific reasoning"
  },
  "keyRisks": ["Risk 1", "Risk 2", "Risk 3", "Risk 4"],
  "keyStrengths": ["Strength 1", "Strength 2", "Strength 3", "Strength 4"],
  "dataSources": ["source1.com", "source2.com", "source3.com"]
}

investmentScore must be an integer 0–100.`

export async function researchCompany(company, apiKey) {
  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const messages = [
    {
      role: 'user',
      content: `Research and analyze: "${company}". Use your knowledge of this company's financials, market position, recent funding/stock data, and competitive landscape. Return ONLY the JSON report.`,
    },
  ]

  for (let i = 0; i < 10; i++) {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 8096,
      system: SYSTEM,
      tools: [{ type: 'web_search_20250305', name: 'web_search' }],
      betas: ['web-search-2025-03-05'],
      messages,
    })

    messages.push({ role: 'assistant', content: response.content })

    if (response.stop_reason === 'end_turn') {
      const text = response.content.find((b) => b.type === 'text')?.text || ''
      const match = text.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('Could not parse report JSON')
      return JSON.parse(match[0])
    }

    if (response.stop_reason === 'tool_use') {
      const toolResults = response.content
        .filter((b) => b.type === 'tool_use')
        .map((b) => ({
          type: 'tool_result',
          tool_use_id: b.id,
          content: `Searching for: ${JSON.stringify(b.input)}`,
        }))
      if (toolResults.length > 0) {
        messages.push({ role: 'user', content: toolResults })
        continue
      }
    }

    const text = response.content.find((b) => b.type === 'text')?.text || ''
    if (text) {
      const match = text.match(/\{[\s\S]*\}/)
      if (match) return JSON.parse(match[0])
    }
    break
  }

  throw new Error('Failed to generate report')
}
