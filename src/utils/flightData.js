const airlines = [
  { name: 'Delta Air Lines', color: '#0033A0', code: 'DL' },
  { name: 'United Airlines', color: '#0066CC', code: 'UA' },
  { name: 'American Airlines', color: '#CC0000', code: 'AA' },
  { name: 'Southwest Airlines', color: '#FF6600', code: 'WN' },
  { name: 'JetBlue Airways', color: '#0033CC', code: 'B6' },
  { name: 'Alaska Airlines', color: '#006B5A', code: 'AS' },
  { name: 'Spirit Airlines', color: '#FFD700', code: 'NK' },
  { name: 'Frontier Airlines', color: '#008080', code: 'F9' },
]

const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First Class']

const generateFlightNumber = (code) => {
  return `${code}${Math.floor(Math.random() * 9000) + 1000}`
}

const generateTime = (baseHour = 6) => {
  const hour = baseHour + Math.floor(Math.random() * 16)
  const minute = Math.floor(Math.random() * 12) * 5
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
}

const addMinutesToTime = (time, minutes) => {
  const [hours, mins] = time.split(':').map(Number)
  const totalMinutes = hours * 60 + mins + minutes
  const newHours = Math.floor(totalMinutes / 60) % 24
  const newMins = totalMinutes % 60
  return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`
}

const formatDuration = (minutes) => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return `${hours}h ${mins}m`
}

export const generateFlights = (params) => {
  const { from, to } = params
  const numFlights = 8 + Math.floor(Math.random() * 5)
  const flights = []
  
  // Base price varies by route (simulated)
  const routeHash = (from + to).split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  const basePrice = 150 + (routeHash % 300)
  
  for (let i = 0; i < numFlights; i++) {
    const airline = airlines[Math.floor(Math.random() * airlines.length)]
    const departureTime = generateTime(5 + i)
    const durationMinutes = 120 + Math.floor(Math.random() * 300)
    const stops = Math.random() > 0.6 ? Math.floor(Math.random() * 2) + 1 : 0
    const actualDuration = durationMinutes + (stops * 45) // Add layover time
    
    // Price factors
    const timeOfDayFactor = departureTime.startsWith('0') ? 0.85 : 
                            departureTime.startsWith('1') && parseInt(departureTime) < 1200 ? 1.1 : 1
    const stopsFactor = stops === 0 ? 1.15 : stops === 1 ? 1 : 0.9
    const randomFactor = 0.85 + Math.random() * 0.3
    
    const price = basePrice * timeOfDayFactor * stopsFactor * randomFactor
    const cabinClass = cabinClasses[Math.floor(Math.random() * 2)]
    
    flights.push({
      id: `flight-${i}-${Date.now()}`,
      airline: airline.name,
      airlineCode: airline.code,
      airlineColor: airline.color,
      flightNumber: generateFlightNumber(airline.code),
      from,
      to,
      departureTime,
      arrivalTime: addMinutesToTime(departureTime, actualDuration),
      duration: formatDuration(actualDuration),
      durationMinutes: actualDuration,
      stops,
      price: Math.round(price),
      cabinClass,
      seatsLeft: Math.floor(Math.random() * 9) + 1,
      isBestDeal: false,
      amenities: {
        wifi: Math.random() > 0.3,
        food: Math.random() > 0.4,
        power: Math.random() > 0.3,
        legroom: Math.random() > 0.6
      }
    })
  }
  
  // Mark the cheapest as best deal
  const cheapest = flights.reduce((min, f) => f.price < min.price ? f : min, flights[0])
  cheapest.isBestDeal = true
  
  // Sort by price initially
  return flights.sort((a, b) => a.price - b.price)
}

export const simulatePriceChanges = (flights) => {
  return flights.map(flight => {
    // Random price fluctuation (-5% to +5%)
    const change = (Math.random() - 0.5) * 0.1 * flight.price
    let newPrice = flight.price + change
    
    // Keep prices within reasonable bounds
    newPrice = Math.max(99, Math.min(999, newPrice))
    
    // Occasionally reduce seats
    let seatsLeft = flight.seatsLeft
    if (Math.random() > 0.95 && seatsLeft > 1) {
      seatsLeft -= 1
    }
    
    return {
      ...flight,
      price: Math.round(newPrice),
      seatsLeft,
      previousPrice: flight.price
    }
  })
}

