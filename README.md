# ✈️ SkyPulse - AI-Powered Airline Assistance

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AI](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)

*An intelligent flight booking assistant that combines real-time price tracking with conversational AI to help users find the best flight deals.*

</div>

---

## 🤖 Why AI Matters in Travel Booking

The travel industry is flooded with data—thousands of flights, constantly fluctuating prices, and countless variables that affect booking decisions. Traditional booking platforms leave users overwhelmed with options and no clear guidance. **This is where AI transforms the experience.**

### The Problem
- ❌ Users face information overload with hundreds of flight options
- ❌ Prices change rapidly, making it hard to know when to book
- ❌ Comparing flights across multiple criteria (price, duration, stops) is tedious
- ❌ No personalized guidance—users are left to figure it out themselves

### The AI Solution
- ✅ **Intelligent Analysis**: AI processes all flight data instantly and surfaces the best options
- ✅ **Natural Conversation**: Users ask questions in plain English and get contextual answers
- ✅ **Real-time Recommendations**: AI monitors price trends and advises when to book
- ✅ **Personalized Insights**: Tailored suggestions based on user preferences and queries

---

## 🧠 AI Concepts & Technologies Used

### 1. **Natural Language Processing (NLP) - Intent Recognition**

The AI Assistant uses keyword-based intent classification to understand user queries and respond appropriately.

```javascript
// Intent Classification System
const lowerMessage = userMessage.toLowerCase()

if (lowerMessage.includes('cheap') || lowerMessage.includes('deal') || lowerMessage.includes('save')) {
  // INTENT: Find best price → Execute price optimization logic
}
else if (lowerMessage.includes('fast') || lowerMessage.includes('quick')) {
  // INTENT: Find fastest flight → Execute duration optimization logic
}
else if (lowerMessage.includes('when') || lowerMessage.includes('book')) {
  // INTENT: Booking advice → Execute trend analysis logic
}
```

**Recognized Intents:**
| Intent | Trigger Keywords | AI Response |
|--------|-----------------|-------------|
| Price Optimization | "cheap", "deal", "save", "budget" | Finds lowest-priced flights with savings analysis |
| Speed Optimization | "fast", "quick", "short" | Recommends quickest routes |
| Booking Timing | "when", "time", "book" | Analyzes trends and advises on timing |
| Comparison | "compare", "options", "all" | Provides side-by-side comparison |
| General Help | "help", "hello", "hi" | Offers guidance and capabilities |

### 2. **Real-Time Data Analytics & Price Intelligence**

The system implements continuous price monitoring with intelligent trend analysis:

```javascript
// Price Trend Analysis Algorithm
const getPriceRecommendation = () => {
  const history = priceHistory[lowestFlight.id]
  const recent = history.slice(-3)  // Last 3 data points
  const trend = recent[2].price - recent[0].price
  
  if (trend < -5) return { status: 'buy', message: 'Prices dropping!' }
  if (trend > 5) return { status: 'wait', message: 'Prices rising.' }
  return { status: 'neutral', message: 'Prices stable.' }
}
```

**How It Works:**
- 📊 Prices update every 5 seconds (simulating real market conditions)
- 📈 Historical price data is tracked for each flight (up to 30 data points)
- 🔔 AI analyzes trends to provide booking recommendations

### 3. **Intelligent Recommendation Engine**

The AI doesn't just retrieve data—it **synthesizes insights**:

```javascript
// Multi-Factor Analysis
const cheapest = [...flights].sort((a, b) => a.price - b.price)[0]
const fastest = [...flights].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]
const avgPrice = flights.reduce((sum, f) => sum + f.price, 0) / flights.length

// AI generates contextual insights
response = `This is $${(avgPrice - cheapest.price).toFixed(0)} below average!`
```

**Recommendation Factors:**
- 💰 **Price vs. Average**: How much savings compared to market average
- ⏱️ **Duration Analysis**: Trade-off between speed and cost
- 🛫 **Stop Optimization**: Non-stop vs. connecting flight value
- 📉 **Trend Direction**: Whether prices are rising or falling

### 4. **Conversational AI Design Patterns**

The assistant follows conversational AI best practices:

