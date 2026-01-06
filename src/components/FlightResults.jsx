import { motion } from 'framer-motion'
import { Plane, Clock, TrendingUp, TrendingDown, Minus, Sparkles, Briefcase, Wifi, Coffee, Zap } from 'lucide-react'
import './FlightResults.css'

function FlightCard({ flight, isSelected, onClick, priceHistory }) {
  const history = priceHistory?.[flight.id] || []
  const previousPrice = history.length > 1 ? history[history.length - 2].price : flight.price
  const priceChange = flight.price - previousPrice
  const priceChangePercent = ((priceChange / previousPrice) * 100).toFixed(1)
  
  const getPriceTrend = () => {
    if (priceChange > 0) return { icon: TrendingUp, class: 'price-up', label: `+$${priceChange.toFixed(0)}` }
    if (priceChange < 0) return { icon: TrendingDown, class: 'price-down', label: `-$${Math.abs(priceChange).toFixed(0)}` }
    return { icon: Minus, class: 'price-stable', label: 'Stable' }
  }
  
  const trend = getPriceTrend()
  const TrendIcon = trend.icon

  return (
    <motion.div 
      className={`flight-card ${isSelected ? 'selected' : ''} ${flight.isBestDeal ? 'best-deal' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.01, y: -2 }}
      whileTap={{ scale: 0.99 }}
      layout
    >
      {flight.isBestDeal && (
        <div className="best-deal-badge">
          <Sparkles size={12} />
          <span>Best Deal</span>
        </div>
      )}
      
      <div className="flight-card-content">
        <div className="airline-section">
          <div className="airline-logo" style={{ background: flight.airlineColor }}>
            <Plane size={18} />
          </div>
          <div className="airline-info">
            <span className="airline-name">{flight.airline}</span>
            <span className="flight-number">{flight.flightNumber}</span>
          </div>
        </div>

        <div className="flight-times">
          <div className="time-block">
            <span className="time">{flight.departureTime}</span>
            <span className="airport">{flight.from}</span>
          </div>
          
          <div className="flight-duration">
            <div className="duration-line">
              <div className="duration-dot"></div>
              <div className="duration-track"></div>
              <Plane size={14} className="duration-plane" />
              <div className="duration-track"></div>
              <div className="duration-dot"></div>
            </div>
            <div className="duration-info">
              <Clock size={12} />
              <span>{flight.duration}</span>
              {flight.stops > 0 && (
                <span className="stops">{flight.stops} stop{flight.stops > 1 ? 's' : ''}</span>
              )}
            </div>
          </div>
          
          <div className="time-block">
            <span className="time">{flight.arrivalTime}</span>
            <span className="airport">{flight.to}</span>
          </div>
        </div>

        <div className="amenities">
          {flight.amenities.wifi && <Wifi size={14} title="WiFi" />}
          {flight.amenities.food && <Coffee size={14} title="Meals" />}
          {flight.amenities.power && <Zap size={14} title="Power Outlets" />}
          {flight.amenities.legroom && <Briefcase size={14} title="Extra Legroom" />}
        </div>

        <div className="price-section">
          <div className="price-main">
            <span className="currency">$</span>
            <span className="price">{flight.price.toFixed(0)}</span>
          </div>
          <div className={`price-trend ${trend.class}`}>
            <TrendIcon size={14} />
            <span>{trend.label}</span>
          </div>
          <span className="per-person">per person</span>
        </div>
      </div>
      
      <div className="flight-footer">
        <span className="cabin-class">{flight.cabinClass}</span>
        <span className="seats-left">{flight.seatsLeft} seats left</span>
      </div>
    </motion.div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="flight-card skeleton-card">
      <div className="skeleton-content">
        <div className="skeleton skeleton-logo"></div>
        <div className="skeleton-text">
          <div className="skeleton skeleton-line"></div>
          <div className="skeleton skeleton-line short"></div>
        </div>
        <div className="skeleton skeleton-price"></div>
      </div>
    </div>
  )
}

function FlightResults({ flights, loading, selectedFlight, onSelectFlight, priceHistory }) {
  if (loading) {
    return (
      <div className="flight-results">
        <div className="results-header">
          <h2>Searching for flights...</h2>
        </div>
        <div className="flights-list">
          {[1, 2, 3, 4].map(i => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  if (flights.length === 0) {
    return null
  }

  const sortedFlights = [...flights].sort((a, b) => a.price - b.price)
  const cheapest = sortedFlights[0]
  const fastest = [...flights].sort((a, b) => a.durationMinutes - b.durationMinutes)[0]

  return (
    <div className="flight-results">
      <div className="results-header">
        <h2>
          <span className="result-count">{flights.length}</span> flights found
        </h2>
        <div className="results-summary">
          <span className="summary-item">
            Cheapest: <strong>${cheapest.price.toFixed(0)}</strong>
          </span>
          <span className="summary-item">
            Fastest: <strong>{fastest.duration}</strong>
          </span>
        </div>
      </div>

      <div className="flights-list">
        {flights.map((flight, index) => (
          <motion.div
            key={flight.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <FlightCard 
              flight={flight}
              isSelected={selectedFlight?.id === flight.id}
              onClick={() => onSelectFlight(flight)}
              priceHistory={priceHistory}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default FlightResults

