'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const DiamondBackground = () => {
  const [diamonds, setDiamonds] = useState<
    Array<{ x: number; y: number; scale: number; duration: number }>
  >([])

  useEffect(() => {
    const newDiamonds = Array(30)
      .fill(null)
      .map(() => ({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 100,
        scale: Math.random() * 0.6 + 0.4,
        duration: Math.random() * 20 + 10,
      }))
    setDiamonds(newDiamonds)
  }, [])

  if (diamonds.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {diamonds.map((d, i) => (
        <motion.div
          key={i}
          className="absolute"
          initial={{
            x: d.x,
            y: d.y,
            scale: d.scale,
          }}
          animate={{
            y: -120,
            transition: {
              duration: d.duration,
              repeat: Infinity,
              ease: 'linear',
            },
          }}
        >
          {/* Kim cương */}
          <div className="diamond" />
        </motion.div>
      ))}
    </div>
  )
}

export default DiamondBackground
