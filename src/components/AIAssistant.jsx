import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, Plane, DollarSign, Clock, Loader2 } from 'lucide-react'
import './AIAssistant.css'

const suggestions = [
  { icon: <DollarSign size={14} />, text: "Find cheapest flights" },
  { icon: <Clock size={14} />, text: "When is the best time to book?" },
  { icon: <Plane size={14} />, text: "Recommend fastest route" },
]

function AIAssistant({ flights, searchParams, onSearch }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI flight assistant ✈️ I can help you find the best deals, analyze price trends, and recommend the perfect flight. What can I help you with today?"
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
      
      if (lowerMessage.includes('cheap') || lowerMessage.includes('deal') || lowerMessage.includes('save') || lowerMessage.includes('budget')) {
        response = `Great news! I found some excellent deals for you! 🎉\n\n` +
          `**Best Price:** ${cheapest.airline} ${cheapest.flightNumber}\n` +
          `• Price: **$${cheapest.price.toFixed(0)}**\n` +
          `• Departure: ${cheapest.departureTime}\n` +
          `• Duration: ${cheapest.duration}\n\n` +
          `This is **$${(avgPrice - cheapest.price).toFixed(0)} below average**! I'd recommend booking soon as prices are updating in real-time.`
      } else if (lowerMessage.includes('fast') || lowerMessage.includes('quick') || lowerMessage.includes('short')) {
        response = `For the fastest journey, here's my recommendation: ⚡\n\n` +
          `**Fastest Flight:** ${fastest.airline} ${fastest.flightNumber}\n` +
          `• Duration: **${fastest.duration}**\n` +
          `• Price: $${fastest.price.toFixed(0)}\n` +
          `• ${fastest.stops === 0 ? 'Non-stop flight!' : `${fastest.stops} stop(s)`}\n\n` +
          `This will get you there ${fastest.stops === 0 ? 'without any layovers' : 'quickly despite the connection'}.`
      } else if (lowerMessage.includes('time') || lowerMessage.includes('when') || lowerMessage.includes('book')) {
        const pricesDropping = Math.random() > 0.5
        response = pricesDropping 
          ? `Based on my analysis of the current price trends: 📊\n\n` +
            `**Recommendation: Book Now!** 🟢\n\n` +
            `• Prices have been **dropping** over the last few updates\n` +
            `• Current lowest: **$${cheapest.price.toFixed(0)}**\n` +
            `• Average price: $${avgPrice.toFixed(0)}\n\n` +
            `The market looks favorable for booking right now. I'd grab that ${cheapest.airline} flight!`
          : `Based on my analysis of the current price trends: 📊\n\n` +
            `**Recommendation: Consider waiting** 🟡\n\n` +
            `• Prices have been **fluctuating** recently\n` +
            `• Current range: $${cheapest.price.toFixed(0)} - $${Math.max(...flights.map(f => f.price)).toFixed(0)}\n\n` +
            `I'll keep monitoring. You can also set up a price alert to catch the best deal!`
      } else if (lowerMessage.includes('compare') || lowerMessage.includes('option') || lowerMessage.includes('all')) {
        const top3 = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
        response = `Here's a comparison of your top options: ✈️\n\n` +
          top3.map((f, i) => 
            `**${i + 1}. ${f.airline} ${f.flightNumber}**\n` +
            `   💰 $${f.price.toFixed(0)} • ⏱️ ${f.duration} • ${f.stops === 0 ? '✈️ Non-stop' : `🔄 ${f.stops} stop(s)`}`
          ).join('\n\n') +
          `\n\n**My Pick:** Option 1 offers the best value for money!`
      } else {
        response = `I'm analyzing your ${flights.length} flight options from ${searchParams?.from || 'your origin'} to ${searchParams?.to || 'your destination'}.\n\n` +
          `Here's what I found:\n` +
          `• **Cheapest:** $${cheapest.price.toFixed(0)} (${cheapest.airline})\n` +
          `• **Fastest:** ${fastest.duration} (${fastest.airline})\n` +
          `• **Average Price:** $${avgPrice.toFixed(0)}\n\n` +
          `Would you like me to find the best deal, fastest flight, or compare all options?`
      }
    } else {
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = "Hello! 👋 I'm here to help you find the perfect flight. Start by searching for flights above, and I'll analyze all the options to find you the best deals!"
      } else if (lowerMessage.includes('help')) {
        response = "I can help you with:\n\n" +
          "✈️ **Finding cheapest flights** - I'll analyze all options\n" +
          "📊 **Price trend analysis** - Know when to book\n" +
          "⚡ **Fastest routes** - Get there quicker\n" +
          "🔔 **Booking recommendations** - Based on real-time data\n\n" +
          "Search for flights first, and I'll provide personalized insights!"
      } else {
        response = "I'd love to help! Please search for flights first using the form above, and I'll analyze all the options to find you the best deals, track price trends, and give personalized recommendations. 🔍"
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

  const handleSuggestion = (suggestion) => {
    setInput(suggestion)
    handleSend()
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
                      Always ready to help
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
                  placeholder="Ask me about flights..."
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

