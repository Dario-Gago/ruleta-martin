import React, { useState, useRef } from 'react'
import './App.css'
import Logo from '../Logo.png'
import options from './opciones.json'

const App = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)

  const spinWheel = () => {
    if (isSpinning) return
    
    setIsSpinning(true)
    const randomRotation = Math.floor(Math.random() * 360) + 720 + rotation
    setRotation(randomRotation)
    
    setTimeout(() => {
      setIsSpinning(false)
    }, 4000)
  }

  const lights = Array.from({ length: 12 })

  return (
    <div className="wheel-container">
      <h1 className="title">🎰 Ruleta de Martín🎰</h1>
      <div className="wheel-wrapper">
        <div className="wheel-ring">
          {lights.map((_, i) => (
            <span
              key={i}
              className="light"
              style={{ transform: `rotate(${i * 30}deg) translateY(-186px)` }}
            />
          ))}
        </div>
        <div 
          ref={wheelRef}
          className="wheel"
          style={{ 
            transform: `rotate(${rotation}deg)`,
            transition: isSpinning ? 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none'
          }}
        >
          <svg viewBox="0 0 350 350" className="wheel-svg">
            {options.map((option, index) => {
              const angle = (index * 90) * (Math.PI / 180)
              const nextAngle = ((index + 1) * 90) * (Math.PI / 180)
              const x1 = 175 + 175 * Math.cos(angle)
              const y1 = 175 + 175 * Math.sin(angle)
              const x2 = 175 + 175 * Math.cos(nextAngle)
              const y2 = 175 + 175 * Math.sin(nextAngle)
              const textAngle = ((index * 90) + 45) * (Math.PI / 180)
              const textX = 175 + 115 * Math.cos(textAngle)
              const textY = 175 + 115 * Math.sin(textAngle)
              const rotation = ((index * 90) + 45) + 90
              
              return (
                <g key={index}>
                  <path
                    d={`M 175 175 L ${x1} ${y1} A 175 175 0 0 1 ${x2} ${y2} Z`}
                    fill={option.color}
                    stroke="rgba(255,255,255,0.35)"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="17"
                    fontWeight="700"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${rotation}, ${textX}, ${textY})`}
                    style={{
                      textShadow: '0 2px 4px rgba(0,0,0,0.6)',
                      letterSpacing: '0.5px'
                    }}
                  >
                    {option.label}
                  </text>
                </g>
              )
            })}
          </svg>
          <div className="wheel-gloss"></div>
        </div>
        <div className="wheel-center">
          <img src={Logo} alt="Logo" className="center-logo" />
        </div>
        <div className="wheel-pointer"></div>
      </div>
      <button 
        className="spin-button"
        onClick={spinWheel}
        disabled={isSpinning}
      >
        {isSpinning ? '🎲 Girando...' : '✨ Girar Ruleta ✨'}
      </button>
    </div>
  )
}

export default App