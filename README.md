# ✈️ SkyPulse - AI-Powered Airline Assistance

<div align="center">

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![AI](https://img.shields.io/badge/AI-Powered-FF6B6B?style=for-the-badge&logo=openai&logoColor=white)

*An intelligent flight booking assistant that combines 7-day price forecasting with conversational AI to help users find the best flight deals and optimal booking days.*

</div>

---

## 🤖 Why AI Matters in Travel Booking

The travel industry is flooded with data—thousands of flights, constantly fluctuating prices, and countless variables that affect booking decisions. Traditional booking platforms leave users overwhelmed with options and no clear guidance. **This is where AI transforms the experience.**

### The Problem
- ❌ Users face information overload with hundreds of flight options
- ❌ Prices vary significantly by day of the week, making timing crucial
- ❌ Comparing flights across multiple criteria (price, duration, stops) is tedious
- ❌ No personalized guidance—users are left to figure it out themselves

### The AI Solution
- ✅ **7-Day Price Forecasting**: AI predicts the best day to book within the next week
- ✅ **Natural Conversation**: Users ask questions in plain English and get contextual answers
- ✅ **Smart Recommendations**: AI analyzes day-of-week patterns and advises when to book
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
else if (lowerMessage.includes('when') || lowerMessage.includes('day') || lowerMessage.includes('book')) {
  // INTENT: Best booking day → Execute 7-day forecast analysis
}
```

**Recognized Intents:**
| Intent | Trigger Keywords | AI Response |
|--------|-----------------|-------------|
| Price Optimization | "cheap", "deal", "save", "budget" | Finds lowest-priced flights with savings analysis |
| Speed Optimization | "fast", "quick", "short" | Recommends quickest routes |
| Booking Timing | "when", "day", "book", "forecast" | Analyzes 7-day forecast and advises optimal booking day |
| Weekend Analysis | "weekend", "saturday", "sunday" | Compares weekend vs weekday pricing |
| Comparison | "compare", "options", "all" | Provides side-by-side comparison with best days |
| General Help | "help", "hello", "hi" | Offers guidance and capabilities |

### 2. **7-Day Price Forecasting Algorithm**

The system implements intelligent price prediction based on multiple factors:

```javascript
// Day of Week Pricing Factors
const dayOfWeekFactors = {
  0: 1.15, // Sunday - higher demand
  1: 0.85, // Monday - lowest prices (business travel lull)
  2: 0.90, // Tuesday - second best
  3: 0.92, // Wednesday
  4: 0.95, // Thursday
  5: 1.10, // Friday - weekend travel begins
  6: 1.20, // Saturday - peak pricing
}

// Advance Booking Factors (how far ahead you book)
const advanceBookingFactors = [
  1.25,  // Day 0 (today) - last minute premium
  1.15,  // Day 1 (tomorrow)
  1.05,  // Day 2
  1.00,  // Day 3
  0.95,  // Day 4
  0.92,  // Day 5
  0.90,  // Day 6 - best price (sweet spot)
]
```

**How the Forecast Works:**
- 📅 Generates price predictions for the next 7 days
- 📊 Combines day-of-week patterns with advance booking benefits
- 🎯 Identifies the optimal day to book for maximum savings
- 💰 Calculates potential savings compared to today's price

### 3. **Intelligent Recommendation Engine**

The AI synthesizes multiple data points to provide actionable insights:

```javascript
// Multi-Factor Best Day Analysis
const getBestBookingDay = (forecast) => {
  const bestDay = forecast.reduce((min, day) => 
    day.price < min.price ? day : min, forecast[0]
  )
  const todayPrice = forecast[0].price
  const savings = todayPrice - bestDay.price
  
  return {
    ...bestDay,
    savings,
    savingsPercent: Math.round((savings / todayPrice) * 100),
  }
}
```

**Recommendation Factors:**
- 📅 **Day of Week Impact**: Weekdays typically 15-35% cheaper than weekends
- ⏰ **Advance Booking Benefit**: Booking 5-6 days out can save up to 10%
- 💰 **Price vs. Average**: How much savings compared to market average
- ⏱️ **Duration Analysis**: Trade-off between speed and cost
- 🛫 **Stop Optimization**: Non-stop vs. connecting flight value

### 4. **Conversational AI Design Patterns**

The assistant follows conversational AI best practices:

| Pattern | Implementation |
|---------|---------------|
| **Context Awareness** | Maintains conversation history and flight search context |
| **Proactive Suggestions** | Offers clickable suggestion chips for common queries |
| **7-Day Insights** | Provides weekly forecast overview in responses |
| **Graceful Fallbacks** | Provides helpful responses even when no flights are loaded |
| **Rich Formatting** | Uses markdown-style formatting for readable responses |
| **Typing Indicators** | Shows "thinking" animation for natural conversation flow |

### 5. **Dynamic Pricing Simulation**

The system simulates real-world airline pricing behavior:

```javascript
// Weekly Price Forecast Generation
export const generateWeeklyPriceForecast = (basePrice, flightId) => {
  const forecast = []
  const today = new Date()
  
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day)
    const dayOfWeek = date.getDay()
    
    // Combine all pricing factors
    const dayFactor = dayOfWeekFactors[dayOfWeek]
    const advanceFactor = advanceBookingFactors[day]
    const flightVariation = getFlightVariation(flightId, day)
    
    const price = basePrice * dayFactor * advanceFactor * flightVariation
    
    forecast.push({
      day,
      date,
      dateLabel: day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : format(date, 'EEE, MMM d'),
      price: Math.round(price),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isBestDay: false,
    })
  }
  
  // Mark the cheapest day
  const minPrice = Math.min(...forecast.map(f => f.price))
  forecast.forEach(f => { if (f.price === minPrice) f.isBestDay = true })
  
  return forecast
}
```

**Pricing Intelligence:**
- 📆 7-day lookahead forecast for each flight
- 📊 Day-of-week pricing patterns (Mon-Thu cheaper, Fri-Sun expensive)
- 📈 Advance booking discount curves
- 🎯 Best day identification and savings calculation

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
│  │ Intent Parser  │  │ Forecast Engine │  │ Recommendation  │  │
│  │  (NLP Logic)   │  │ (7-Day Predict) │  │    Engine       │  │
│  └────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                               │
│  ┌─────────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Flight Generator│  │ Price Forecast│  │ State Management │  │
│  │  (Mock API)     │  │  (Weekly)     │  │    (React)       │  │
│  └─────────────────┘  └──────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🤖 AI Assistant (SkyPulse AI)
- **Conversational Interface**: Chat naturally about flights
- **7-Day Forecast Insights**: Ask "when should I book?" for detailed analysis
- **Smart Suggestions**: Pre-built query chips for quick actions
- **Contextual Responses**: Answers adapt based on available flight data
- **Weekend vs Weekday Analysis**: Understand pricing patterns

### 📅 7-Day Price Forecasting
- **Weekly Price Chart**: Visual bar chart showing prices for the next 7 days
- **Best Day Highlighting**: Green highlight on the optimal booking day
- **Savings Calculation**: Shows how much you save by waiting
- **Weekend Indicators**: Visual cues for typically more expensive days

### 🔍 Intelligent Search
- **Multi-Airline Comparison**: 8 major airlines simulated
- **Best Day per Flight**: Each flight shows its optimal booking day
- **Best Deal Detection**: Automatic highlighting of optimal choices
- **Seat Availability**: Real-time seat count tracking

### 📈 Price Analytics Dashboard
- **Weekly Forecast Charts**: Recharts-powered visualizations
- **Comparison Mode**: Compare 7-day trends across multiple flights
- **Statistical Summary**: Min, max, and average prices
- **Booking Recommendations**: AI-driven timing advice with specific dates

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
| **Recharts** | Data Visualization (7-Day Charts) |
| **Lucide React** | Icon System |
| **date-fns** | Date Formatting & Manipulation |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── AIAssistant.jsx     # 🤖 Conversational AI with 7-day forecast insights
│   ├── FlightResults.jsx   # ✈️ Flight listing with best-day indicators
│   ├── PriceChart.jsx      # 📈 7-day price forecast charts
│   ├── SearchPanel.jsx     # 🔍 Flight search form
│   └── Header.jsx          # 🎨 App header with forecast indicator
├── utils/
│   └── flightData.js       # 📊 Flight & weekly forecast generation
├── App.jsx                 # 🏠 Main application component
└── main.jsx                # 🚀 Application entry point
```

---

## 🔮 Future Enhancements

- [ ] **LLM Integration**: Connect to OpenAI/Claude for more sophisticated NLP
- [ ] **Voice Interface**: Add speech-to-text for hands-free queries
- [x] **7-Day Price Forecasting**: Predict best booking days ✅
- [ ] **Multi-City Search**: Complex itinerary support
- [ ] **Price Alerts**: Push notifications for price drops
- [ ] **Booking Integration**: Connect to real airline APIs
- [ ] **Historical Data**: Learn from past pricing patterns

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ and AI**

*Making flight booking smarter with 7-day price forecasting.*

</div>
