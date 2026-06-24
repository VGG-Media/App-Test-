import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import { neverHaveIEver } from '../../data/content'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

export default function NeverHaveIEver({ state, onNavigate, onAddDrink }: Props) {
  const [cardIndex, setCardIndex] = useState(() => Math.floor(Math.random() * neverHaveIEver.length))
  const [playerDrinks, setPlayerDrinks] = useState<Record<string, boolean>>({})
  const [revealed, setRevealed] = useState(false)
  const [roundDone, setRoundDone] = useState(false)
  const [totalRounds, setTotalRounds] = useState(0)

  const currentCard = neverHaveIEver.filter(c => c.level <= state.chaosLevel)[cardIndex % neverHaveIEver.filter(c => c.level <= state.chaosLevel).length]

  const availableCards = neverHaveIEver.filter(c => c.level <= state.chaosLevel)

  const toggleDrink = useCallback((playerId: string) => {
    setPlayerDrinks(prev => ({ ...prev, [playerId]: !prev[playerId] }))
  }, [])

  const confirmRound = useCallback(() => {
    Object.entries(playerDrinks).forEach(([id, drinks]) => {
      if (drinks) onAddDrink(id)
    })
    setRoundDone(true)
  }, [playerDrinks, onAddDrink])

  const nextCard = useCallback(() => {
    const newIdx = Math.floor(Math.random() * availableCards.length)
    setCardIndex(newIdx)
    setPlayerDrinks({})
    setRevealed(false)
    setRoundDone(false)
    setTotalRounds(r => r + 1)
  }, [availableCards.length])

  const drinkCount = Object.values(playerDrinks).filter(Boolean).length

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
            🍻 Ich hab noch nie
          </h2>
          <p className="text-white/40 text-xs">
            Runde {totalRounds + 1} · {availableCards.length} Karten verfügbar
          </p>
        </div>
        <div className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold text-white/60"
          style={{ background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', color: '#00f5ff' }}
        >
          Level {state.chaosLevel}
        </div>
      </div>

      {/* Statement card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cardIndex + '-' + revealed}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 90 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 mb-5 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(0,245,255,0.08), rgba(0,136,255,0.08))',
            border: '1px solid rgba(0,245,255,0.3)',
            minHeight: '200px',
          }}
          onClick={() => !revealed && setRevealed(true)}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(circle at 50% 50%, #00f5ff, transparent 70%)' }}
          />
          <div className="relative z-10">
            <p className="text-white/40 text-sm mb-3 uppercase tracking-widest font-medium">
              Ich hab noch nie...
            </p>
            {!revealed ? (
              <motion.div
                className="flex flex-col items-center gap-3"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-4xl">👆</span>
                <p className="text-white/50">Tippe zum Aufdecken</p>
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

      {/* Player vote area */}
      {revealed && !roundDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-white/50 text-sm text-center mb-4">
            Wer hat es doch getan? 👇 Tippt euren Namen!
          </p>
          <div className="grid grid-cols-2 gap-2.5 mb-5">
            {state.players.map(player => {
              const hasDone = playerDrinks[player.id]
              return (
                <motion.button
                  key={player.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleDrink(player.id)}
                  className="flex items-center gap-2.5 p-3.5 rounded-2xl transition-all"
                  style={{
                    background: hasDone ? `${player.color}20` : 'rgba(255,255,255,0.04)',
                    border: hasDone ? `1px solid ${player.color}60` : '1px solid rgba(255,255,255,0.1)',
                    boxShadow: hasDone ? `0 0 15px ${player.color}30` : 'none',
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${player.color}20` }}
                  >
                    {player.emoji}
                  </span>
                  <div className="min-w-0 text-left">
                    <p
                      className="font-bold text-sm truncate"
                      style={{
                        color: hasDone ? player.color : 'rgba(255,255,255,0.7)',
                        fontFamily: 'Space Grotesk, sans-serif',
                      }}
                    >
                      {player.name}
                    </p>
                    <p className="text-xs" style={{ color: hasDone ? player.color + '90' : 'rgba(255,255,255,0.3)' }}>
                      {hasDone ? '🍺 Hab ich!' : 'Nie gemacht'}
                    </p>
                  </div>
                  {hasDone && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto text-lg"
                    >
                      🍺
                    </motion.span>
                  )}
                </motion.button>
              )
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={confirmRound}
            className="btn-neon py-4 rounded-2xl font-bold text-white"
            style={{
              background: 'linear-gradient(135deg, #00f5ff, #0088ff)',
              boxShadow: '0 0 20px rgba(0,245,255,0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {drinkCount > 0
              ? `🍺 ${drinkCount} Spieler trinkt!`
              : '✅ Alle bleiben trocken'
            }
          </motion.button>
        </motion.div>
      )}

      {/* Round done */}
      {roundDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          {drinkCount > 0 ? (
            <div
              className="rounded-2xl p-5 text-center mb-4"
              style={{
                background: 'rgba(255,106,0,0.1)',
                border: '1px solid rgba(255,106,0,0.3)',
              }}
            >
              <p className="text-4xl mb-2">🍺</p>
              <p className="font-bold text-lg" style={{ color: '#ff6a00', fontFamily: 'Space Grotesk, sans-serif' }}>
                {drinkCount} {drinkCount === 1 ? 'Person' : 'Personen'} trinkt!
              </p>
              <p className="text-white/40 text-sm mt-1">
                {state.players.filter(p => playerDrinks[p.id]).map(p => p.name).join(', ')}
              </p>
            </div>
          ) : (
            <div
              className="rounded-2xl p-5 text-center mb-4"
              style={{
                background: 'rgba(0,255,136,0.1)',
                border: '1px solid rgba(0,255,136,0.3)',
              }}
            >
              <p className="text-4xl mb-2">🥤</p>
              <p className="font-bold text-lg" style={{ color: '#00ff88', fontFamily: 'Space Grotesk, sans-serif' }}>
                Alle bleiben trocken!
              </p>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={nextCard}
            className="btn-neon py-4 rounded-2xl font-bold text-white mt-auto"
            style={{
              background: 'linear-gradient(135deg, #ff00aa, #a000ff)',
              boxShadow: '0 0 20px rgba(255,0,170,0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            ▶ Nächste Karte
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
