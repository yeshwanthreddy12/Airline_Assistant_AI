import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { TrendingDown, AlertCircle, Clock, DollarSign } from 'lucide-react'
import { format } from 'date-fns'
import { motion } from 'framer-motion'
import './PriceChart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-time">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-price" style={{ color: entry.color }}>
            ${entry.value.toFixed(0)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PriceChart({ flights, priceHistory, selectedFlight }) {
  const [activeTab, setActiveTab] = useState('trends')
  
  // Get data for the chart
  const getChartData = () => {
    if (selectedFlight && priceHistory[selectedFlight.id]) {
      return priceHistory[selectedFlight.id].map(point => ({
        time: format(new Date(point.time), 'HH:mm:ss'),
        price: point.price
      }))
    }
    
    // If no flight selected, show top 3 cheapest flights
    const topFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
    
    if (topFlights.length === 0) return []
    
    // Find the maximum length of history
    const maxLength = Math.max(...topFlights.map(f => priceHistory[f.id]?.length || 0))
    
    return Array.from({ length: maxLength }, (_, i) => {
      const dataPoint = { time: '' }
      topFlights.forEach((flight, idx) => {
        const history = priceHistory[flight.id]
        if (history && history[i]) {
          dataPoint.time = format(new Date(history[i].time), 'HH:mm:ss')
          dataPoint[`flight${idx}`] = history[i].price
          dataPoint[`name${idx}`] = flight.airline
        }
      })
      return dataPoint
    })
  }

  const chartData = getChartData()
  const topFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
  const colors = ['#38bdf8', '#818cf8', '#c084fc']
  
  // Calculate price stats
  const allPrices = flights.map(f => f.price)
  const avgPrice = allPrices.reduce((a, b) => a + b, 0) / allPrices.length
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  
  // Get price recommendation
  const getPriceRecommendation = () => {
    const lowestFlight = flights.reduce((a, b) => a.price < b.price ? a : b)
    const history = priceHistory[lowestFlight.id] || []
    
    if (history.length < 3) return { status: 'neutral', message: 'Gathering price data...' }
    
    const recent = history.slice(-3)
    const trend = recent[2].price - recent[0].price
    
    if (trend < -5) return { status: 'buy', message: 'Prices are dropping! Good time to book.' }
    if (trend > 5) return { status: 'wait', message: 'Prices rising. Consider setting an alert.' }
    return { status: 'neutral', message: 'Prices are stable. Normal booking conditions.' }
  }
  
  const recommendation = getPriceRecommendation()

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          <TrendingDown size={20} />
          Price Trends
        </h3>
        <div className="live-indicator">Live</div>
      </div>

      <div className="chart-tabs">
        <button 
          className={`chart-tab ${activeTab === 'trends' ? 'active' : ''}`}
          onClick={() => setActiveTab('trends')}
        >
          Live Trends
        </button>
        <button 
          className={`chart-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          Compare
        </button>
      </div>

      <div className="chart-area">
        {selectedFlight ? (
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#38bdf8"
                strokeWidth={2}
                fill="url(#priceGradient)"
                dot={false}
                activeDot={{ r: 6, fill: '#38bdf8' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={['dataMin - 20', 'dataMax + 20']}
              />
              <Tooltip content={<CustomTooltip />} />
              {topFlights.map((flight, idx) => (
                <Line
                  key={flight.id}
                  type="monotone"
                  dataKey={`flight${idx}`}
                  stroke={colors[idx]}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                  name={flight.airline}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {!selectedFlight && topFlights.length > 0 && (
        <div className="chart-legend">
          {topFlights.map((flight, idx) => (
            <div key={flight.id} className="legend-item">
              <span className="legend-dot" style={{ background: colors[idx] }}></span>
              <span className="legend-name">{flight.airline}</span>
              <span className="legend-price">${flight.price.toFixed(0)}</span>
            </div>
          ))}
        </div>
      )}

      <div className="price-stats">
        <div className="stat-item">
          <DollarSign size={16} />
          <div className="stat-content">
            <span className="stat-label">Lowest</span>
            <span className="stat-value price-down">${minPrice.toFixed(0)}</span>
          </div>
        </div>
        <div className="stat-item">
          <Clock size={16} />
          <div className="stat-content">
            <span className="stat-label">Average</span>
            <span className="stat-value">${avgPrice.toFixed(0)}</span>
          </div>
        </div>
        <div className="stat-item">
          <AlertCircle size={16} />
          <div className="stat-content">
            <span className="stat-label">Highest</span>
            <span className="stat-value price-up">${maxPrice.toFixed(0)}</span>
          </div>
        </div>
      </div>

      <motion.div 
        className={`recommendation-box ${recommendation.status}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        key={recommendation.message}
      >
        <div className="recommendation-icon">
          {recommendation.status === 'buy' && '🎉'}
          {recommendation.status === 'wait' && '⏳'}
          {recommendation.status === 'neutral' && '📊'}
        </div>
        <div className="recommendation-content">
          <span className="recommendation-title">
            {recommendation.status === 'buy' && 'Good Time to Book!'}
            {recommendation.status === 'wait' && 'Consider Waiting'}
            {recommendation.status === 'neutral' && 'Market Analysis'}
          </span>
          <span className="recommendation-message">{recommendation.message}</span>
        </div>
      </motion.div>

      {selectedFlight && (
        <div className="selected-flight-info">
          <span className="info-label">Tracking:</span>
          <span className="info-value">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
        </div>
      )}
    </div>
  )
}

export default PriceChart

