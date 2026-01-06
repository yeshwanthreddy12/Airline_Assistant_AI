import { addDays, format } from 'date-fns'

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

// Day of week pricing factors (weekends are more expensive)
const dayOfWeekFactors = {
  0: 1.15, // Sunday
  1: 0.85, // Monday (cheapest)
  2: 0.90, // Tuesday
  3: 0.92, // Wednesday
  4: 0.95, // Thursday
  5: 1.10, // Friday
  6: 1.20, // Saturday (most expensive)
}

// How far in advance affects pricing (closer = more expensive)
const advanceBookingFactors = [
  1.25,  // Day 0 (today) - last minute premium
  1.15,  // Day 1 (tomorrow)
  1.05,  // Day 2
  1.00,  // Day 3
  0.95,  // Day 4
  0.92,  // Day 5
  0.90,  // Day 6 (best price - sweet spot)
]

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

// Generate 7-day price forecast for a flight
export const generateWeeklyPriceForecast = (basePrice, flightId) => {
  const forecast = []
  const today = new Date()
  
  // Use flight ID to create consistent but varied patterns per flight
  const flightSeed = flightId.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
  
  for (let day = 0; day < 7; day++) {
    const date = addDays(today, day)
    const dayOfWeek = date.getDay()
    
    // Calculate price for this day
    const dayFactor = dayOfWeekFactors[dayOfWeek]
    const advanceFactor = advanceBookingFactors[day]
    
    // Add some flight-specific variation
    const flightVariation = 0.95 + (((flightSeed + day * 17) % 20) / 100)
    
    // Add small random fluctuation for realism
    const randomFactor = 0.98 + (Math.random() * 0.04)
    
    const price = Math.round(basePrice * dayFactor * advanceFactor * flightVariation * randomFactor)
    
    forecast.push({
      day,
      date: date,
      dateLabel: day === 0 ? 'Today' : day === 1 ? 'Tomorrow' : format(date, 'EEE, MMM d'),
      dayName: format(date, 'EEEE'),
      shortDay: format(date, 'EEE'),
      price: Math.max(99, Math.min(999, price)),
      isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      isBestDay: false,
    })
  }
  
  // Mark the cheapest day
  const minPrice = Math.min(...forecast.map(f => f.price))
  forecast.forEach(f => {
    if (f.price === minPrice) f.isBestDay = true
  })
  
  return forecast
}

// Get the best day to book from forecast
export const getBestBookingDay = (forecast) => {
  const bestDay = forecast.reduce((min, day) => day.price < min.price ? day : min, forecast[0])
  const todayPrice = forecast[0].price
  const savings = todayPrice - bestDay.price
  
  return {
    ...bestDay,
    savings,
    savingsPercent: Math.round((savings / todayPrice) * 100),
  }
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
    
    const flightId = `flight-${i}-${Date.now()}`
    
    flights.push({
      id: flightId,
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
      },
      // Add weekly price forecast
      weeklyForecast: generateWeeklyPriceForecast(Math.round(price), flightId)
    })
  }
  
  // Mark the cheapest as best deal
  const cheapest = flights.reduce((min, f) => f.price < min.price ? f : min, flights[0])
  cheapest.isBestDeal = true
  
  // Sort by price initially
  return flights.sort((a, b) => a.price - b.price)
}

// Legacy function - now returns flights with updated forecasts
export const simulatePriceChanges = (flights) => {
  return flights.map(flight => {
    // Regenerate forecast with slight variations to simulate market changes
    const newForecast = generateWeeklyPriceForecast(flight.price, flight.id)
    
    return {
      ...flight,
      weeklyForecast: newForecast,
      previousPrice: flight.price
    }
  })
}
