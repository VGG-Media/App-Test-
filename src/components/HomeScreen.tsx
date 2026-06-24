import { motion } from 'framer-motion'
import type { Screen } from '../types'

interface Props {
  onNavigate: (screen: Screen) => void
}

const floatVariants = {
  animate: {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
}

const staggerChildren = {
  animate: {
    transition: { staggerChildren: 0.12 },
  },
}

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        variants={staggerChildren}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-6 w-full max-w-sm"
      >
        {/* Logo */}
        <motion.div variants={floatVariants} animate="animate" className="relative">
          <div className="relative">
            <div
              className="w-28 h-28 rounded-3xl flex items-center justify-center text-6xl"
              style={{
                background: 'linear-gradient(135deg, rgba(255,0,170,0.2), rgba(160,0,255,0.2))',
                border: '1px solid rgba(255,0,170,0.4)',
                boxShadow: '0 0 40px rgba(255,0,170,0.3), 0 0 80px rgba(160,0,255,0.15)',
              }}
            >
              🎉
            </div>
            {/* Orbiting dots */}
            <motion.div
              className="absolute w-3 h-3 rounded-full"
              style={{ background: '#ff00aa', boxShadow: '0 0 8px #ff00aa', top: -4, right: -4 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute w-2 h-2 rounded-full"
              style={{ background: '#00f5ff', boxShadow: '0 0 8px #00f5ff', bottom: 0, left: -4 }}
              animate={{ rotate: -360 }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div variants={fadeUp} className="text-center">
          <h1
            className="text-5xl font-black tracking-tight leading-none mb-2"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #ff00aa, #a000ff, #00f5ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: 'none',
            }}
          >
            CHAOS
          </h1>
          <h1
            className="text-5xl font-black tracking-tight leading-none"
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              background: 'linear-gradient(135deg, #00f5ff, #a000ff, #ff00aa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            PARTY
          </h1>
          <p className="text-white/50 text-sm mt-3 font-medium tracking-widest uppercase">
            Die ultimative Partyspiel-App
          </p>
        </motion.div>

        {/* Feature pills */}
        <motion.div variants={fadeUp} className="flex flex-wrap gap-2 justify-center">
          {['🎯 5 Spiele', '🌀 Chaos-Level', '🏆 Scoring', '🎲 Zufallsrad'].map(tag => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
              }}
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div variants={fadeUp} className="w-full">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onNavigate('setup')}
            className="btn-neon w-full py-5 rounded-2xl font-bold text-lg text-white tracking-wide relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #ff00aa, #a000ff)',
              boxShadow: '0 0 30px rgba(255,0,170,0.4), 0 4px 20px rgba(0,0,0,0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            <span className="relative z-10">🚀 Party starten</span>
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div variants={fadeUp} className="w-full flex items-center gap-3">
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
          <span className="text-white/30 text-xs">oder</span>
          <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.1)' }} />
        </motion.div>

        {/* Quick play */}
        <motion.div variants={fadeUp} className="w-full grid grid-cols-2 gap-3">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('setup')}
            className="py-3 px-4 rounded-xl text-sm font-semibold text-white/70 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            👥 Spieler anlegen
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('hub')}
            className="py-3 px-4 rounded-xl text-sm font-semibold text-white/70 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            ⚡ Direkt spielen
          </motion.button>
        </motion.div>

        {/* Version */}
        <motion.p variants={fadeUp} className="text-white/20 text-xs">
          v1.0 · Made with ❤️ for epic parties
        </motion.p>
      </motion.div>
    </div>
  )
}
