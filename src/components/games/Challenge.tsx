import { useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import { challenges } from '../../data/content'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

const TIMER_SECONDS = 120

export default function Challenge({ state, onNavigate, onAddScore }: Props) {
  const availableCards = challenges.filter(c => c.level <= state.chaosLevel)
  const [cardIdx, setCardIdx] = useState(() => Math.floor(Math.random() * availableCards.length))
  const [revealed, setRevealed] = useState(false)
  const [timerActive, setTimerActive] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const [roundDone, setRoundDone] = useState(false)
  const [roundCount, setRoundCount] = useState(0)
  const [winner, setWinner] = useState<Player | null>(null)

  const currentCard = availableCards[cardIdx % availableCards.length]

  useEffect(() => {
    if (!timerActive || timeLeft <= 0) return
    const interval = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setTimerActive(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timerActive, timeLeft])

  const startTimer = useCallback(() => {
    setTimeLeft(TIMER_SECONDS)
    setTimerActive(true)
  }, [])

  const handleWinner = useCallback((player: Player) => {
    setWinner(player)
    setTimerActive(false)
    setRoundDone(true)
    onAddScore(player.id, 20)
  }, [onAddScore])

  const nextCard = useCallback(() => {
    const newIdx = Math.floor(Math.random() * availableCards.length)
    setCardIdx(newIdx)
    setRevealed(false)
    setTimerActive(false)
    setTimeLeft(TIMER_SECONDS)
    setRoundDone(false)
    setWinner(null)
    setRoundCount(r => r + 1)
  }, [availableCards.length])

  const timerProgress = timeLeft / TIMER_SECONDS
  const timerColor = timeLeft > 60 ? '#00ff88' : timeLeft > 30 ? '#ffe600' : '#ff4444'

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
            ⚡ Group Challenge
          </h2>
          <p className="text-white/40 text-xs">Runde {roundCount + 1} · Alle mitmachen!</p>
        </div>
      </div>

      {/* Timer */}
      {(timerActive || (revealed && timeLeft < TIMER_SECONDS && timeLeft > 0)) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 mb-5 flex items-center gap-4"
          style={{
            background: `${timerColor}15`,
            border: `1px solid ${timerColor}40`,
          }}
        >
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
              <circle
                cx="28" cy="28" r="24" fill="none"
                stroke={timerColor}
                strokeWidth="4"
                strokeDasharray={`${2 * Math.PI * 24}`}
                strokeDashoffset={`${2 * Math.PI * 24 * (1 - timerProgress)}`}
                strokeLinecap="round"
                style={{ filter: `drop-shadow(0 0 6px ${timerColor})`, transition: 'stroke-dashoffset 1s linear' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-black text-sm" style={{ color: timerColor, fontFamily: 'Space Grotesk, sans-serif' }}>
                {timeLeft}
              </span>
            </div>
          </div>
          <div>
            <p className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {timeLeft > 0 ? 'Zeit läuft!' : '⏰ Zeit ist um!'}
            </p>
            <p className="text-white/40 text-xs">
              {timeLeft > 0 ? `${timeLeft} Sekunden übrig` : 'Bestimmt den Gewinner!'}
            </p>
          </div>
          {timerActive && (
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setTimerActive(false)}
              className="ml-auto text-white/40 text-sm"
            >
              ⏸
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Challenge card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cardIdx}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 mb-5 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0,255,136,0.08), rgba(0,245,255,0.08))',
            border: '1px solid rgba(0,255,136,0.3)',
            minHeight: '180px',
          }}
          onClick={() => {
            if (!revealed) {
              setRevealed(true)
              startTimer()
            }
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(circle at 50% 50%, #00ff88, transparent 70%)' }}
          />
          <div className="relative z-10">
            {!revealed ? (
              <motion.div
                className="flex flex-col items-center gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">👆</span>
                <p className="text-white/50">Tippe zum Start (Timer läuft!)</p>
              </motion.div>
            ) : (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xl font-bold text-white leading-relaxed"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {currentCard?.text}
              </motion.p>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Winner selection */}
      {revealed && !roundDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-white/50 text-sm text-center mb-4">
            Wer hat die Challenge am besten gemeistert?
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-4">
            {state.players.map(player => (
              <motion.button
                key={player.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleWinner(player)}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl"
                style={{
                  background: `${player.color}12`,
                  border: `1px solid ${player.color}40`,
                }}
              >
                <span className="text-3xl">{player.emoji}</span>
                <p
                  className="font-bold text-sm text-white"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {player.name}
                </p>
                <p className="text-xs" style={{ color: player.color }}>
                  +20 Punkte
                </p>
              </motion.button>
            ))}
          </div>
          {timerActive && (
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => { setTimerActive(false) }}
              className="py-3 rounded-2xl font-semibold text-white/50 text-sm"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              ⏹ Timer stoppen & Gewinner wählen
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Round done */}
      {roundDone && winner && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col gap-3"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="rounded-3xl p-6 flex flex-col items-center gap-3 text-center"
            style={{
              background: `${winner.color}15`,
              border: `1px solid ${winner.color}50`,
              boxShadow: `0 0 30px ${winner.color}20`,
            }}
          >
            <span className="text-6xl">{winner.emoji}</span>
            <div>
              <p className="text-white/50 text-sm">Gewinner:</p>
              <p
                className="text-3xl font-black"
                style={{ color: winner.color, fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {winner.name}
              </p>
              <p className="text-yellow-400 font-bold mt-1">🏆 +20 Punkte!</p>
            </div>
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={nextCard}
            className="btn-neon py-4 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #ff00aa, #a000ff)',
              boxShadow: '0 0 20px rgba(255,0,170,0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            ▶ Nächste Challenge
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
