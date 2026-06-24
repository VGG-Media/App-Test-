import { motion } from 'framer-motion'
import type { GameState, Screen, Player } from '../types'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

const GAMES = [
  {
    id: 'truthordare' as Screen,
    title: 'Wahrheit oder Pflicht',
    emoji: '🎯',
    description: 'Klassiker mit Chaos-Eskalation',
    gradient: 'linear-gradient(135deg, #ff00aa, #a000ff)',
    glow: '#ff00aa',
  },
  {
    id: 'neverhaive' as Screen,
    title: 'Ich hab noch nie',
    emoji: '🍻',
    description: 'Wer hat was getan?',
    gradient: 'linear-gradient(135deg, #00f5ff, #0088ff)',
    glow: '#00f5ff',
  },
  {
    id: 'chaoswheel' as Screen,
    title: 'Chaos-Rad',
    emoji: '🌀',
    description: 'Spin & spiele zufällig',
    gradient: 'linear-gradient(135deg, #a000ff, #ff00aa)',
    glow: '#a000ff',
  },
  {
    id: 'hottakes' as Screen,
    title: 'Hot Opinions',
    emoji: '🔥',
    description: 'Heiße Meinungen, Gruppe debattiert',
    gradient: 'linear-gradient(135deg, #ff6a00, #ff0044)',
    glow: '#ff6a00',
  },
  {
    id: 'challenge' as Screen,
    title: 'Group Challenge',
    emoji: '⚡',
    description: 'Alle spielen gemeinsam',
    gradient: 'linear-gradient(135deg, #00ff88, #00f5ff)',
    glow: '#00ff88',
  },
  {
    id: 'ghostnetwork' as Screen,
    title: 'Ghost Network',
    emoji: '👁️',
    description: 'Kooperatives Mystery-Spiel',
    gradient: 'linear-gradient(135deg, #001a00, #00ff41)',
    glow: '#00ff41',
  },
  {
    id: 'scoreboard' as Screen,
    title: 'Scoreboard',
    emoji: '🏆',
    description: 'Rangliste & Stats',
    gradient: 'linear-gradient(135deg, #ffe600, #ff6a00)',
    glow: '#ffe600',
  },
]

const CHAOS_LABELS = ['', 'Harmlos 😇', 'Aufwärmen 😏', 'Würzig 🌶️', 'Wild 🔥', 'CHAOS 💀']
const CHAOS_COLORS = ['', '#00ff88', '#ffe600', '#ff6a00', '#ff0088', '#a000ff']

