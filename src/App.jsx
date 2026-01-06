import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from './components/Header'
import SearchPanel from './components/SearchPanel'
import FlightResults from './components/FlightResults'
import PriceChart from './components/PriceChart'
import AIAssistant from './components/AIAssistant'
import { generateFlights } from './utils/flightData'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [searchParams, setSearchParams] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Handle flight search
  const handleSearch = async (params) => {
    setLoading(true)
    setSearchParams(params)
    setSelectedFlight(null)
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const generatedFlights = generateFlights(params)
    setFlights(generatedFlights)
    setLoading(false)
    setLastUpdate(new Date())
  }

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
