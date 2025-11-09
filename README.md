# Webster - Web Intelligence AI 🕷️

![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-5.4-purple?style=flat-square)
![Groq API](https://img.shields.io/badge/Groq%20API-LLaMA%203.3-green?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)

**Webster** is an advanced web scraper with AI-powered analysis that intelligently extracts and analyzes webpage content using natural language processing. Powered by the Groq API and built with React, Webster transforms raw web content into actionable insights in seconds.

## 🌟 Live Demo

**👉 [Try Webster Live](https://webster-sigma.vercel.app)** ← Click to analyze any webpage

## ✨ What Makes Webster Different

Webster goes beyond traditional web scraping by combining intelligent content extraction with cutting-edge AI analysis. Instead of just pulling raw text, Webster:

- **Understands Context** - Uses LLaMA 3.3 (70B) to comprehend and summarize content intelligently
- **Extracts Intelligence** - Automatically identifies key topics, sentiment, and actionable insights
- **Works Across the Web** - CORS-proxy enabled to scrape any public webpage
- **Delivers Instantly** - Lightning-fast analysis with real-time feedback
- **Exports Seamlessly** - Download results in JSON or CSV for integration with your tools

## 🎯 Core Features

| Feature | Description |
|---------|-------------|
| 🔗 **Web Scraping** | Fetch and intelligently parse any public webpage with CORS proxy support - no rate limits |
| 🤖 **AI Analysis** | Extract summaries, keywords, sentiment, and deep insights using Groq's LLaMA 3.3 |
| 📊 **Metadata Extraction** | Automatically extract title, description, and optimized content from any webpage |
| 📥 **Multi-Format Export** | Download analysis results as JSON or CSV for easy integration |
| 📱 **Responsive Design** | Minimalist, modern UI optimized for desktop, tablet, and mobile devices |
| ⚡ **Real-time Feedback** | See loading indicators and instant results - fast enough for production use |
| 🔒 **Privacy First** | All processing happens in the browser, no data stored on servers |

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Frontend** | React 19.2 | Modern UI with hooks and functional components |
| **Build Tool** | Vite 5.4 | Lightning-fast development and optimized production builds |
| **AI Engine** | Groq API (LLaMA 3.3 70B) | State-of-the-art language model for intelligent analysis |
| **Styling** | CSS3 + Responsive Design | Minimalist, modern UI with mobile-first approach |
| **Web Scraping** | DOM Parser + CORS Proxy | Browser-based HTML parsing with cross-origin support |
| **State Management** | React Hooks | Simple, effective state handling with useState |

### Why These Technologies?

- **Groq API** - Fastest inference engine available, delivers results in milliseconds
- **React 19** - Latest features and performance optimizations for responsive UX
- **Vite** - 10-100x faster than traditional bundlers, perfect for modern web apps
- **Client-side Processing** - Enhanced privacy, no server-side data storage

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

## 🔄 How It Works

### Workflow

```
User Input (URL)
    ↓
┌─────────────────────────────────────────┐
│ 1. Web Scraping with CORS Proxy         │
│    - Fetch HTML content                 │
│    - Parse and clean text               │
│    - Extract metadata (title, desc)     │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 2. AI Analysis with Groq LLaMA 3.3      │
│    - Send content to Groq API           │
│    - Process with advanced NLP model    │
│    - Generate structured JSON response  │
└─────────────────────────────────────────┘
    ↓
┌─────────────────────────────────────────┐
│ 3. Results Display & Export             │
│    - Show summary & keywords            │
│    - Display sentiment analysis         │
│    - Provide insights & takeaways       │
│    - Enable JSON/CSV export             │
└─────────────────────────────────────────┘
```

### Analysis Output

| Output | Description |
|--------|-------------|
| 📝 **Summary** | 2-3 sentence concise overview of page content |
| 🏷️ **Keywords** | 5-7 most important topics and themes |
| 😊 **Sentiment** | Emotional tone: positive, negative, neutral, or mixed |
| 💡 **Insights** | Key takeaways and actionable information |
| 🔍 **Metadata** | Original URL, page title, and meta description |

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

## 📚 Use Cases

Webster is perfect for:

- **Content Analysis** - Quickly understand what a webpage is about
- **Research** - Extract key information from multiple sources at once
- **SEO Insights** - Analyze competitor content and sentiment
- **News Monitoring** - Track sentiment and themes in news articles
- **Market Research** - Understand product pages and competitor strategies
- **Academic Research** - Analyze multiple papers and documents
- **Content Curation** - Summarize articles for newsletter or social media

## 🎓 Learning Outcomes

This project demonstrates advanced React and web development patterns:

- **Modern React** - Hooks, functional components, state management
- **Async Operations** - Promise handling, loading states, error management
- **Web APIs** - DOM parsing, CORS handling, file downloads
- **API Integration** - RESTful API calls, authentication, JSON parsing
- **Frontend Architecture** - Component design, separation of concerns
- **Responsive Design** - Mobile-first CSS, media queries, accessibility
- **Performance** - Code splitting, production builds, optimization

## 🚀 Deployment

Deployed on Vercel at: **[webster-sigma.vercel.app](https://webster-sigma.vercel.app)**

### Deploy Your Own

```bash
# Clone and install
git clone https://github.com/IK235/webster.git
cd webster
npm install

# Build
npm run build

# Deploy to Vercel (requires Vercel account)
vercel --prod

# Set environment variable in Vercel dashboard:
# VITE_GROQ_API_KEY = your-api-key-here
```

## 📝 API Reference

### Groq API Configuration

Webster uses `llama-3.3-70b-versatile` model with:
- **Temperature**: 0.7 (balanced creativity and accuracy)
- **Max Tokens**: 1024 (comprehensive but concise responses)
- **Model**: Llama 3.3 70B (latest open-source model)

### Environment Variables

```env
VITE_GROQ_API_KEY=your-groq-api-key-here
```

Get a free API key from [console.groq.com](https://console.groq.com)

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Ideas for Contributions

- [ ] Add batch URL processing
- [ ] Implement caching for frequently analyzed URLs
- [ ] Add dark mode toggle
- [ ] Support for PDF analysis
- [ ] Browser extension version
- [ ] Multi-language support

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

Made with ❤️ by [Ikbal Erdal](https://github.com/IK235)

**[⬆ back to top](#webster---web-intelligence-ai-)**

</div>
