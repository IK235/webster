/**
 * WEBSTER SERVICE
 *
 * Handles:
 * 1. Web scraping - Fetch and parse webpage content
 * 2. Text extraction - Get meaningful content from HTML
 * 3. AI Analysis - Use Groq API to analyze content
 */

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'

/**
 * Fetch and parse webpage content
 * @param {string} url - The webpage URL to scrape
 * @returns {Promise<string>} - Extracted text content
 */
async function scrapeWebpage(url) {
  try {
    // Validate URL format
    try {
      new URL(url)
    } catch (e) {
      throw new Error('Invalid URL format')
    }

    // List of CORS proxies (ordered by speed/reliability)
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`
    ]

    // Fetch with timeout for each proxy
    const fetchWithTimeout = (url, timeout = 8000) => {
      return Promise.race([
        fetch(url, {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Proxy timeout')), timeout)
        )
      ])
    }

    let html = null

    // Try proxies in sequence with timeout (not parallel to save resources)
    for (const proxyUrl of proxies) {
      try {
        console.log(`Fetching from: ${proxyUrl.split('/')[2]}...`)
        const response = await fetchWithTimeout(proxyUrl)

        if (response.ok) {
          html = await response.text()
          if (html && html.length > 10) {
            console.log(`✓ Successfully scraped with: ${proxyUrl.split('/')[2]}`)
            break
          }
        }
      } catch (error) {
        console.log(`✗ Failed (${error.message}): ${proxyUrl.split('/')[2]}`)
        continue
      }
    }

    if (!html || html.length < 10) {
      throw new Error('Failed to scrape webpage. Please try again or check the URL.')
    }

    // Parse HTML and extract text content
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')

    // Remove script and style elements
    const scripts = doc.querySelectorAll('script, style')
    scripts.forEach(script => script.remove())

    // Get text content
    let text = doc.body.textContent
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 3000) // Limit to 3000 chars for analysis

    // Extract metadata
    const title = doc.querySelector('title')?.textContent || ''
    const description = doc.querySelector('meta[name="description"]')?.getAttribute('content') || ''

    return {
      text,
      title,
      description,
      url
    }
  } catch (error) {
    throw new Error(`Scraping failed: ${error.message}`)
  }
}

/**
 * Use Groq API to analyze webpage content
 * @param {string} content - Text content to analyze
 * @returns {Promise<Object>} - Analysis results
 */
async function analyzeWithGroq(content, url, title) {
  try {
    const prompt = `Analyze this content briefly in JSON format only:
{
  "summary": "2-3 sentence overview",
  "keywords": ["max 5 key topics"],
  "sentiment": "positive|negative|neutral|mixed",
  "insights": "main takeaway"
}

Content: ${content}`

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    // Parse JSON from response - try multiple patterns
    let analysis = null

    try {
      // First try: direct JSON.parse (if response is pure JSON)
      analysis = JSON.parse(analysisText)
    } catch (e) {
      // Second try: extract JSON from text
      const jsonMatch = analysisText.match(/\{[\s\S]*?\n\}/m)
      if (jsonMatch) {
        try {
          analysis = JSON.parse(jsonMatch[0])
        } catch (parseErr) {
          // Third try: be more lenient with the regex
          const altMatch = analysisText.match(/\{(.|\n)*\}/m)
          if (altMatch) {
            analysis = JSON.parse(altMatch[0])
          } else {
            throw new Error('Could not extract JSON from response')
          }
        }
      } else {
        throw new Error('No JSON found in response')
      }
    }

    // Validate and sanitize response
    const summary = String(analysis.summary || analysis.Summary || '').substring(0, 500)
    const keywords = Array.isArray(analysis.keywords)
      ? analysis.keywords.slice(0, 5)
      : (String(analysis.keywords || '').split(/[,;]/).map(k => k.trim()).filter(k => k).slice(0, 5))
    const sentiment = String(analysis.sentiment || analysis.Sentiment || 'neutral').toLowerCase()
    const insights = String(analysis.insights || analysis.Insights || '').substring(0, 500)

    return {
      url,
      title,
      summary: summary || 'No summary available',
      keywords: keywords.length > 0 ? keywords : ['analysis', 'content'],
      sentiment: ['positive', 'negative', 'neutral', 'mixed'].includes(sentiment) ? sentiment : 'neutral',
      insights: insights || 'No specific insights available'
    }
  } catch (error) {
    console.error('Analysis error details:', error)
    throw new Error(`AI Analysis failed: ${error.message}`)
  }
}

/**
 * Main function - Scrape and analyze webpage
 * @param {string} url - The webpage URL
 * @returns {Promise<Object>} - Complete analysis results
 */
export async function analyzeWebpage(url) {
  try {
    // Validate API key
    if (!GROQ_API_KEY) {
      throw new Error('GROQ API key not configured. Please set VITE_GROQ_API_KEY environment variable.')
    }

    console.log('Starting webpage analysis...')

    // Step 1: Scrape webpage
    console.log('Scraping webpage...')
    const scrapedData = await scrapeWebpage(url)

    // Step 2: Analyze with Groq AI
    console.log('Analyzing with AI...')
    const analysis = await analyzeWithGroq(
      scrapedData.text,
      scrapedData.url,
      scrapedData.title
    )

    // Add description from metadata
    return {
      ...analysis,
      description: scrapedData.description
    }
  } catch (error) {
    console.error('Analysis error:', error)
    throw error
  }
}