export default function GameHub({ state, currentPlayer, onNavigate }: Props) {
  const { chaosLevel, roundCount, players } = state

  return (
    <div className="min-h-screen min-h-dvh flex flex-col px-4 py-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2
            className="text-3xl font-black"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #ff00aa, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            GAME HUB
          </h2>
          <p className="text-white/40 text-sm">Runde {roundCount + 1} · Wähle ein Spiel</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('setup')}
          className="px-3 py-2 rounded-xl text-xs text-white/50 font-medium"
          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          ⚙️ Spieler
        </motion.button>
      </div>

      {/* Chaos Level */}
      <div
        className="rounded-2xl p-4 mb-5"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: `1px solid ${CHAOS_COLORS[chaosLevel]}30`,
          boxShadow: `0 0 20px ${CHAOS_COLORS[chaosLevel]}15`,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Chaos-Level</span>
          <span
            className="text-sm font-bold px-3 py-1 rounded-full"
            style={{
              background: `${CHAOS_COLORS[chaosLevel]}20`,
              color: CHAOS_COLORS[chaosLevel],
              border: `1px solid ${CHAOS_COLORS[chaosLevel]}40`,
            }}
          >
            {CHAOS_LABELS[chaosLevel]}
          </span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full rounded-full chaos-meter-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${(chaosLevel / 5) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="text-white/30 text-xs mt-1.5">
          Steigt alle 3 Runden · Level {chaosLevel}/5
        </p>
      </div>

      {/* Current player banner */}
      {currentPlayer && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 rounded-2xl p-3.5 mb-5"
          style={{
            background: `${currentPlayer.color}15`,
            border: `1px solid ${currentPlayer.color}40`,
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${currentPlayer.color}25` }}
          >
            {currentPlayer.emoji}
          </div>
          <div>
            <p className="text-white/50 text-xs">Aktuell dran</p>
            <p className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              {currentPlayer.name}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-white/40 text-xs">Score</p>
            <p className="font-bold" style={{ color: currentPlayer.color }}>
              {currentPlayer.score} Pts
            </p>
          </div>
        </motion.div>
      )}

      {/* Ghost Network – Special Feature Card */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate('ghostnetwork')}
        className="game-card w-full rounded-2xl text-left relative overflow-hidden mb-3"
        style={{
          background: '#000000',
          border: '1px solid rgba(0,255,65,0.3)',
          boxShadow: '0 0 30px rgba(0,255,65,0.1)',
        }}
      >
        {/* Scanlines overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.5) 2px, rgba(0,255,65,0.5) 4px)' }}
        />
        <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, #00ff41, #00cc33)' }} />
        <motion.div
          className="absolute inset-0 opacity-5"
          style={{ background: 'radial-gradient(circle at 80% 50%, #00ff41, transparent 60%)' }}
          animate={{ opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <div className="relative z-10 p-4 flex items-center gap-4">
          <motion.span
            className="text-4xl"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            👁️
          </motion.span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-mono font-black text-base" style={{ color: '#00ff41' }}>
                GHOST NETWORK
              </p>
              <span className="font-mono text-xs px-1.5 py-0.5 rounded border"
                style={{ color: '#00ff41', borderColor: 'rgba(0,255,65,0.4)', background: 'rgba(0,255,65,0.1)' }}>
                NEU
              </span>
            </div>
            <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.5)' }}>
              Kooperatives Mystery • Vermisstenfall lösen • 5 Kapitel
            </p>
          </div>
          <span className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>&gt;_</span>
        </div>
      </motion.button>

      {/* Game grid */}
      <div className="grid grid-cols-2 gap-3 flex-1">
        {GAMES.filter(g => g.id !== 'ghostnetwork').map((game, idx) => (
          <motion.button
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate(game.id)}
            className={`game-card flex flex-col items-start p-4 rounded-2xl text-left relative overflow-hidden ${game.id === 'scoreboard' ? 'col-span-2' : ''}`}
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid rgba(255,255,255,0.08)`,
              boxShadow: `0 4px 20px rgba(0,0,0,0.2)`,
              minHeight: game.id === 'scoreboard' ? 'auto' : '140px',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
              style={{ background: `${game.gradient.replace(')', '20)')}` }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-0.5 rounded-t-2xl"
              style={{ background: game.gradient }}
            />
            <div className="relative z-10 flex flex-col gap-2 h-full w-full">
              {game.id === 'scoreboard' ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{game.emoji}</span>
                  <div>
                    <p className="font-bold text-white" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {game.title}
                    </p>
                    <p className="text-white/40 text-xs">{game.description}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    {players.slice(0, 4).map(p => (
                      <span key={p.id} className="text-lg">{p.emoji}</span>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <span className="text-3xl">{game.emoji}</span>
                  <div className="mt-auto">
                    <p className="font-bold text-sm text-white leading-tight" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                      {game.title}
                    </p>
                    <p className="text-white/40 text-xs mt-1 leading-tight">{game.description}</p>
                  </div>
                </>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Quick player switcher */}
      {players.length > 1 && (
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          {players.map((p, idx) => (
            <div
              key={p.id}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{
                background: idx === state.currentPlayerIndex ? `${p.color}25` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${idx === state.currentPlayerIndex ? p.color + '60' : 'rgba(255,255,255,0.08)'}`,
                color: idx === state.currentPlayerIndex ? p.color : 'rgba(255,255,255,0.4)',
              }}
            >
              <span>{p.emoji}</span>
              <span>{p.name}</span>
              {p.score > 0 && (
                <span className="font-bold ml-1" style={{ color: p.color }}>
                  {p.score}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
