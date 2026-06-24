import { useMemo } from 'react'

interface Particle {
  id: number
  x: number
  size: number
  color: string
  duration: number
  delay: number
  opacity: number
}

const COLORS = ['#ff00aa', '#a000ff', '#00f5ff', '#ff6a00', '#00ff88', '#ffe600']

export default function ParticleBackground() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: Math.random() * 4 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      duration: Math.random() * 12 + 8,
      delay: Math.random() * 8,
      opacity: Math.random() * 0.5 + 0.2,
    }))
  }, [])

  return (
    <div className="particle-bg">
      {/* Background gradient orbs */}
      <div
        className="absolute rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{
          width: '60vw',
          height: '60vw',
          top: '-20vw',
          left: '-20vw',
          background: 'radial-gradient(circle, #ff00aa, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{
          width: '50vw',
          height: '50vw',
          bottom: '-15vw',
          right: '-15vw',
          background: 'radial-gradient(circle, #a000ff, transparent 70%)',
        }}
      />
      <div
        className="absolute rounded-full blur-3xl opacity-6 pointer-events-none"
        style={{
          width: '40vw',
          height: '40vw',
          top: '40%',
          left: '30%',
          background: 'radial-gradient(circle, #00f5ff, transparent 70%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 0, 170, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 170, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            bottom: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
            opacity: p.opacity,
            animation: `particle ${p.duration}s ${p.delay}s linear infinite`,
          }}
        />
      ))}
    </div>
  )
}
