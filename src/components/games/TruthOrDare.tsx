import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import { truthQuestions, dareChallenge, type ContentItem } from '../../data/content'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

type Choice = 'none' | 'truth' | 'dare'

function getFilteredItems(items: ContentItem[], chaosLevel: number): ContentItem[] {
  return items.filter(item => item.level <= chaosLevel)
}

function getRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function TruthOrDare({ state, currentPlayer, onNavigate, onNextPlayer, onAddScore, onAddBadge }: Props) {
  const [choice, setChoice] = useState<Choice>('none')
  const [currentItem, setCurrentItem] = useState<ContentItem | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [skipped, setSkipped] = useState(false)

  const handleChoice = useCallback((c: 'truth' | 'dare') => {
    const pool = c === 'truth'
      ? getFilteredItems(truthQuestions, state.chaosLevel)
      : getFilteredItems(dareChallenge, state.chaosLevel)
    setCurrentItem(getRandom(pool))
    setChoice(c)
    setRevealed(false)
    setCompleted(false)
    setSkipped(false)
  }, [state.chaosLevel])

  const handleComplete = useCallback(() => {
    setCompleted(true)
    if (currentPlayer) {
      onAddScore(currentPlayer.id, 10)
      if (choice === 'dare') onAddBadge(currentPlayer.id, '⚡')
    }
  }, [currentPlayer, choice, onAddScore, onAddBadge])

  const handleSkip = useCallback(() => {
    setSkipped(true)
  }, [])

  const handleNext = useCallback(() => {
    setChoice('none')
    setCurrentItem(null)
    setRevealed(false)
    setCompleted(false)
    setSkipped(false)
    onNextPlayer()
  }, [onNextPlayer])

  const player = currentPlayer

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-white/50 mb-4">Keine Spieler gefunden</p>
          <button onClick={() => onNavigate('setup')} className="text-neon-pink underline">
            Spieler hinzufügen
          </button>
        </div>
      </div>
    )
  }

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
            🎯 Wahrheit oder Pflicht
          </h2>
          <p className="text-white/40 text-xs">Chaos-Level {state.chaosLevel}</p>
        </div>
      </div>

      {/* Current player card */}
      <motion.div
        className="rounded-2xl p-5 mb-6 relative overflow-hidden"
        style={{
          background: `${player.color}12`,
          border: `1px solid ${player.color}50`,
          boxShadow: `0 0 30px ${player.color}20`,
        }}
        layoutId="playerCard"
      >
        <div className="absolute inset-0 opacity-5"
          style={{ background: `radial-gradient(circle at 70% 50%, ${player.color}, transparent 70%)` }}
        />
        <div className="relative flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
            style={{ background: `${player.color}20`, border: `1px solid ${player.color}40` }}
          >
            {player.emoji}
          </div>
          <div>
            <p className="text-white/50 text-sm">Du bist dran,</p>
            <p className="text-2xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {player.name}!
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/30 text-xs">Score</p>
            <p className="text-xl font-bold" style={{ color: player.color }}>{player.score}</p>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          {choice === 'none' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex-1 flex flex-col gap-4"
            >
              <p className="text-center text-white/50 mb-2">
                Was wählst du?
              </p>
              {/* Truth button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice('truth')}
                className="btn-neon flex-1 rounded-3xl flex flex-col items-center justify-center gap-3 py-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,136,255,0.15))',
                  border: '1px solid rgba(0,245,255,0.4)',
                  boxShadow: '0 0 25px rgba(0,245,255,0.15)',
                }}
              >
                <span className="text-5xl">💭</span>
                <span className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  WAHRHEIT
                </span>
                <span className="text-white/40 text-sm">Beantworte ehrlich</span>
              </motion.button>

              {/* Dare button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleChoice('dare')}
                className="btn-neon flex-1 rounded-3xl flex flex-col items-center justify-center gap-3 py-8"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,0,170,0.15), rgba(160,0,255,0.15))',
                  border: '1px solid rgba(255,0,170,0.4)',
                  boxShadow: '0 0 25px rgba(255,0,170,0.15)',
                }}
              >
                <span className="text-5xl">⚡</span>
                <span className="text-3xl font-black text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  PFLICHT
                </span>
                <span className="text-white/40 text-sm">Erledige die Aufgabe</span>
              </motion.button>
            </motion.div>
          )}

          {choice !== 'none' && currentItem && (
            <motion.div
              key="reveal"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="flex-1 flex flex-col"
            >
              {/* Type badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="px-4 py-1.5 rounded-full text-sm font-bold"
                  style={{
                    background: choice === 'truth'
                      ? 'linear-gradient(135deg, #00f5ff, #0088ff)'
                      : 'linear-gradient(135deg, #ff00aa, #a000ff)',
                    color: 'white',
                    boxShadow: choice === 'truth'
                      ? '0 0 15px rgba(0,245,255,0.4)'
                      : '0 0 15px rgba(255,0,170,0.4)',
                    fontFamily: 'Space Grotesk, sans-serif',
                  }}
                >
                  {choice === 'truth' ? '💭 WAHRHEIT' : '⚡ PFLICHT'}
                </span>
                <span
                  className="px-3 py-1 rounded-full text-xs"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    color: 'rgba(255,255,255,0.4)',
                    border: '1px solid rgba(255,255,255,0.1)',
                  }}
                >
                  Level {currentItem.level}
                </span>
              </div>

              {/* Card */}
              <motion.div
                className="flex-1 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer"
                style={{
                  background: choice === 'truth'
                    ? 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(0,136,255,0.08))'
                    : 'linear-gradient(135deg, rgba(255,0,170,0.08), rgba(160,0,255,0.08))',
                  border: choice === 'truth'
                    ? '1px solid rgba(0,245,255,0.25)'
                    : '1px solid rgba(255,0,170,0.25)',
                  minHeight: '200px',
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => !revealed && setRevealed(true)}
              >
                {!revealed ? (
                  <motion.div
                    className="flex flex-col items-center gap-4"
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-5xl">👆</span>
                    <p className="text-white/50 font-medium">Tippe zum Aufdecken</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <p
                      className="text-xl font-semibold text-white leading-relaxed"
                      style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                    >
                      {currentItem.text}
                    </p>
                  </motion.div>
                )}
              </motion.div>

              {/* Actions */}
              {revealed && !completed && !skipped && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mt-4"
                >
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSkip}
                    className="flex-1 py-4 rounded-2xl font-semibold text-white/50"
                    style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    😅 Skippen (-5)
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={handleComplete}
                    className="flex-1 py-4 rounded-2xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #00ff88, #00cc66)',
                      boxShadow: '0 0 20px rgba(0,255,136,0.3)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    ✅ Erledigt! (+10)
                  </motion.button>
                </motion.div>
              )}

              {/* Result states */}
              {(completed || skipped) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-3 mt-4"
                >
                  <div
                    className="rounded-2xl p-4 text-center"
                    style={{
                      background: completed ? 'rgba(0,255,136,0.1)' : 'rgba(255,100,0,0.1)',
                      border: `1px solid ${completed ? 'rgba(0,255,136,0.3)' : 'rgba(255,100,0,0.3)'}`,
                    }}
                  >
                    <p className="font-bold text-lg" style={{ color: completed ? '#00ff88' : '#ff6400', fontFamily: 'Space Grotesk, sans-serif' }}>
                      {completed ? '🎉 Mega! +10 Punkte!' : '😅 Kein Problem, weiter!'}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={handleNext}
                    className="btn-neon py-4 rounded-2xl font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #ff00aa, #a000ff)',
                      boxShadow: '0 0 20px rgba(255,0,170,0.3)',
                      fontFamily: 'Space Grotesk, sans-serif',
                    }}
                  >
                    ▶ Nächster Spieler
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
