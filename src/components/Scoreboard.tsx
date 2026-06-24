import { motion } from 'framer-motion'
import type { GameState, Screen } from '../types'

interface Props {
  state: GameState
  onNavigate: (screen: Screen) => void
}

export default function Scoreboard({ state, onNavigate }: Props) {
  const sorted = [...state.players].sort((a, b) => b.score - a.score)
  const maxScore = sorted[0]?.score || 1

  const medals = ['🥇', '🥈', '🥉']

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
          <h2 className="text-2xl font-black" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            🏆 Scoreboard
          </h2>
          <p className="text-white/40 text-xs">
            Runde {state.roundCount} · Chaos Level {state.chaosLevel}
          </p>
        </div>
      </div>

      {/* Leader podium */}
      {sorted.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl p-5 mb-5 relative overflow-hidden"
          style={{
            background: `${sorted[0].color}12`,
            border: `1px solid ${sorted[0].color}50`,
            boxShadow: `0 0 40px ${sorted[0].color}20`,
          }}
        >
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(circle at 80% 50%, ${sorted[0].color}, transparent 60%)` }}
          />
          <div className="relative flex items-center gap-4">
            <div className="flex flex-col items-center">
              <span className="text-4xl">{sorted[0].emoji}</span>
              <span className="text-2xl">🥇</span>
            </div>
            <div className="flex-1">
              <p className="text-white/50 text-xs uppercase tracking-widest">Führend</p>
              <p
                className="text-2xl font-black"
                style={{ color: sorted[0].color, fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {sorted[0].name}
              </p>
              <div className="flex gap-4 mt-1">
                <span className="text-white/50 text-xs">🏆 {sorted[0].score} Pts</span>
                <span className="text-white/50 text-xs">🍺 {sorted[0].drinks}x getrunken</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Full ranking */}
      <div className="flex-1 space-y-2.5">
        {sorted.map((player, idx) => (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="flex items-center gap-3 p-4 rounded-2xl relative overflow-hidden"
            style={{
              background: idx === 0 ? `${player.color}10` : 'rgba(255,255,255,0.03)',
              border: idx === 0 ? `1px solid ${player.color}40` : '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {/* Rank */}
            <div className="w-8 text-center flex-shrink-0">
              {idx < 3 ? (
                <span className="text-xl">{medals[idx]}</span>
              ) : (
                <span className="text-white/30 font-bold text-sm">#{idx + 1}</span>
              )}
            </div>

            {/* Avatar */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${player.color}20` }}
            >
              {player.emoji}
            </div>

            {/* Name */}
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-white truncate"
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {player.name}
              </p>
              {player.badges.length > 0 && (
                <p className="text-xs text-white/30">
                  {player.badges.slice(0, 5).join(' ')}
                </p>
              )}
            </div>

            {/* Stats */}
            <div className="text-right flex-shrink-0">
              <p className="font-black text-lg" style={{ color: player.color, fontFamily: 'Space Grotesk, sans-serif' }}>
                {player.score}
              </p>
              <p className="text-white/30 text-xs">Punkte</p>
            </div>

            {/* Score bar */}
            <div
              className="absolute bottom-0 left-0 h-0.5 transition-all duration-700"
              style={{
                width: `${(player.score / maxScore) * 100}%`,
                background: player.color,
                boxShadow: `0 0 6px ${player.color}`,
              }}
            />
          </motion.div>
        ))}
      </div>

      {/* Stats summary */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="mt-5 grid grid-cols-3 gap-2.5"
      >
        {[
          {
            label: 'Gesamtpunkte',
            value: state.players.reduce((s, p) => s + p.score, 0),
            emoji: '🏆',
          },
          {
            label: 'Runden',
            value: state.roundCount,
            emoji: '🔄',
          },
          {
            label: 'Getrunken',
            value: state.players.reduce((s, p) => s + p.drinks, 0),
            emoji: '🍺',
          },
        ].map(stat => (
          <div
            key={stat.label}
            className="rounded-2xl p-3 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xl mb-1">{stat.emoji}</p>
            <p className="font-black text-lg text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {stat.value}
            </p>
            <p className="text-white/30 text-xs">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 mt-5">
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('hub')}
          className="flex-1 py-4 rounded-2xl font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #ff00aa, #a000ff)',
            boxShadow: '0 0 20px rgba(255,0,170,0.3)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          ▶ Weiter spielen
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => onNavigate('home')}
          className="py-4 px-5 rounded-2xl font-semibold text-white/50"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          🏠
        </motion.button>
      </div>
    </div>
  )
}
