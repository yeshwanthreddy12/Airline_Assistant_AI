import { useState } from 'react'
import { Search, MapPin, Calendar, Users, ArrowRightLeft, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { format, addDays } from 'date-fns'
import './SearchPanel.css'

const popularRoutes = [
  { from: 'NYC', to: 'LAX', label: 'New York → Los Angeles' },
  { from: 'SFO', to: 'JFK', label: 'San Francisco → New York' },
  { from: 'ORD', to: 'MIA', label: 'Chicago → Miami' },
  { from: 'SEA', to: 'LAS', label: 'Seattle → Las Vegas' },
]

function SearchPanel({ onSearch, loading }) {
  const [tripType, setTripType] = useState('roundtrip')
  const [from, setFrom] = useState('NYC')
  const [to, setTo] = useState('LAX')
  const [departDate, setDepartDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd'))
  const [returnDate, setReturnDate] = useState(format(addDays(new Date(), 14), 'yyyy-MM-dd'))
  const [passengers, setPassengers] = useState(1)

  const handleSwapLocations = () => {
    const temp = from
    setFrom(to)
    setTo(temp)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    onSearch({
      tripType,
      from,
      to,
      departDate,
      returnDate: tripType === 'roundtrip' ? returnDate : null,
      passengers
    })
  }

  const handleQuickRoute = (route) => {
    setFrom(route.from)
    setTo(route.to)
  }

  return (
    <div className="search-panel">
      <div className="search-header">
        <h1 className="search-title">
          <span className="gradient-text">Find Your Perfect Flight</span>
        </h1>
        <p className="search-subtitle">
          Real-time prices • AI-powered recommendations • Price alerts
        </p>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <div className="trip-type-tabs">
          <button 
            type="button"
            className={`trip-tab ${tripType === 'roundtrip' ? 'active' : ''}`}
            onClick={() => setTripType('roundtrip')}
          >
            Round Trip
          </button>
          <button 
            type="button"
            className={`trip-tab ${tripType === 'oneway' ? 'active' : ''}`}
            onClick={() => setTripType('oneway')}
          >
            One Way
          </button>
        </div>

        <div className="search-fields">
          <div className="location-fields">
            <div className="field-group">
              <label className="field-label">
                <MapPin size={16} />
                From
              </label>
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value.toUpperCase())}
                placeholder="City or Airport"
                className="field-input location-input"
                maxLength={3}
              />
            </div>

            <button 
              type="button" 
              className="swap-button"
              onClick={handleSwapLocations}
            >
              <ArrowRightLeft size={18} />
            </button>

            <div className="field-group">
              <label className="field-label">
                <MapPin size={16} />
                To
              </label>
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value.toUpperCase())}
                placeholder="City or Airport"
                className="field-input location-input"
                maxLength={3}
              />
            </div>
          </div>

          <div className="date-fields">
            <div className="field-group">
              <label className="field-label">
                <Calendar size={16} />
                Departure
              </label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="field-input"
                min={format(new Date(), 'yyyy-MM-dd')}
              />
            </div>

            {tripType === 'roundtrip' && (
              <div className="field-group">
                <label className="field-label">
                  <Calendar size={16} />
                  Return
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="field-input"
                  min={departDate}
                />
              </div>
            )}

            <div className="field-group passengers-field">
              <label className="field-label">
                <Users size={16} />
                Passengers
              </label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="field-input"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Passenger' : 'Passengers'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <motion.button 
            type="submit" 
            className="search-button"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Searching...
              </>
            ) : (
              <>
                <Search size={20} />
                Search Flights
              </>
            )}
          </motion.button>
        </div>
      </form>

      <div className="quick-routes">
        <span className="quick-label">Popular routes:</span>
        <div className="route-chips">
          {popularRoutes.map((route, idx) => (
            <button
              key={idx}
              type="button"
              className="route-chip"
              onClick={() => handleQuickRoute(route)}
            >
              {route.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SearchPanel

