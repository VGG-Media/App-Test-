import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
  onSetCurrentPlayer: (index: number) => void
}

const WHEEL_GAMES = [
  { label: 'Wahrheit', emoji: '💭', screen: 'truthordare' as Screen, color: '#00f5ff' },
  { label: 'Pflicht', emoji: '⚡', screen: 'truthordare' as Screen, color: '#ff00aa' },
  { label: 'Hot Opinion', emoji: '🔥', screen: 'hottakes' as Screen, color: '#ff6a00' },
  { label: 'Challenge', emoji: '🎯', screen: 'challenge' as Screen, color: '#00ff88' },
  { label: 'Ich hab noch nie', emoji: '🍺', screen: 'neverhaive' as Screen, color: '#ffe600' },
  { label: 'Freikarte', emoji: '🃏', screen: null, color: '#a000ff' },
]

function SpinWheelSVG({
  players,
  rotation,
}: {
  players: Player[]
  rotation: number
}) {
  const count = players.length
  const radius = 130
  const cx = 140
  const cy = 140
  const size = 280

  if (count === 0) return null

  const sliceAngle = (2 * Math.PI) / count

  const slices = players.map((player, i) => {
    const startAngle = i * sliceAngle - Math.PI / 2
    const endAngle = (i + 1) * sliceAngle - Math.PI / 2

    const x1 = cx + radius * Math.cos(startAngle)
    const y1 = cy + radius * Math.sin(startAngle)
    const x2 = cx + radius * Math.cos(endAngle)
    const y2 = cy + radius * Math.sin(endAngle)

    const largeArc = sliceAngle > Math.PI ? 1 : 0
    const d = `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`

    const midAngle = startAngle + sliceAngle / 2
    const textR = radius * 0.65
    const tx = cx + textR * Math.cos(midAngle)
    const ty = cy + textR * Math.sin(midAngle)

    return { player, d, tx, ty, midAngle }
  })

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring */}
      <circle cx={cx} cy={cy} r={radius + 8} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />

      <g style={{ transformOrigin: `${cx}px ${cy}px`, transform: `rotate(${rotation}deg)`, transition: `transform 3s cubic-bezier(0.17, 0.67, 0.12, 0.99)` }}>
        {slices.map(({ player, d, tx, ty, midAngle }) => (
          <g key={player.id}>
            <path
              d={d}
              fill={player.color + '30'}
              stroke={player.color}
              strokeWidth="1.5"
              filter="url(#glow)"
            />
            <text
              x={tx}
              y={ty}
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(${(midAngle * 180) / Math.PI + 90}, ${tx}, ${ty})`}
              fontSize="22"
            >
              {player.emoji}
            </text>
          </g>
        ))}
      </g>

      {/* Center circle */}
      <circle cx={cx} cy={cy} r={22} fill="#0d0d1a" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="18">🎲</text>
    </svg>
  )
}

export default function ChaosWheel({ state, onNavigate, onSetCurrentPlayer, onAddScore }: Props) {
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [selectedPlayerIdx, setSelectedPlayerIdx] = useState<number | null>(null)
  const [selectedGame, setSelectedGame] = useState<typeof WHEEL_GAMES[0] | null>(null)
  const [phase, setPhase] = useState<'idle' | 'spinning' | 'playerResult' | 'gameResult'>('idle')
  const { players } = state

  const spinWheel = useCallback(() => {
    if (spinning || players.length < 2) return
    setSpinning(true)
    setPhase('spinning')
    setSelectedPlayerIdx(null)
    setSelectedGame(null)

    const spins = 5 + Math.random() * 5
    const extraDeg = Math.random() * 360
    const totalDeg = spins * 360 + extraDeg
    const newRotation = rotation + totalDeg

    setRotation(newRotation)

    const sliceSize = 360 / players.length
    const normalizedAngle = (360 - (newRotation % 360)) % 360
    const selectedIdx = Math.floor(normalizedAngle / sliceSize) % players.length

    setTimeout(() => {
      setSelectedPlayerIdx(selectedIdx)
      onSetCurrentPlayer(selectedIdx)
      setPhase('playerResult')
      setSpinning(false)
    }, 3000)
  }, [spinning, players, rotation, onSetCurrentPlayer])

  const pickGame = useCallback(() => {
    const game = WHEEL_GAMES[Math.floor(Math.random() * WHEEL_GAMES.length)]
    setSelectedGame(game)
    setPhase('gameResult')
  }, [])

  const goToGame = useCallback(() => {
    if (!selectedGame) return
    if (selectedGame.screen) {
      onNavigate(selectedGame.screen)
    } else {
      // Freikarte
      setPhase('idle')
      setSelectedPlayerIdx(null)
      setSelectedGame(null)
    }
  }, [selectedGame, onNavigate])

  const reset = useCallback(() => {
    setPhase('idle')
    setSelectedPlayerIdx(null)
    setSelectedGame(null)
  }, [])

  const selectedPlayer = selectedPlayerIdx !== null ? players[selectedPlayerIdx] : null

  return (
    <div className="min-h-screen min-h-dvh flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('hub')}
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🌀 Chaos-Rad
          </h2>
          <p className="text-white/40 text-xs">Spin & spiele zufällig</p>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'spinning') && (
            <motion.div
              key="wheel"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-6"
            >
              {/* Pointer */}
              <div className="relative">
                <div className="spin-wheel-pointer" />
                <div className="relative">
                  <motion.div
                    style={{
                      filter: spinning ? 'drop-shadow(0 0 15px #ff00aa)' : 'none',
                      transition: 'filter 0.3s',
                    }}
                  >
                    <SpinWheelSVG
                      players={players.length > 0 ? players : [{ id: 'x', name: 'Demo', emoji: '🎮', color: '#ff00aa', score: 0, drinks: 0, badges: [] }]}
                      rotation={rotation}
                    />
                  </motion.div>
                </div>
              </div>

              {/* Spin button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={spinWheel}
                disabled={spinning || players.length < 2}
                className="btn-neon px-10 py-5 rounded-2xl font-black text-xl text-white relative overflow-hidden"
                style={{
                  background: spinning
                    ? 'rgba(255,255,255,0.1)'
                    : 'linear-gradient(135deg, #a000ff, #ff00aa)',
                  boxShadow: spinning ? 'none' : '0 0 30px rgba(160,0,255,0.5)',
                  fontFamily: 'Space Grotesk, sans-serif',
                  minWidth: '200px',
                }}
                animate={spinning ? { opacity: [1, 0.6, 1] } : {}}
                transition={{ duration: 0.5, repeat: spinning ? Infinity : 0 }}
              >
                {spinning ? '🌀 SPINNING...' : '🎲 SPIN!'}
              </motion.button>

              {players.length < 2 && (
                <p className="text-white/30 text-sm">
                  Min. 2 Spieler nötig ·{' '}
                  <button className="text-neon-pink underline" onClick={() => onNavigate('setup')}>
                    Spieler hinzufügen
                  </button>
                </p>
              )}
            </motion.div>
          )}

          {phase === 'playerResult' && selectedPlayer && (
            <motion.div
              key="playerResult"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="flex flex-col items-center gap-5 w-full max-w-sm"
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, -5, 0] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-8xl"
              >
                {selectedPlayer.emoji}
              </motion.div>

              <div className="text-center">
                <p className="text-white/40 text-sm mb-1">Das Rad hat gesprochen!</p>
                <p
                  className="text-4xl font-black"
                  style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    color: selectedPlayer.color,
                    textShadow: `0 0 20px ${selectedPlayer.color}`,
                  }}
                >
                  {selectedPlayer.name}
                </p>
                <p className="text-white/40 text-sm mt-2">ist dran! 👆</p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={pickGame}
                className="btn-neon w-full py-5 rounded-2xl font-black text-xl text-white"
                style={{
                  background: `linear-gradient(135deg, ${selectedPlayer.color}, ${selectedPlayer.color}88)`,
                  boxShadow: `0 0 30px ${selectedPlayer.color}40`,
                  fontFamily: 'Space Grotesk, sans-serif',
                }}
              >
                🎰 Spiel ziehen!
              </motion.button>
            </motion.div>
          )}

          {phase === 'gameResult' && selectedGame && selectedPlayer && (
            <motion.div
              key="gameResult"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="flex flex-col items-center gap-5 w-full max-w-sm"
            >
              {/* Game card */}
              <motion.div
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full rounded-3xl p-8 flex flex-col items-center gap-3 relative overflow-hidden"
                style={{
                  background: `${selectedGame.color}15`,
                  border: `2px solid ${selectedGame.color}60`,
                  boxShadow: `0 0 40px ${selectedGame.color}30`,
                }}
              >
                <div
                  className="absolute inset-0 opacity-5"
                  style={{ background: `radial-gradient(circle, ${selectedGame.color}, transparent 70%)` }}
                />
                <span className="text-6xl relative z-10">{selectedGame.emoji}</span>
                <p
                  className="text-2xl font-black text-white relative z-10"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {selectedGame.label}
                </p>
                <p className="text-white/40 text-sm relative z-10">
                  {selectedPlayer.emoji} {selectedPlayer.name} spielt
                </p>
              </motion.div>

              {selectedGame.screen ? (
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={goToGame}
                  className="btn-neon w-full py-5 rounded-2xl font-black text-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${selectedGame.color}, #ff00aa)`,
                    boxShadow: `0 0 30px ${selectedGame.color}40`,
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  🚀 Jetzt spielen!
                </motion.button>
              ) : (
                <div className="w-full">
                  <div
                    className="rounded-2xl p-5 text-center mb-4"
                    style={{
                      background: 'rgba(160,0,255,0.15)',
                      border: '1px solid rgba(160,0,255,0.4)',
                    }}
                  >
                    <p className="text-3xl mb-2">🃏</p>
                    <p className="font-bold text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      FREIKARTE!
                    </p>
                    <p className="text-white/50 text-sm mt-1">
                      {selectedPlayer.name} ist befreit von dieser Runde!
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={reset}
                    className="btn-neon w-full py-4 rounded-2xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #a000ff, #ff00aa)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    🔄 Nochmal spinnen
                  </motion.button>
                </div>
              )}

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={reset}
                className="text-white/30 text-sm underline"
              >
                Nochmal spinnen
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
