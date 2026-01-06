import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts'
import { Calendar, TrendingDown, AlertCircle, Clock, DollarSign, CalendarDays, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import './PriceChart.css'

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="chart-tooltip">
        <p className="tooltip-day">{data.dayName || label}</p>
        <p className="tooltip-date">{data.dateLabel}</p>
        <p className="tooltip-price" style={{ color: data.isBestDay ? '#10b981' : '#38bdf8' }}>
          ${payload[0].value}
          {data.isBestDay && <span className="tooltip-badge">Best Price!</span>}
        </p>
        {data.isWeekend && <p className="tooltip-note">⚠️ Weekend pricing</p>}
      </div>
    )
  }
  return null
}

const CompareTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip">
        <p className="tooltip-day">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="tooltip-price" style={{ color: entry.color }}>
            {entry.name}: ${entry.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

function PriceChart({ flights, selectedFlight }) {
  const [activeTab, setActiveTab] = useState('forecast')
  
  // Get the flight to display (selected or cheapest)
  const displayFlight = selectedFlight || flights[0]
  
  // Get weekly forecast data for chart
  const getWeeklyChartData = () => {
    if (!displayFlight?.weeklyForecast) return []
    return displayFlight.weeklyForecast.map(day => ({
      ...day,
      label: day.shortDay,
    }))
  }
  
  // Get comparison data for top 3 flights
  const getCompareData = () => {
    const topFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
    if (topFlights.length === 0 || !topFlights[0].weeklyForecast) return []
    
    return topFlights[0].weeklyForecast.map((day, dayIndex) => {
      const dataPoint = { 
        label: day.shortDay,
        dateLabel: day.dateLabel,
      }
      topFlights.forEach((flight, flightIndex) => {
        if (flight.weeklyForecast && flight.weeklyForecast[dayIndex]) {
          dataPoint[`flight${flightIndex}`] = flight.weeklyForecast[dayIndex].price
          dataPoint[`name${flightIndex}`] = flight.airline
        }
      })
      return dataPoint
    })
  }

  const chartData = activeTab === 'forecast' ? getWeeklyChartData() : getCompareData()
  const topFlights = [...flights].sort((a, b) => a.price - b.price).slice(0, 3)
  const colors = ['#38bdf8', '#818cf8', '#c084fc']
  
  // Calculate price stats from weekly forecast
  const forecast = displayFlight?.weeklyForecast || []
  const forecastPrices = forecast.map(d => d.price)
  const minPrice = forecastPrices.length > 0 ? Math.min(...forecastPrices) : 0
  const maxPrice = forecastPrices.length > 0 ? Math.max(...forecastPrices) : 0
  const avgPrice = forecastPrices.length > 0 ? forecastPrices.reduce((a, b) => a + b, 0) / forecastPrices.length : 0
  
  // Find best booking day
  const bestDay = forecast.find(d => d.isBestDay)
  const todayPrice = forecast[0]?.price || 0
  const savings = todayPrice - (bestDay?.price || todayPrice)
  
  // Get recommendation based on forecast
  const getRecommendation = () => {
    if (!bestDay) return { status: 'neutral', message: 'Loading forecast data...' }
    
    if (bestDay.day === 0) {
      return { 
        status: 'buy', 
        message: `Today has the best price at $${bestDay.price}! Book now.` 
      }
    } else if (bestDay.day === 1) {
      return { 
        status: 'wait', 
        message: `Wait until tomorrow to save $${savings}!` 
      }
    } else {
      return { 
        status: 'wait', 
        message: `Best price on ${bestDay.dateLabel} - save $${savings} (${Math.round((savings / todayPrice) * 100)}% off)` 
      }
    }
  }
  
  const recommendation = getRecommendation()

  return (
    <div className="price-chart-container">
      <div className="chart-header">
        <h3 className="chart-title">
          <CalendarDays size={20} />
          7-Day Price Forecast
        </h3>
        <div className="forecast-indicator">
          <Calendar size={14} />
          Weekly View
        </div>
      </div>

      <div className="chart-tabs">
        <button 
          className={`chart-tab ${activeTab === 'forecast' ? 'active' : ''}`}
          onClick={() => setActiveTab('forecast')}
        >
          <Calendar size={14} />
          Weekly Forecast
        </button>
        <button 
          className={`chart-tab ${activeTab === 'compare' ? 'active' : ''}`}
          onClick={() => setActiveTab('compare')}
        >
          <TrendingDown size={14} />
          Compare Flights
        </button>
      </div>

      <div className="chart-area">
        {activeTab === 'forecast' ? (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.8}/>
                </linearGradient>
                <linearGradient id="bestBarGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                  <stop offset="100%" stopColor="#059669" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" vertical={false} />
              <XAxis 
                dataKey="label" 
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={[minPrice - 30, maxPrice + 30]}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.1)' }} />
              <Bar 
                dataKey="price" 
                radius={[6, 6, 0, 0]}
                maxBarSize={45}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isBestDay ? 'url(#bestBarGradient)' : 'url(#barGradient)'}
                    stroke={entry.isBestDay ? '#10b981' : 'transparent'}
                    strokeWidth={entry.isBestDay ? 2 : 0}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
              <XAxis 
                dataKey="label" 
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#64748b"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
                domain={['dataMin - 30', 'dataMax + 30']}
              />
              <Tooltip content={<CompareTooltip />} />
              {topFlights.map((flight, idx) => (
                <Line
                  key={flight.id}
                  type="monotone"
                  dataKey={`flight${idx}`}
                  stroke={colors[idx]}
                  strokeWidth={2.5}
                  dot={{ fill: colors[idx], strokeWidth: 0, r: 4 }}
                  activeDot={{ r: 6, fill: colors[idx] }}
                  name={flight.airline}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {activeTab === 'compare' && topFlights.length > 0 && (
        <div className="chart-legend">
          {topFlights.map((flight, idx) => (
            <div key={flight.id} className="legend-item">
              <span className="legend-dot" style={{ background: colors[idx] }}></span>
              <span className="legend-name">{flight.airline}</span>
              <span className="legend-price">${flight.price}</span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'forecast' && bestDay && (
        <motion.div 
          className="best-day-card"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="best-day-icon">
            <Sparkles size={18} />
          </div>
          <div className="best-day-content">
            <span className="best-day-label">Best Day to Book</span>
            <span className="best-day-value">{bestDay.dateLabel}</span>
          </div>
          <div className="best-day-price">
            <span className="price-value">${bestDay.price}</span>
            {savings > 0 && (
              <span className="savings-badge">Save ${savings}</span>
            )}
          </div>
        </motion.div>
      )}

      <div className="price-stats">
        <div className="stat-item">
          <DollarSign size={16} />
          <div className="stat-content">
            <span className="stat-label">Lowest</span>
            <span className="stat-value price-down">${minPrice}</span>
          </div>
        </div>
        <div className="stat-item">
          <Clock size={16} />
          <div className="stat-content">
            <span className="stat-label">Average</span>
            <span className="stat-value">${Math.round(avgPrice)}</span>
          </div>
        </div>
        <div className="stat-item">
          <AlertCircle size={16} />
          <div className="stat-content">
            <span className="stat-label">Highest</span>
            <span className="stat-value price-up">${maxPrice}</span>
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
          {recommendation.status === 'wait' && '📅'}
          {recommendation.status === 'neutral' && '📊'}
        </div>
        <div className="recommendation-content">
          <span className="recommendation-title">
            {recommendation.status === 'buy' && 'Book Today!'}
            {recommendation.status === 'wait' && 'Wait for Better Price'}
            {recommendation.status === 'neutral' && 'Analyzing...'}
          </span>
          <span className="recommendation-message">{recommendation.message}</span>
        </div>
      </motion.div>

      {selectedFlight && (
        <div className="selected-flight-info">
          <span className="info-label">Viewing forecast for:</span>
          <span className="info-value">{selectedFlight.airline} {selectedFlight.flightNumber}</span>
        </div>
      )}
    </div>
  )
}

export default PriceChart
