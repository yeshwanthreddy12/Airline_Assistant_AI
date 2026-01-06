import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Plane, DollarSign, Calendar, Loader2 } from 'lucide-react'
import './AIAssistant.css'

const suggestions = [
  { icon: <DollarSign size={14} />, text: "Find cheapest flights" },
  { icon: <Calendar size={14} />, text: "When is the best day to book?" },
  { icon: <Plane size={14} />, text: "Recommend fastest route" },
]

function AIAssistant({ flights, searchParams }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI flight assistant ✈️ I can help you find the best deals, analyze the 7-day price forecast, and recommend the perfect flight. What can I help you with today?"
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage) => {
    setIsTyping(true)
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    
    let response = ''
    const lowerMessage = userMessage.toLowerCase()
    
    if (flights.length > 0) {
      const cheapest = [...flights].sort((a, b) => a.price - b.price)[0]
      const fastest = [...flights].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]
      const avgPrice = flights.reduce((sum, f) => sum + f.price, 0) / flights.length
      
      // Get best day from forecast
      const getBestDayInfo = (flight) => {
        const forecast = flight.weeklyForecast || []
        const bestDay = forecast.find(d => d.isBestDay)
        const todayPrice = forecast[0]?.price || flight.price
        const savings = bestDay ? todayPrice - bestDay.price : 0
        return { bestDay, savings, todayPrice }
      }
      
      const cheapestForecast = getBestDayInfo(cheapest)
      
      if (lowerMessage.includes('cheap') || lowerMessage.includes('deal') || lowerMessage.includes('save') || lowerMessage.includes('budget')) {
        const { bestDay, savings } = cheapestForecast
        response = `Great news! I found some excellent deals for you! 🎉\n\n` +
          `**Best Price Today:** ${cheapest.airline} ${cheapest.flightNumber}\n` +
          `• Today's Price: **$${cheapest.price}**\n` +
          `• Departure: ${cheapest.departureTime}\n` +
          `• Duration: ${cheapest.duration}\n\n` +
          `This is **$${Math.round(avgPrice - cheapest.price)} below average**!`
        
        if (bestDay && savings > 0) {
          response += `\n\n📅 **Even Better:** Book on **${bestDay.dateLabel}** for just **$${bestDay.price}** and save an extra **$${savings}**!`
        } else if (bestDay) {
          response += `\n\n🎯 **Today is the best day to book** - prices are at their lowest!`
        }
      } else if (lowerMessage.includes('fast') || lowerMessage.includes('quick') || lowerMessage.includes('short')) {
        response = `For the fastest journey, here's my recommendation: ⚡\n\n` +
          `**Fastest Flight:** ${fastest.airline} ${fastest.flightNumber}\n` +
          `• Duration: **${fastest.duration}**\n` +
          `• Price: $${fastest.price}\n` +
          `• ${fastest.stops === 0 ? 'Non-stop flight!' : `${fastest.stops} stop(s)`}\n\n` +
          `This will get you there ${fastest.stops === 0 ? 'without any layovers' : 'quickly despite the connection'}.`
        
        const fastestForecast = getBestDayInfo(fastest)
        if (fastestForecast.bestDay && fastestForecast.savings > 0) {
          response += `\n\n📅 **Pro Tip:** Book on **${fastestForecast.bestDay.dateLabel}** for **$${fastestForecast.bestDay.price}** (save $${fastestForecast.savings})!`
        }
      } else if (lowerMessage.includes('day') || lowerMessage.includes('when') || lowerMessage.includes('book') || lowerMessage.includes('time') || lowerMessage.includes('forecast')) {
        const { bestDay, savings, todayPrice } = cheapestForecast
        const forecast = cheapest.weeklyForecast || []
        
        response = `Based on my 7-day price forecast analysis: 📊\n\n`
        
        if (bestDay && bestDay.day === 0) {
          response += `**Recommendation: Book Today!** 🟢\n\n` +
            `• Today's price is the **lowest this week**: **$${todayPrice}**\n` +
            `• Prices are expected to rise in the coming days\n\n` +
            `Don't wait - grab that ${cheapest.airline} flight now!`
        } else if (bestDay && savings > 0) {
          response += `**Recommendation: Wait until ${bestDay.dateLabel}** 📅\n\n` +
            `• Today's price: $${todayPrice}\n` +
            `• Best price on **${bestDay.dayName}**: **$${bestDay.price}**\n` +
            `• You'll save: **$${savings}** (${Math.round((savings / todayPrice) * 100)}% off)\n\n`
          
          if (bestDay.isWeekend) {
            response += `⚠️ Note: ${bestDay.dateLabel} is a weekend, but prices are still lower due to advance booking benefits.`
          } else {
            response += `💡 ${bestDay.dayName}s typically have lower demand, which means better prices!`
          }
        } else {
          response += `**Prices are stable this week** 🟡\n\n` +
            `• Current price range: $${Math.min(...forecast.map(d => d.price))} - $${Math.max(...forecast.map(d => d.price))}\n` +
            `• No significant savings expected\n\n` +
            `You can book anytime this week with similar pricing.`
        }
        
        // Add weekly overview
        response += `\n\n**📈 7-Day Price Overview:**\n`
        forecast.slice(0, 4).forEach(day => {
          const marker = day.isBestDay ? '✨' : (day.isWeekend ? '📅' : '•')
          response += `${marker} ${day.shortDay}: $${day.price}${day.isBestDay ? ' (Best!)' : ''}\n`
        })
        
      } else if (lowerMessage.includes('compare') || lowerMessage.includes('option') || lowerMessage.includes('all')) {
        const top3 = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
        response = `Here's a comparison of your top options: ✈️\n\n`
        
        top3.forEach((f, i) => {
          const { bestDay, savings } = getBestDayInfo(f)
          response += `**${i + 1}. ${f.airline} ${f.flightNumber}**\n` +
            `   💰 $${f.price} today • ⏱️ ${f.duration} • ${f.stops === 0 ? '✈️ Non-stop' : `🔄 ${f.stops} stop(s)`}`
          if (bestDay && savings > 0) {
            response += `\n   📅 Best on ${bestDay.shortDay}: $${bestDay.price} (-$${savings})`
          }
          response += '\n\n'
        })
        
        response += `**My Pick:** Option 1 offers the best value!`
      } else if (lowerMessage.includes('weekend') || lowerMessage.includes('saturday') || lowerMessage.includes('sunday')) {
        const forecast = cheapest.weeklyForecast || []
        const weekendDays = forecast.filter(d => d.isWeekend)
        
        response = `Here's the weekend pricing analysis: 📅\n\n`
        if (weekendDays.length > 0) {
          weekendDays.forEach(day => {
            response += `**${day.dayName}** (${day.dateLabel}): **$${day.price}**\n`
          })
          
          const cheapestWeekend = weekendDays.reduce((a, b) => a.price < b.price ? a : b)
          const cheapestWeekday = forecast.filter(d => !d.isWeekend).reduce((a, b) => a.price < b.price ? a : b)
          
          response += `\n⚠️ Weekend flights are typically **$${cheapestWeekend.price - cheapestWeekday.price}** more expensive.`
          response += `\n💡 Consider ${cheapestWeekday.dateLabel} for better rates at **$${cheapestWeekday.price}**!`
        }
      } else {
        const { bestDay, savings } = cheapestForecast
        response = `I'm analyzing your ${flights.length} flight options from ${searchParams?.from || 'your origin'} to ${searchParams?.to || 'your destination'}.\n\n` +
          `Here's what I found:\n` +
          `• **Cheapest Today:** $${cheapest.price} (${cheapest.airline})\n` +
          `• **Fastest:** ${fastest.duration} (${fastest.airline})\n` +
          `• **Average Price:** $${Math.round(avgPrice)}\n`
        
        if (bestDay && savings > 0) {
          response += `• **Best Day to Book:** ${bestDay.dateLabel} (Save $${savings})\n`
        }
        
        response += `\nWould you like me to find the best deal, recommend when to book, or compare all options?`
      }
    } else {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = "Hello! 👋 I'm here to help you find the perfect flight. Start by searching for flights above, and I'll analyze the 7-day price forecast to find you the best deals!"
      } else if (lowerMessage.includes('help')) {
        response = "I can help you with:\n\n" +
          "✈️ **Finding cheapest flights** - I'll analyze all options\n" +
          "📅 **7-Day Price Forecast** - Know the best day to book\n" +
          "⚡ **Fastest routes** - Get there quicker\n" +
          "📊 **Price comparisons** - See all your options\n\n" +
          "Search for flights first, and I'll provide personalized insights!"
      } else {
        response = "I'd love to help! Please search for flights first using the form above, and I'll analyze the 7-day price forecast to find you the best deals and tell you the optimal day to book. 🔍"
      }
    }
    
    setIsTyping(false)
    setMessages(prev => [...prev, { role: 'assistant', content: response }])
  }

  const handleSend = async () => {
    if (!input.trim()) return
    
    const userMessage = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    
    await generateResponse(userMessage)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <motion.button
        className="ai-fab"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MessageCircle size={24} />
        <span className="fab-label">AI Assistant</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="chat-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div 
              className="chat-panel"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              <div className="chat-header">
                <div className="chat-header-info">
                  <div className="chat-avatar">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3>SkyPulse AI</h3>
                    <span className="chat-status">
                      <span className="status-dot"></span>
                      7-Day Forecast Ready
                    </span>
                  </div>
                </div>
                <button className="chat-close" onClick={() => setIsOpen(false)}>
                  <X size={20} />
                </button>
              </div>

              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={idx}
                    className={`chat-message ${msg.role}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    {msg.role === 'assistant' && (
                      <div className="message-avatar">
                        <Sparkles size={14} />
                      </div>
                    )}
                    <div className="message-content">
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} dangerouslySetInnerHTML={{ 
                          __html: line
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em>$1</em>')
                        }} />
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    className="chat-message assistant"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="message-avatar">
                      <Sparkles size={14} />
                    </div>
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              {messages.length === 1 && (
                <div className="chat-suggestions">
                  {suggestions.map((s, idx) => (
                    <button
                      key={idx}
                      className="suggestion-chip"
                      onClick={() => {
                        setInput(s.text)
                        setTimeout(() => {
                          setMessages(prev => [...prev, { role: 'user', content: s.text }])
                          setInput('')
                          generateResponse(s.text)
                        }, 100)
                      }}
                    >
                      {s.icon}
                      <span>{s.text}</span>
                    </button>
                  ))}
                </div>
              )}

              <div className="chat-input-area">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about flights or best booking days..."
                  className="chat-input"
                  disabled={isTyping}
                />
                <button 
                  className="send-button"
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                >
                  {isTyping ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

export default AIAssistant
