import { useState } from 'react'
import './App.css'
import { analyzeWebpage } from './services/webster'

/**
 * WEBSTER - Web Intelligence AI
 *
 * A web scraper with AI analysis powered by Groq API
 * Analyzes webpages and extracts insights using natural language processing
 */

function App() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async (e) => {
    e.preventDefault()

    if (!url.trim()) {
      setError('Please enter a valid URL')
      return
    }

    setLoading(true)
    setError(null)
    setResults(null)

    try {
      const data = await analyzeWebpage(url)
      setResults(data)
    } catch (err) {
      setError(err.message || 'Failed to analyze webpage')
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const downloadResults = (format) => {
    if (!results) return

    let content, filename, type

    if (format === 'json') {
      content = JSON.stringify(results, null, 2)
      filename = 'webster-results.json'
      type = 'application/json'
    } else {
      // CSV format
      content = `URL,${results.url}\nTitle,${results.title}\nDescription,${results.description}\nKeywords,${results.keywords.join('; ')}\nSentiment,${results.sentiment}`
      filename = 'webster-results.csv'
      type = 'text/csv'
    }

    const blob = new Blob([content], { type })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    link.click()
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🕷️ Webster</h1>
        <p>Web Intelligence AI - Analyze any webpage with AI</p>
      </div>

      <form onSubmit={handleAnalyze} className="input-section">
        <div className="input-group">
          <input
            type="url"
            placeholder="Enter URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="url-input"
          />
          <button type="submit" disabled={loading} className="analyze-btn">
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </form>

      {error && <div className="error-message">{error}</div>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Scraping and analyzing webpage...</p>
        </div>
      )}

      {results && (
        <div className="results-section">
          <div className="result-card">
            <h2>📄 Page Information</h2>
            <div className="result-item">
              <label>URL:</label>
              <p>{results.url}</p>
            </div>
            <div className="result-item">
              <label>Title:</label>
              <p>{results.title}</p>
            </div>
            <div className="result-item">
              <label>Description:</label>
              <p>{results.description}</p>
            </div>
          </div>

          <div className="result-card">
            <h2>🔍 AI Analysis</h2>
            <div className="result-item">
              <label>Summary:</label>
              <p>{results.summary}</p>
            </div>
            <div className="result-item">
              <label>Sentiment:</label>
              <span className={`sentiment ${results.sentiment.toLowerCase()}`}>
                {results.sentiment}
              </span>
            </div>
            <div className="result-item">
              <label>Keywords:</label>
              <div className="keywords">
                {results.keywords.map((kw, i) => (
                  <span key={i} className="keyword-tag">{kw}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="result-card">
            <h2>💡 Key Insights</h2>
            <p>{results.insights}</p>
          </div>

          <div className="export-section">
            <button onClick={() => downloadResults('json')} className="export-btn">
              📥 Export as JSON
            </button>
            <button onClick={() => downloadResults('csv')} className="export-btn">
              📥 Export as CSV
            </button>
          </div>
        </div>
      )}

      {!results && !loading && (
        <div className="welcome">
          <p>Enter a URL above to analyze any webpage with AI-powered insights</p>
        </div>
      )}
    </div>
  )
}

export default App
