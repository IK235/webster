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

    // List of CORS proxies to try (in order)
    const proxies = [
      `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
      `https://cors-anywhere.herokuapp.com/${url}`,
      `https://corsproxy.io/?${encodeURIComponent(url)}`
    ]

    let html = null
    let lastError = null

    // Try each proxy in sequence
    for (const proxyUrl of proxies) {
      try {
        const response = await fetch(proxyUrl, {
          headers: {
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        })

        if (response.ok) {
          html = await response.text()
          if (html && html.length > 10) {
            console.log(`Successfully scraped with proxy: ${proxyUrl.split('/')[2]}`)
            break
          }
        }
      } catch (error) {
        lastError = error
        console.log(`Proxy failed: ${proxyUrl.split('/')[2]} - trying next...`)
        continue
      }
    }

    if (!html || html.length < 10) {
      throw new Error(`Failed to fetch webpage. ${lastError ? lastError.message : 'All proxies failed or returned empty content.'}`)
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
    const prompt = `Analyze this webpage content and provide:
1. A concise summary (2-3 sentences)
2. List of 5-7 key keywords/topics
3. Overall sentiment (positive, negative, neutral, mixed)
4. Key insights and main takeaways

Content:
${content}

Provide response as JSON with keys: summary, keywords (array), sentiment, insights`

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
        temperature: 0.7,
        max_tokens: 1024
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Groq API error: ${error.error?.message || 'Unknown error'}`)
    }

    const data = await response.json()
    const analysisText = data.choices[0].message.content

    // Parse JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Could not parse AI response')
    }

    const analysis = JSON.parse(jsonMatch[0])

    return {
      url,
      title,
      summary: analysis.summary,
      keywords: Array.isArray(analysis.keywords) ? analysis.keywords : analysis.keywords.split(',').map(k => k.trim()),
      sentiment: analysis.sentiment,
      insights: analysis.insights
    }
  } catch (error) {
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
