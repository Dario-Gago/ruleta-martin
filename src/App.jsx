import React, { useState, useRef } from 'react'
import './App.css'
import Logo from '../Logo.png'

const App = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef(null)

  const options = [
    { label: 'Opción 1', color: '#d92332' },
    { label: 'Opción 2', color: '#1565d8' },
    { label: 'Opción 3', color: '#d92332' },
    { label: 'Opción 4', color: '#1565d8' }
  ]

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
          {options.map((option, index) => (
            <div 
              key={index}
              className="wheel-segment"
              style={{
                backgroundColor: option.color,
                transform: `rotate(${index * 90}deg) skewY(-45deg)`
              }}
            >
              <span 
                className="segment-label"
                style={{ transform: `skewY(45deg) rotate(45deg)` }}
              >
                {option.label}
              </span>
            </div>
          ))}
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