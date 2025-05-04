import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"

const NavigationProgress = () => {
  const [isAnimating, setIsAnimating] = useState(false)
  const location = useLocation()

  useEffect(() => {
    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [location])

  if (!isAnimating) return null

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-orange-500 z-50"
      initial={{ width: "0%" }}
      animate={{ width: "100%" }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  )
}

export default NavigationProgress
