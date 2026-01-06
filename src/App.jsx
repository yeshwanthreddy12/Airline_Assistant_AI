import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import SearchPanel from './components/SearchPanel'
import FlightResults from './components/FlightResults'
import PriceChart from './components/PriceChart'
import AIAssistant from './components/AIAssistant'
import { generateFlights, simulatePriceChanges } from './utils/flightData'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [searchParams, setSearchParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [priceHistory, setPriceHistory] = useState({})
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Handle flight search
  const handleSearch = async (params) => {
    setLoading(true)
    setSearchParams(params)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const generatedFlights = generateFlights(params)
    setFlights(generatedFlights)
    
    // Initialize price history for each flight
    const initialHistory = {}
    generatedFlights.forEach(flight => {
      initialHistory[flight.id] = [{
        time: new Date(),
        price: flight.price
      }]
    })
    setPriceHistory(initialHistory)
    setLoading(false)
    setLastUpdate(new Date())
  }

  // Real-time price updates
  useEffect(() => {
    if (flights.length === 0) return

    const interval = setInterval(() => {
      setFlights(prevFlights => {
        const updatedFlights = simulatePriceChanges(prevFlights)
        
        // Update price history
        setPriceHistory(prev => {
          const newHistory = { ...prev }
          updatedFlights.forEach(flight => {
            if (newHistory[flight.id]) {
              newHistory[flight.id] = [
                ...newHistory[flight.id].slice(-29), // Keep last 30 data points
                { time: new Date(), price: flight.price }
              ]
            }
          })
          return newHistory
        })
        
        return updatedFlights
      })
      setLastUpdate(new Date())
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [flights.length])

  return (
    <div className="app">
      <Header lastUpdate={lastUpdate} hasData={flights.length > 0} />
      
      <main className="main-content">
        <motion.div 
          className="search-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <SearchPanel onSearch={handleSearch} loading={loading} />
        </motion.div>

        <AnimatePresence mode="wait">
          {(loading || flights.length > 0) && (
            <motion.div 
              className="results-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="results-grid">
                <div className="flights-column">
                  <FlightResults 
                    flights={flights} 
                    loading={loading}
                    selectedFlight={selectedFlight}
                    onSelectFlight={setSelectedFlight}
                    priceHistory={priceHistory}
                  />
                </div>
                
                {flights.length > 0 && !loading && (
                  <motion.div 
                    className="chart-column"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <PriceChart 
                      flights={flights}
                      priceHistory={priceHistory}
                      selectedFlight={selectedFlight}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AIAssistant 
        flights={flights}
        searchParams={searchParams}
        onSearch={handleSearch}
      />
    </div>
  )
}

export default App