| Pattern | Implementation |
|---------|---------------|
| **Context Awareness** | Maintains conversation history and flight search context |
| **Proactive Suggestions** | Offers clickable suggestion chips for common queries |
| **Graceful Fallbacks** | Provides helpful responses even when no flights are loaded |
| **Rich Formatting** | Uses markdown-style formatting for readable responses |
| **Typing Indicators** | Shows "thinking" animation for natural conversation flow |

### 5. **Dynamic Pricing Simulation**

The system simulates real-world airline pricing behavior:

```javascript
// Price Fluctuation Algorithm
export const simulatePriceChanges = (flights) => {
  return flights.map(flight => {
    // Random fluctuation: -5% to +5%
    const change = (Math.random() - 0.5) * 0.1 * flight.price
    let newPrice = flight.price + change
    
    // Boundary constraints (realistic price range)
    newPrice = Math.max(99, Math.min(999, newPrice))
    
    return { ...flight, price: Math.round(newPrice), previousPrice: flight.price }
  })
}
```

**Pricing Intelligence:**
- 🎲 Stochastic price changes (random walk model)
- 📏 Price bounds to maintain realism
- 🔄 Seat availability decay simulation
- 📊 Price history tracking for trend analysis

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ Search Panel │  │Flight Results│  │  AI Chat Interface   │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING LAYER                        │
│  ┌────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ Intent Parser  │  │ Trend Analyzer  │  │ Recommendation  │  │
│  │  (NLP Logic)   │  │ (Price History) │  │    Engine       │  │
│  └────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Flight Generator│  │Price Simulator│  │ State Management │  │
│  │  (Mock API)     │  │ (Real-time)   │  │    (React)       │  │
│  └─────────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🤖 AI Assistant (SkyPulse AI)
- **Conversational Interface**: Chat naturally about flights
- **Smart Suggestions**: Pre-built query chips for quick actions
- **Contextual Responses**: Answers adapt based on available flight data
- **Markdown Rendering**: Clean, formatted responses with highlights

### 📊 Real-Time Price Tracking
- **Live Updates**: Prices refresh every 5 seconds
- **Visual Trends**: Interactive charts show price movements
- **Historical Data**: Track price changes over time
- **Trend Indicators**: Visual cues for price direction

### 🔍 Intelligent Search
- **Multi-Airline Comparison**: 8 major airlines simulated
- **Flexible Filtering**: Sort by price, duration, or stops
- **Best Deal Detection**: Automatic highlighting of optimal choices
- **Seat Availability**: Real-time seat count tracking

### 📈 Price Analytics Dashboard
- **Live Charts**: Recharts-powered visualizations
- **Comparison Mode**: Track multiple flights simultaneously
- **Statistical Summary**: Min, max, and average prices
- **Booking Recommendations**: AI-driven timing advice

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone git@github.com:yeshwanthreddy12/Airline_Assistant_AI.git

# Navigate to the project
cd Airline_Assistant_AI

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Component Library |
| **Vite** | Build Tool & Dev Server |
| **Framer Motion** | Animations & Transitions |
| **Recharts** | Data Visualization |
| **Lucide React** | Icon System |
| **date-fns** | Date Formatting |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AIAssistant.jsx     # 🤖 Conversational AI interface
│   ├── FlightResults.jsx   # ✈️ Flight listing with real-time prices
│   ├── PriceChart.jsx      # 📈 Interactive price trend charts
│   ├── SearchPanel.jsx     # 🔍 Flight search form
│   └── Header.jsx          # 🎨 App header with live indicator
├── utils/
│   └── flightData.js       # 📊 Data generation & price simulation
├── App.jsx                 # 🏠 Main application component
└── main.jsx                # 🚀 Application entry point
```

---

## 🔮 Future Enhancements

- [ ] **LLM Integration**: Connect to OpenAI/Claude for more sophisticated NLP
- [ ] **Voice Interface**: Add speech-to-text for hands-free queries
- [ ] **Price Prediction**: ML models for forecasting price trends
- [ ] **Multi-City Search**: Complex itinerary support
- [ ] **Price Alerts**: Push notifications for price drops
- [ ] **Booking Integration**: Connect to real airline APIs

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ and AI**

*Making flight booking smarter, one conversation at a time.*

</div>
