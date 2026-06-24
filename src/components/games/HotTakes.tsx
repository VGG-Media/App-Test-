import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import { hotTakes } from '../../data/content'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

interface Vote {
  playerId: string
  agree: boolean
}

export default function HotTakes({ state, onNavigate, onAddScore }: Props) {
  const availableCards = hotTakes.filter(c => c.level <= state.chaosLevel)
  const [cardIdx, setCardIdx] = useState(() => Math.floor(Math.random() * availableCards.length))
  const [revealed, setRevealed] = useState(false)
  const [votes, setVotes] = useState<Vote[]>([])
  const [votingDone, setVotingDone] = useState(false)
  const [roundCount, setRoundCount] = useState(0)

  const currentCard = availableCards[cardIdx % availableCards.length]

  const vote = useCallback((playerId: string, agree: boolean) => {
    setVotes(prev => {
      const existing = prev.find(v => v.playerId === playerId)
      if (existing) return prev.map(v => v.playerId === playerId ? { ...v, agree } : v)
      return [...prev, { playerId, agree }]
    })
  }, [])

  const getPlayerVote = (playerId: string) => votes.find(v => v.playerId === playerId)

  const allVoted = state.players.every(p => getPlayerVote(p.id) !== undefined)

  const confirmVotes = useCallback(() => {
    setVotingDone(true)
    // The most controversial person (alone in their vote) gets points
    const agreeCount = votes.filter(v => v.agree).length
    const disagreeCount = votes.filter(v => !v.agree).length
    if (agreeCount === 1) {
      const loneAgree = votes.find(v => v.agree)
      if (loneAgree) onAddScore(loneAgree.playerId, 15)
    }
    if (disagreeCount === 1) {
      const loneDisagree = votes.find(v => !v.agree)
      if (loneDisagree) onAddScore(loneDisagree.playerId, 15)
    }
  }, [votes, onAddScore])

  const nextCard = useCallback(() => {
    const newIdx = Math.floor(Math.random() * availableCards.length)
    setCardIdx(newIdx)
    setRevealed(false)
    setVotes([])
    setVotingDone(false)
    setRoundCount(r => r + 1)
  }, [availableCards.length])

  const agreeVoters = state.players.filter(p => getPlayerVote(p.id)?.agree === true)
  const disagreeVoters = state.players.filter(p => getPlayerVote(p.id)?.agree === false)

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
            🔥 Hot Opinions
          </h2>
          <p className="text-white/40 text-xs">Runde {roundCount + 1} · Stimme ab!</p>
        </div>
        <div
          className="ml-auto px-3 py-1.5 rounded-xl text-xs font-bold"
          style={{ background: 'rgba(255,106,0,0.15)', border: '1px solid rgba(255,106,0,0.3)', color: '#ff6a00' }}
        >
          🔥 Level {state.chaosLevel}
        </div>
      </div>

      {/* How to play */}
      {roundCount === 0 && !revealed && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 mb-5"
          style={{ background: 'rgba(255,106,0,0.08)', border: '1px solid rgba(255,106,0,0.2)' }}
        >
          <p className="text-sm text-white/60">
            💡 Alle stimmen ab: <span className="text-green-400 font-bold">✅ Zustimmen</span> oder{' '}
            <span className="text-red-400 font-bold">❌ Ablehnen</span>.
            Wer als Einzige/r anders abstimmt, bekommt <span className="text-yellow-400 font-bold">15 Punkte</span>!
          </p>
        </motion.div>
      )}

      {/* Statement card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={cardIdx}
          initial={{ opacity: 0, rotateY: -90 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl p-6 mb-5 flex flex-col items-center justify-center text-center relative overflow-hidden cursor-pointer"
          style={{
            background: 'linear-gradient(135deg, rgba(255,106,0,0.1), rgba(255,0,68,0.1))',
            border: '1px solid rgba(255,106,0,0.35)',
            minHeight: '180px',
          }}
          onClick={() => !revealed && setRevealed(true)}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: 'radial-gradient(circle at 50% 50%, #ff6a00, transparent 70%)' }}
          />
          <div className="relative z-10">
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
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <span className="text-4xl mb-3 block">🔥</span>
                <p
                  className="text-xl font-bold text-white leading-relaxed"
                  style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                >
                  {currentCard?.text}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Voting area */}
      {revealed && !votingDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col"
        >
          <p className="text-white/50 text-sm text-center mb-4">
            Wie stimmt ihr ab? Alle tippen gleichzeitig!
          </p>

          <div className="space-y-2.5 mb-5">
            {state.players.map(player => {
              const playerVote = getPlayerVote(player.id)
              return (
                <motion.div
                  key={player.id}
                  className="flex items-center gap-3 p-3 rounded-2xl"
                  style={{
                    background: playerVote
                      ? playerVote.agree ? 'rgba(0,255,136,0.1)' : 'rgba(255,68,68,0.1)'
                      : 'rgba(255,255,255,0.04)',
                    border: playerVote
                      ? playerVote.agree ? '1px solid rgba(0,255,136,0.3)' : '1px solid rgba(255,68,68,0.3)'
                      : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                    style={{ background: `${player.color}20` }}
                  >
                    {player.emoji}
                  </span>
                  <p className="flex-1 font-semibold text-sm text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                    {player.name}
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => vote(player.id, true)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                      style={{
                        background: playerVote?.agree === true ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.08)',
                        border: playerVote?.agree === true ? '1px solid rgba(0,255,136,0.6)' : '1px solid transparent',
                        boxShadow: playerVote?.agree === true ? '0 0 12px rgba(0,255,136,0.4)' : 'none',
                      }}
                    >
                      ✅
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => vote(player.id, false)}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition-all"
                      style={{
                        background: playerVote?.agree === false ? 'rgba(255,68,68,0.3)' : 'rgba(255,255,255,0.08)',
                        border: playerVote?.agree === false ? '1px solid rgba(255,68,68,0.6)' : '1px solid transparent',
                        boxShadow: playerVote?.agree === false ? '0 0 12px rgba(255,68,68,0.4)' : 'none',
                      }}
                    >
                      ❌
                    </motion.button>
                  </div>
                </motion.div>
              )
            })}
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={confirmVotes}
            disabled={!allVoted}
            className="btn-neon py-4 rounded-2xl font-bold text-white mt-auto"
            style={{
              background: allVoted ? 'linear-gradient(135deg, #ff6a00, #ff0044)' : 'rgba(255,255,255,0.06)',
              boxShadow: allVoted ? '0 0 20px rgba(255,106,0,0.4)' : 'none',
              opacity: allVoted ? 1 : 0.5,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {allVoted ? '🔥 Ergebnis zeigen!' : `Noch ${state.players.length - votes.length} Stimme(n) fehlen`}
          </motion.button>
        </motion.div>
      )}

      {/* Results */}
      {votingDone && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col gap-3"
        >
          <div className="grid grid-cols-2 gap-3">
            {/* Agree */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.25)' }}
            >
              <p className="text-green-400 font-bold text-sm mb-2">✅ Zustimmung</p>
              {agreeVoters.length > 0 ? (
                agreeVoters.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 mb-1">
                    <span>{p.emoji}</span>
                    <span className="text-white/70 text-xs">{p.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-xs">Niemand</p>
              )}
            </div>

            {/* Disagree */}
            <div
              className="rounded-2xl p-4"
              style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.25)' }}
            >
              <p className="text-red-400 font-bold text-sm mb-2">❌ Ablehnung</p>
              {disagreeVoters.length > 0 ? (
                disagreeVoters.map(p => (
                  <div key={p.id} className="flex items-center gap-1.5 mb-1">
                    <span>{p.emoji}</span>
                    <span className="text-white/70 text-xs">{p.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-white/30 text-xs">Niemand</p>
              )}
            </div>
          </div>

          {/* Controversy badge */}
          {(agreeVoters.length === 1 || disagreeVoters.length === 1) && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', delay: 0.3 }}
              className="rounded-2xl p-4 text-center"
              style={{
                background: 'rgba(255,230,0,0.1)',
                border: '1px solid rgba(255,230,0,0.3)',
              }}
            >
              <p className="text-2xl mb-1">🌟</p>
              <p className="font-bold text-yellow-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                +15 Punkte für den Außenseiter!
              </p>
              <p className="text-white/40 text-xs mt-1">Kontroverser Geist erkannt 😏</p>
            </motion.div>
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
            ▶ Nächste Opinion
          </motion.button>
        </motion.div>
      )}
    </div>
  )
}
