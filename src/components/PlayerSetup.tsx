import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Screen, Player } from '../types'
import { playerEmojis, playerColors } from '../data/content'

interface Props {
  onNavigate: (screen: Screen) => void
  onUpdatePlayers: (players: Player[]) => void
  players: Player[]
}

function createPlayer(name: string, index: number): Player {
  return {
    id: crypto.randomUUID(),
    name: name.trim(),
    emoji: playerEmojis[index % playerEmojis.length],
    color: playerColors[index % playerColors.length],
    score: 0,
    drinks: 0,
    badges: [],
  }
}

export default function PlayerSetup({ onNavigate, onUpdatePlayers, players: initialPlayers }: Props) {
  const [players, setPlayers] = useState<Player[]>(
    initialPlayers.length > 0 ? initialPlayers : []
  )
  const [inputValue, setInputValue] = useState('')

  const addPlayer = () => {
    const name = inputValue.trim()
    if (!name || players.length >= 8) return
    const newPlayer = createPlayer(name, players.length)
    setPlayers(prev => [...prev, newPlayer])
    setInputValue('')
  }

  const removePlayer = (id: string) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }

  const changeEmoji = (id: string) => {
    setPlayers(prev => prev.map(p => {
      if (p.id !== id) return p
      const currentIdx = playerEmojis.indexOf(p.emoji)
      const nextIdx = (currentIdx + 1) % playerEmojis.length
      return { ...p, emoji: playerEmojis[nextIdx] }
    }))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') addPlayer()
  }

  const startGame = () => {
    if (players.length < 2) return
    onUpdatePlayers(players)
    onNavigate('hub')
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ←
        </motion.button>
        <div>
          <h2 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            Spieler-Setup
          </h2>
          <p className="text-white/40 text-sm">2–8 Spieler · Tippt eure Namen</p>
        </div>
      </div>

      {/* Player count indicator */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full transition-all duration-300"
            style={{
              background: i < players.length
                ? players[i]?.color || '#ff00aa'
                : 'rgba(255,255,255,0.1)',
              boxShadow: i < players.length ? `0 0 6px ${players[i]?.color || '#ff00aa'}` : 'none',
            }}
          />
        ))}
      </div>

      {/* Player list */}
      <div className="flex-1 space-y-3 mb-6">
        <AnimatePresence>
          {players.map((player, idx) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, x: -30, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, x: 30, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-3 p-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${player.color}40`,
                boxShadow: `0 0 15px ${player.color}15`,
              }}
            >
              {/* Emoji avatar */}
              <motion.button
                whileTap={{ scale: 0.8, rotate: 180 }}
                onClick={() => changeEmoji(player.id)}
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: `${player.color}20`, border: `1px solid ${player.color}50` }}
                title="Emoji wechseln"
              >
                {player.emoji}
              </motion.button>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-white truncate" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                  {player.name}
                </p>
                <p className="text-white/30 text-xs">
                  Spieler {idx + 1} · Tippe Emoji zum Wechseln
                </p>
              </div>

              {/* Color dot */}
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ background: player.color, boxShadow: `0 0 8px ${player.color}` }}
              />

              {/* Remove */}
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={() => removePlayer(player.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-red-400 transition-colors flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                ✕
              </motion.button>
            </motion.div>
          ))}
        </AnimatePresence>

        {players.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <div className="text-5xl mb-4 animate-bounce-subtle">👥</div>
            <p className="text-white/30 text-sm">Noch keine Spieler hinzugefügt</p>
            <p className="text-white/20 text-xs mt-1">Min. 2 Spieler für den Start</p>
          </motion.div>
        )}
      </div>

      {/* Add player input */}
      {players.length < 8 && (
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Spieler ${players.length + 1} Name...`}
            maxLength={20}
            className="flex-1 px-4 py-3.5 rounded-xl text-white font-medium placeholder:text-white/30 outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: inputValue
                ? '1px solid rgba(255,0,170,0.5)'
                : '1px solid rgba(255,255,255,0.1)',
              boxShadow: inputValue ? '0 0 15px rgba(255,0,170,0.15)' : 'none',
            }}
            autoComplete="off"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={addPlayer}
            disabled={!inputValue.trim()}
            className="w-14 h-14 rounded-xl flex items-center justify-center text-xl font-bold transition-all"
            style={{
              background: inputValue.trim()
                ? 'linear-gradient(135deg, #ff00aa, #a000ff)'
                : 'rgba(255,255,255,0.06)',
              boxShadow: inputValue.trim() ? '0 0 20px rgba(255,0,170,0.3)' : 'none',
              opacity: inputValue.trim() ? 1 : 0.4,
            }}
          >
            +
          </motion.button>
        </div>
      )}

      {players.length >= 8 && (
        <p className="text-white/30 text-xs text-center mb-4">Maximum von 8 Spielern erreicht</p>
      )}

      {/* Start button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={startGame}
        disabled={players.length < 2}
        className="btn-neon w-full py-5 rounded-2xl font-bold text-lg text-white tracking-wide safe-bottom"
        style={{
          background: players.length >= 2
            ? 'linear-gradient(135deg, #ff6a00, #ff00aa)'
            : 'rgba(255,255,255,0.05)',
          boxShadow: players.length >= 2 ? '0 0 30px rgba(255,106,0,0.4)' : 'none',
          opacity: players.length >= 2 ? 1 : 0.4,
          fontFamily: 'Space Grotesk, sans-serif',
        }}
      >
        {players.length < 2
          ? `Noch ${2 - players.length} Spieler nötig`
          : `🎮 Los geht's! (${players.length} Spieler)`
        }
      </motion.button>
    </div>
  )
}
