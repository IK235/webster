# Webster - Web Intelligence AI

An advanced web scraper with AI-powered analysis. Webster intelligently extracts and analyzes webpage content using natural language processing, powered by the Groq API.

## Features

- **Web Scraping** - Fetch and parse any webpage with CORS proxy support
- **AI Analysis** - Extract summaries, keywords, sentiment, and insights using Groq API
- **Metadata Extraction** - Automatically extract title, description, and content
- **Export Results** - Download analysis results as JSON or CSV
- **Responsive Design** - Minimalist UI optimized for all devices
- **Real-time Processing** - See results with loading indicators

## Tech Stack

- **React 19.2** - UI library
- **Vite** - Build tool and dev server
- **Groq API** - AI-powered text analysis (llama-3.3-70b-versatile)
- **CSS3** - Styling with responsive design

## Installation

1. Clone the repository:
```bash
git clone https://github.com/IK235/webster.git
cd webster
```

2. Install dependencies:
```bash
npm install
```

3. Set up the Groq API key:
   - Get an API key from [console.groq.com](https://console.groq.com)
   - Create a `.env` file in the project root:
   ```
   VITE_GROQ_API_KEY=your-api-key-here
   ```

4. Start the development server:
```bash
npm run dev
```

The application will run at http://localhost:5173

## How It Works

1. Enter a URL in the input field
2. Click "Analyze" to start the process
3. Webster fetches the webpage using a CORS proxy
4. The content is sent to Groq API for analysis
5. Results include:
   - **Summary** - 2-3 sentence overview
   - **Keywords** - 5-7 key topics extracted
   - **Sentiment** - Overall tone (positive, negative, neutral, mixed)
   - **Insights** - Key takeaways and main points

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── App.jsx                 # Main component with UI orchestration
├── index.css              # Styling and responsive design
├── services/
│   └── webster.js         # Web scraping and AI analysis logic
└── main.jsx              # Entry point
```

## Technologies & Learning

This project demonstrates:
- React hooks (useState, useEffect)
- Async/await API integration
- DOM parsing and HTML extraction
- Error handling and loading states
- File download functionality
- Responsive CSS design

## Deployment

Deployed on Vercel at: [webster.vercel.app](https://webster.vercel.app)

## License

MIT
