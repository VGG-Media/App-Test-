import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Screen, GameState, Player } from './types'
import HomeScreen from './components/HomeScreen'
import PlayerSetup from './components/PlayerSetup'
import GameHub from './components/GameHub'
import TruthOrDare from './components/games/TruthOrDare'
import NeverHaveIEver from './components/games/NeverHaveIEver'
import ChaosWheel from './components/games/ChaosWheel'
import HotTakes from './components/games/HotTakes'
import Challenge from './components/games/Challenge'
import Scoreboard from './components/Scoreboard'
import GhostNetwork from './components/games/GhostNetwork'
import ParticleBackground from './components/ui/ParticleBackground'

const pageVariants = {
  initial: { opacity: 0, y: 40, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -40, scale: 0.97 },
}

const pageTransition = {
  type: 'tween',
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.4,
}

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  chaosLevel: 1,
  roundCount: 0,
  activeScreen: 'home',
}

export default function App() {
  const [state, setState] = useState<GameState>(initialState)

  const navigate = useCallback((screen: Screen) => {
    setState(s => ({ ...s, activeScreen: screen }))
  }, [])

  const updatePlayers = useCallback((players: Player[]) => {
    setState(s => ({ ...s, players }))
  }, [])

  const nextPlayer = useCallback(() => {
    setState(s => {
      const next = (s.currentPlayerIndex + 1) % s.players.length
      const newRound = next === 0 ? s.roundCount + 1 : s.roundCount
      const chaosLevel = Math.min(5, Math.floor(newRound / 3) + 1) as 1|2|3|4|5
      return { ...s, currentPlayerIndex: next, roundCount: newRound, chaosLevel }
    })
  }, [])

  const addScore = useCallback((playerId: string, points: number) => {
    setState(s => ({
      ...s,
      players: s.players.map(p =>
        p.id === playerId ? { ...p, score: p.score + points } : p
      ),
    }))
  }, [])

  const addDrink = useCallback((playerId: string) => {
    setState(s => ({
      ...s,
      players: s.players.map(p =>
        p.id === playerId ? { ...p, drinks: p.drinks + 1 } : p
      ),
    }))
  }, [])

  const addBadge = useCallback((playerId: string, badge: string) => {
    setState(s => ({
      ...s,
      players: s.players.map(p =>
        p.id === playerId && !p.badges.includes(badge)
          ? { ...p, badges: [...p.badges, badge] }
          : p
      ),
    }))
  }, [])

  const setCurrentPlayer = useCallback((index: number) => {
    setState(s => ({ ...s, currentPlayerIndex: index }))
  }, [])

  const currentPlayer = state.players[state.currentPlayerIndex]

  const sharedProps = {
    state,
    currentPlayer,
    onNavigate: navigate,
    onNextPlayer: nextPlayer,
    onAddScore: addScore,
    onAddDrink: addDrink,
    onAddBadge: addBadge,
  }

  const renderScreen = () => {
    switch (state.activeScreen) {
      case 'home':
        return <HomeScreen onNavigate={navigate} />
      case 'setup':
        return <PlayerSetup onNavigate={navigate} onUpdatePlayers={updatePlayers} players={state.players} />
      case 'hub':
        return <GameHub {...sharedProps} />
      case 'truthordare':
        return <TruthOrDare {...sharedProps} />
      case 'neverhaive':
        return <NeverHaveIEver {...sharedProps} />
      case 'chaoswheel':
        return <ChaosWheel {...sharedProps} onSetCurrentPlayer={setCurrentPlayer} />
      case 'hottakes':
        return <HotTakes {...sharedProps} />
      case 'challenge':
        return <Challenge {...sharedProps} />
      case 'scoreboard':
        return <Scoreboard state={state} onNavigate={navigate} />
      case 'ghostnetwork':
        return <GhostNetwork {...sharedProps} />
      default:
        return <HomeScreen onNavigate={navigate} />
    }
  }

  return (
    <div className="relative min-h-screen min-h-dvh bg-dark-900 overflow-hidden">
      <ParticleBackground />
      <div className="relative z-10 min-h-screen min-h-dvh">
        <AnimatePresence mode="wait">
          <motion.div
            key={state.activeScreen}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={pageTransition}
            className="min-h-screen min-h-dvh"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
