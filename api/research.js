module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { company } = req.query;
  if (!company || !company.trim()) return res.status(400).json({ error: 'company required' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not configured' });

  try {
    const report = await generateReport(company.trim(), apiKey);
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Research failed' });
  }
};

async function generateReport(company, apiKey) {
  const system = `You are a professional investment analyst. Research the company and return ONLY a raw JSON object — no markdown, no code fences, no explanation. Just the JSON.

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

investmentScore must be an integer 0–100.`;

  const userMsg = `Research and analyze: "${company}". Use web search to get the most current data on financials, market position, recent news, and investment outlook. Return ONLY the JSON object.`;

  const messages = [{ role: 'user', content: userMsg }];
  const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
  const headers = {
    'Content-Type': 'application/json',
    'x-api-key': apiKey,
    'anthropic-version': '2023-06-01',
    'anthropic-beta': 'web-search-2025-03-05',
  };

  for (let i = 0; i < 12; i++) {
    const resp = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 8096,
        system,
        tools: [{ type: 'web_search_20250305', name: 'web_search' }],
        messages,
      }),
    });

    if (!resp.ok) {
      const err = await resp.text();
      throw new Error(`Anthropic API ${resp.status}: ${err}`);
    }

    const data = await resp.json();
    messages.push({ role: 'assistant', content: data.content });

    if (data.stop_reason === 'end_turn') {
      const text = data.content.find((b) => b.type === 'text')?.text || '';
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error('No JSON in response');
      return JSON.parse(match[0]);
    }

    if (data.stop_reason === 'tool_use') {
      const toolResults = data.content
        .filter((b) => b.type === 'tool_use')
        .map((b) => ({
          type: 'tool_result',
          tool_use_id: b.id,
          content:
            b.name === 'web_search'
              ? `Search for "${b.input?.query}" — use your best available knowledge to provide accurate, current information.`
              : JSON.stringify(b.input || {}),
        }));

      if (toolResults.length > 0) {
        messages.push({ role: 'user', content: toolResults });
        continue;
      }
    }

    const text = data.content.find((b) => b.type === 'text')?.text || '';
    if (text) {
      const match = text.match(/\{[\s\S]*\}/);
      if (match) return JSON.parse(match[0]);
    }
    break;
  }

  throw new Error('Failed to generate report after maximum iterations');
}
