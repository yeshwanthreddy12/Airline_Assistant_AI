import { Plane, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import './Header.css'

function Header({ lastUpdate, hasData }) {
  return (
    <header className="header">
      <div className="header-container">
        <motion.div 
          className="logo"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo-icon">
            <Plane size={24} />
          </div>
          <div className="logo-text">
            <span className="logo-name">SkyPulse</span>
            <span className="logo-tagline">AI Flight Assistant</span>
          </div>
        </motion.div>

        <motion.div 
          className="header-right"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {hasData && (
            <div className="live-status">
              <span className="live-indicator">Live</span>
              <span className="update-time">
                Updated {format(lastUpdate, 'HH:mm:ss')}
              </span>
            </div>
          )}
          
          <button className="ai-badge">
            <Sparkles size={14} />
            <span>AI Powered</span>
          </button>
        </motion.div>
      </div>
    </header>
  )
}

export default Header

