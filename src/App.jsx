import React, { useState, useRef, useEffect } from 'react'
import './App.css'
import Logo from '../Logo.png'
import options from './opciones.json'

const STORAGE_KEY = 'ruleta_martin_giros'

const App = () => {
  const [rotation, setRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [spinCount, setSpinCount] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [result, setResult] = useState(null)
  const wheelRef = useRef(null)

  useEffect(() => {
    const savedSpins = localStorage.getItem(STORAGE_KEY)
    if (savedSpins) {
      const count = parseInt(savedSpins, 10)
      setSpinCount(count)
      if (count >= 2) {
        setIsBlocked(true)
      }
    }
  }, [])

  const spinWheel = () => {
    if (isSpinning || isBlocked) return
    
    setIsSpinning(true)
    
    // En coordenadas SVG el puntero (arriba) está en 270°
    // Un punto en ángulo θ tras rotar R grados queda en θ + R
    // Queremos θ + R ≡ 270 (mod 360) → R = 270 - θ
    let segmentMidAngle
    if (spinCount === 0) {
      // Primer giro: forzar "Nada ❌" (índice 2 de 4, segmentos de 90°)
      // Punto medio del segmento 2: 180° + 45° = 225°
      segmentMidAngle = 225
    } else {
      // Segundo giro: aleatorio entre los segmentos que NO son "Nada ❌"
      const allowedIndexes = options
        .map((opt, i) => (opt.label !== 'Nada ❌' ? i : null))
        .filter(i => i !== null)
      const randomIndex = allowedIndexes[Math.floor(Math.random() * allowedIndexes.length)]
      segmentMidAngle = (randomIndex * 90) + 45
    }
    
    const desiredMod = (270 - segmentMidAngle + 360) % 360
    const currentMod = ((rotation % 360) + 360) % 360
    const targetRotation = rotation + 720 + ((desiredMod - currentMod + 360) % 360)
    
    setRotation(targetRotation)
    
    setTimeout(() => {
      setIsSpinning(false)
      const newCount = spinCount + 1
      setSpinCount(newCount)
      localStorage.setItem(STORAGE_KEY, newCount.toString())
      
      // Calcular qué opción ganó
      const finalRotation = targetRotation % 360
      const segmentAngle = 360 / options.length
      // El puntero está en 270°, necesitamos encontrar qué segmento contiene ese ángulo
      // Deshacemos la rotación: 270 - finalRotation
      const pointerAngle = (270 - finalRotation + 360) % 360
      const winningIndex = Math.floor(pointerAngle / segmentAngle)
      setResult(options[winningIndex])
      setShowResult(true)
      
      if (newCount >= 2) {
        setIsBlocked(true)
      }
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
              const segmentAngle = 360 / options.length
              const angle = (index * segmentAngle) * (Math.PI / 180)
              const nextAngle = ((index + 1) * segmentAngle) * (Math.PI / 180)
              const x1 = 175 + 175 * Math.cos(angle)
              const y1 = 175 + 175 * Math.sin(angle)
              const x2 = 175 + 175 * Math.cos(nextAngle)
              const y2 = 175 + 175 * Math.sin(nextAngle)
              const textAngle = ((index * segmentAngle) + segmentAngle / 2) * (Math.PI / 180)
              const textX = 175 + 115 * Math.cos(textAngle)
              const textY = 175 + 115 * Math.sin(textAngle)
              const rotation = ((index * segmentAngle) + segmentAngle / 2) + 90
              
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
        disabled={isSpinning || isBlocked}
      >
        {isBlocked 
          ? '🚫 Ya no puedes girar' 
          : isSpinning 
            ? '🎲 Girando...' 
            : spinCount === 0 
              ? '✨ Primera oportunidad ✨' 
              : '✨ Segunda oportunidad ✨'}
      </button>
      {showResult && result && (
        <div className="result-overlay" onClick={() => setShowResult(false)}>
          <div className="result-modal" onClick={(e) => e.stopPropagation()}>
            <div className="result-icon">🎉</div>
            <h2 className="result-title">¡Resultado!</h2>
            <p className="result-text" style={{ color: result.color }}>
              {result.label}
            </p>
            <button 
              className="result-button"
              onClick={() => setShowResult(false)}
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App