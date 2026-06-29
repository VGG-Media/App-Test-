import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import {
  MISSION_BRIEFING_LINES,
  DEEP_SIGNAL_CHAPTERS,
  CREW_ROLES,
  getEnding,
  type SignalChoice,
} from '../../data/deepSignalContent'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

type Phase = 'intro' | 'chapter' | 'voting' | 'result' | 'ending'

function useTypewriter(lines: string[], speed = 28, startDelay = 300) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setDisplayed([])
    setDone(false)
    let lineIdx = 0
    let charIdx = 0
    let started = false

    const tick = () => {
      if (!started) {
        started = true
        timerRef.current = setTimeout(tick, startDelay)
        return
      }
      if (lineIdx >= lines.length) {
        setDone(true)
        return
      }
      const line = lines[lineIdx]
      charIdx++
      setDisplayed(prev => {
        const next = [...prev]
        next[lineIdx] = line.slice(0, charIdx)
        return next
      })
      if (charIdx >= line.length) {
        lineIdx++
        charIdx = 0
        timerRef.current = setTimeout(tick, line === '' ? 80 : 60)
      } else {
        timerRef.current = setTimeout(tick, line === '' ? 0 : speed)
      }
    }

    timerRef.current = setTimeout(tick, 0)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [lines, speed, startDelay])

  const skip = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setDisplayed(lines)
    setDone(true)
  }, [lines])

  return { displayed, done, skip }
}

function StarField() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 60 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            width: Math.random() > 0.85 ? 2 : 1,
            height: Math.random() > 0.85 ? 2 : 1,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.1,
          }}
          animate={{ opacity: [Math.random() * 0.6 + 0.1, Math.random() * 0.3 + 0.05, Math.random() * 0.6 + 0.1] }}
          transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, repeatType: 'reverse' }}
        />
      ))}
    </div>
  )
}

function HUD({ morale, clarity }: { morale: number; clarity: number }) {
  return (
    <div className="flex gap-3 mb-5">
      <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(0,191,255,0.06)', border: '1px solid rgba(0,191,255,0.2)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.6)' }}>CREW MORALE</span>
          <span className="font-mono text-xs font-bold" style={{ color: '#00bfff' }}>{morale}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #0066ff, #00bfff)' }}
            animate={{ width: `${morale}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
      <div className="flex-1 rounded-xl p-3" style={{ background: 'rgba(160,0,255,0.06)', border: '1px solid rgba(160,0,255,0.2)' }}>
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-xs" style={{ color: 'rgba(160,0,255,0.6)' }}>SIGNAL CLARITY</span>
          <span className="font-mono text-xs font-bold" style={{ color: '#a000ff' }}>{clarity}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #5500ff, #a000ff)' }}
            animate={{ width: `${Math.min(clarity, 100)}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}

export default function DeepSignal({ state, onNavigate }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [chapterIdx, setChapterIdx] = useState(0)
  const [morale, setMorale] = useState(50)
  const [clarity, setClarity] = useState(0)
  const [votes, setVotes] = useState<Record<string, 'A' | 'B' | 'C'>>({})
  const [lastChoice, setLastChoice] = useState<SignalChoice | null>(null)
  const [transmissionReady, setTransmissionReady] = useState(false)

  const chapter = DEEP_SIGNAL_CHAPTERS[chapterIdx]
  const ending = getEnding(morale, clarity)

  const { displayed: introLines, done: introDone, skip: skipIntro } = useTypewriter(
    MISSION_BRIEFING_LINES, 18, 200
  )
  const { displayed: chapterLines, done: chapterDone, skip: skipChapter } = useTypewriter(
    phase === 'chapter' ? chapter.transmissionLines : [], 22, 300
  )

  useEffect(() => {
    if (chapterDone) {
      const t = setTimeout(() => setTransmissionReady(true), 400)
      return () => clearTimeout(t)
    } else {
      setTransmissionReady(false)
    }
  }, [chapterDone])

  const assignedRoles = state.players.map((p, i) => ({
    player: p,
    role: CREW_ROLES[i % CREW_ROLES.length],
  }))

  const startMission = useCallback(() => {
    setPhase('chapter')
    setChapterIdx(0)
    setVotes({})
  }, [])

  const castVote = useCallback((playerId: string, choiceId: 'A' | 'B' | 'C') => {
    setVotes(prev => ({ ...prev, [playerId]: choiceId }))
  }, [])

  const allVoted = state.players.length > 0
    ? state.players.every(p => votes[p.id])
    : false

  const applyChoice = useCallback((choiceId: 'A' | 'B' | 'C') => {
    const choice = chapter.choices.find(c => c.id === choiceId)
    if (!choice) return
    setLastChoice(choice)
    setMorale(m => Math.max(0, Math.min(100, m + choice.moraleDelta)))
    setClarity(c => Math.max(0, Math.min(100, c + choice.clarityDelta)))
    setPhase('result')
    setVotes({})
  }, [chapter.choices])

  const confirmVote = useCallback(() => {
    const tally: Record<string, number> = {}
    Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1 })
    const winner = (Object.entries(tally).sort((a, b) => b[1] - a[1])[0]?.[0] || 'A') as 'A' | 'B' | 'C'
    applyChoice(winner)
  }, [votes, applyChoice])

  const nextChapter = useCallback(() => {
    if (chapterIdx + 1 >= DEEP_SIGNAL_CHAPTERS.length) {
      setPhase('ending')
    } else {
      setChapterIdx(i => i + 1)
      setPhase('chapter')
      setTransmissionReady(false)
      setLastChoice(null)
    }
  }, [chapterIdx])

  return (
    <div
      className="min-h-screen min-h-dvh flex flex-col px-4 py-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 20% 30%, #020830 0%, #010108 70%)' }}
    >
      <StarField />

      {/* Cosmic scan line overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: 'repeating-linear-gradient(180deg, transparent, transparent 3px, rgba(0,191,255,0.4) 3px, rgba(0,191,255,0.4) 4px)' }}
      />

      {/* Header */}
      <div className="relative z-10 flex items-center gap-3 mb-5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onNavigate('hub')}
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', color: 'rgba(0,191,255,0.5)' }}
        >
          ←
        </motion.button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{ background: '#00bfff', boxShadow: '0 0 6px #00bfff' }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <h2 className="font-mono font-black text-lg tracking-widest" style={{ color: '#00bfff' }}>
              DEEP SIGNAL
            </h2>
          </div>
          <p className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.35)' }}>
            {phase === 'intro' ? 'MISSION BRIEFING' :
              phase === 'ending' ? 'MISSION ABGESCHLOSSEN' :
              `KAPITEL ${chapterIdx + 1}/5 · ${chapter?.location}`}
          </p>
        </div>
        <div
          className="font-mono text-xs px-2 py-1 rounded"
          style={{ background: 'rgba(0,191,255,0.08)', border: '1px solid rgba(0,191,255,0.2)', color: 'rgba(0,191,255,0.5)' }}
        >
          Ω-7
        </div>
      </div>

      {/* HUD — always visible except intro */}
      {phase !== 'intro' && phase !== 'ending' && (
        <div className="relative z-10">
          <HUD morale={morale} clarity={clarity} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        <AnimatePresence mode="wait">

          {/* INTRO PHASE */}
          {phase === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              {/* Crew roles */}
              {state.players.length > 0 && (
                <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)' }}>
                  <p className="font-mono text-xs mb-3" style={{ color: 'rgba(0,191,255,0.5)' }}>CREW-ZUTEILUNG:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {assignedRoles.map(({ player, role }) => (
                      <div key={player.id} className="flex items-center gap-2">
                        <span className="text-lg">{player.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-mono text-xs font-bold truncate" style={{ color: player.color }}>{player.name}</p>
                          <p className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.4)' }}>{role.label}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Briefing terminal */}
              <div
                className="flex-1 rounded-2xl p-4 mb-4 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(0,0,20,0.8)',
                  border: '1px solid rgba(0,191,255,0.2)',
                  minHeight: '280px',
                }}
                onClick={!introDone ? skipIntro : undefined}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #00bfff, transparent)' }} />
                <p className="font-mono text-xs mb-3" style={{ color: 'rgba(0,191,255,0.4)' }}>
                  {'>'} EINGEHENDE NACHRICHT · VERSCHLÜSSELT
                </p>
                <div className="space-y-0.5">
                  {introLines.map((line, i) => (
                    <p
                      key={i}
                      className="font-mono text-xs leading-relaxed"
                      style={{ color: line.startsWith('●') || line.startsWith('──') ? 'rgba(0,191,255,0.4)' : line.startsWith('MISSION') || line.startsWith('KLASSE') || line.startsWith('STARDATE') ? '#00bfff' : 'rgba(255,255,255,0.75)' }}
                    >
                      {line || ' '}
                    </p>
                  ))}
                  {!introDone && (
                    <motion.span
                      className="inline-block w-2 h-3 ml-0.5"
                      style={{ background: '#00bfff' }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                {!introDone && (
                  <p className="absolute bottom-3 right-3 font-mono text-xs" style={{ color: 'rgba(0,191,255,0.3)' }}>
                    Tippen zum Überspringen
                  </p>
                )}
              </div>

              {introDone && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={startMission}
                  className="w-full py-4 rounded-2xl font-mono font-black text-lg tracking-widest"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,102,255,0.3), rgba(0,191,255,0.3))',
                    border: '1px solid rgba(0,191,255,0.5)',
                    color: '#00bfff',
                    boxShadow: '0 0 30px rgba(0,191,255,0.15)',
                  }}
                >
                  🚀 MISSION ANNEHMEN
                </motion.button>
              )}
            </motion.div>
          )}

          {/* CHAPTER PHASE */}
          {phase === 'chapter' && chapter && (
            <motion.div
              key={`chapter-${chapterIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex-1 flex flex-col"
            >
              {/* Chapter header */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'rgba(0,191,255,0.05)', border: '1px solid rgba(0,191,255,0.15)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-xs mb-0.5" style={{ color: 'rgba(0,191,255,0.4)' }}>
                      KAPITEL {chapter.id} / 5
                    </p>
                    <p className="font-mono font-black text-base" style={{ color: '#00bfff' }}>{chapter.title}</p>
                    <p className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.5)' }}>{chapter.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex gap-1 justify-end mb-1">
                      {DEEP_SIGNAL_CHAPTERS.map((_, i) => (
                        <div
                          key={i}
                          className="w-2 h-2 rounded-full"
                          style={{
                            background: i < chapterIdx ? '#00bfff' : i === chapterIdx ? '#00bfff' : 'rgba(0,191,255,0.15)',
                            boxShadow: i === chapterIdx ? '0 0 6px #00bfff' : 'none',
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transmission terminal */}
              <div
                className="flex-1 rounded-2xl p-4 mb-4 relative overflow-hidden cursor-pointer"
                style={{
                  background: 'rgba(0,0,20,0.8)',
                  border: '1px solid rgba(0,191,255,0.2)',
                  minHeight: '220px',
                }}
                onClick={!chapterDone ? skipChapter : undefined}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #00bfff, transparent)' }} />
                <motion.div
                  className="absolute top-2 right-3 flex items-center gap-1.5"
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#00bfff' }} />
                  <span className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.5)' }}>LIVE</span>
                </motion.div>

                <p className="font-mono text-xs mb-3" style={{ color: 'rgba(0,191,255,0.4)' }}>
                  {'>'} TRANSMISSION · {chapter.location}
                </p>
                <div className="space-y-0.5">
                  {chapterLines.map((line, i) => (
                    <p
                      key={i}
                      className="font-mono text-xs leading-relaxed"
                      style={{
                        color: line.startsWith('●') || line.startsWith('──') || line.startsWith('⚠') ? 'rgba(0,191,255,0.5)'
                          : line.startsWith('[') ? 'rgba(160,0,255,0.7)'
                          : line.startsWith('"') ? 'rgba(255,255,255,0.9)'
                          : 'rgba(255,255,255,0.65)',
                        fontStyle: line.startsWith('"') ? 'italic' : 'normal',
                      }}
                    >
                      {line || ' '}
                    </p>
                  ))}
                  {!chapterDone && (
                    <motion.span
                      className="inline-block w-2 h-3 ml-0.5"
                      style={{ background: '#00bfff' }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
                {!chapterDone && (
                  <p className="absolute bottom-3 right-3 font-mono text-xs" style={{ color: 'rgba(0,191,255,0.25)' }}>
                    Tippen zum Überspringen
                  </p>
                )}
              </div>

              {/* Vote button */}
              {transmissionReady && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPhase('voting')}
                  className="w-full py-4 rounded-2xl font-mono font-bold tracking-wider"
                  style={{
                    background: 'linear-gradient(135deg, rgba(0,102,255,0.25), rgba(160,0,255,0.25))',
                    border: '1px solid rgba(0,191,255,0.4)',
                    color: '#00bfff',
                  }}
                >
                  ▶ CREW ENTSCHEIDET_
                </motion.button>
              )}
            </motion.div>
          )}

          {/* VOTING PHASE */}
          {phase === 'voting' && chapter && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <p className="font-mono text-xs text-center mb-4" style={{ color: 'rgba(0,191,255,0.5)' }}>
                {state.players.length > 0 ? '— CREW WÄHLT —' : '— GRUPPE ENTSCHEIDET —'}
              </p>

              <div className="flex flex-col gap-3 mb-5">
                {chapter.choices.map(choice => {
                  const votedPlayers = state.players.filter(p => votes[p.id] === choice.id)
                  const hasVotes = votedPlayers.length > 0

                  return (
                    <div key={choice.id}>
                      <motion.div
                        whileTap={{ scale: 0.98 }}
                        className="rounded-2xl p-4 cursor-pointer"
                        style={{
                          background: hasVotes ? 'rgba(0,191,255,0.1)' : 'rgba(0,0,20,0.6)',
                          border: hasVotes ? '1px solid rgba(0,191,255,0.5)' : '1px solid rgba(0,191,255,0.15)',
                          boxShadow: hasVotes ? '0 0 15px rgba(0,191,255,0.1)' : 'none',
                        }}
                        onClick={() => {
                          if (state.players.length === 0) applyChoice(choice.id)
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className="font-mono font-black text-lg w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                            style={{
                              background: hasVotes ? 'rgba(0,191,255,0.2)' : 'rgba(0,191,255,0.08)',
                              color: hasVotes ? '#00bfff' : 'rgba(0,191,255,0.4)',
                              border: `1px solid ${hasVotes ? 'rgba(0,191,255,0.4)' : 'rgba(0,191,255,0.15)'}`,
                            }}
                          >
                            {choice.id}
                          </span>
                          <p className="font-mono text-sm leading-relaxed" style={{ color: hasVotes ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.6)' }}>
                            {choice.text}
                          </p>
                        </div>

                        {state.players.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {state.players.map(player => (
                              <motion.button
                                key={player.id}
                                whileTap={{ scale: 0.9 }}
                                onClick={e => { e.stopPropagation(); castVote(player.id, choice.id) }}
                                className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono"
                                style={{
                                  background: votes[player.id] === choice.id ? `${player.color}30` : 'rgba(255,255,255,0.04)',
                                  border: votes[player.id] === choice.id ? `1px solid ${player.color}60` : '1px solid rgba(255,255,255,0.08)',
                                  color: votes[player.id] === choice.id ? player.color : 'rgba(255,255,255,0.4)',
                                }}
                              >
                                <span>{player.emoji}</span>
                                <span>{player.name}</span>
                                {votes[player.id] === choice.id && <span>✓</span>}
                              </motion.button>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )
                })}
              </div>

              {state.players.length > 0 && (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={confirmVote}
                  disabled={!allVoted}
                  className="w-full py-4 rounded-2xl font-mono font-bold tracking-wider mt-auto"
                  style={{
                    background: allVoted
                      ? 'linear-gradient(135deg, rgba(0,102,255,0.3), rgba(0,191,255,0.3))'
                      : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${allVoted ? 'rgba(0,191,255,0.5)' : 'rgba(255,255,255,0.08)'}`,
                    color: allVoted ? '#00bfff' : 'rgba(255,255,255,0.2)',
                  }}
                >
                  {allVoted ? '✓ ENTSCHEIDUNG BESTÄTIGEN_' : `WARTEN AUF ${state.players.filter(p => !votes[p.id]).length} STIMME(N)...`}
                </motion.button>
              )}
            </motion.div>
          )}

          {/* RESULT PHASE */}
          {phase === 'result' && lastChoice && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 flex flex-col"
            >
              <div
                className="rounded-3xl p-6 mb-5 relative overflow-hidden"
                style={{
                  background: 'rgba(0,0,20,0.8)',
                  border: '1px solid rgba(0,191,255,0.3)',
                  boxShadow: '0 0 40px rgba(0,191,255,0.08)',
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: 'linear-gradient(90deg, transparent, #00bfff, transparent)' }} />

                <p className="font-mono text-xs mb-2" style={{ color: 'rgba(0,191,255,0.5)' }}>
                  {'>'} KONSEQUENZ ERFASST
                </p>
                <p className="font-mono font-black text-base mb-4" style={{ color: '#00bfff' }}>
                  {lastChoice.consequenceTitle}
                </p>

                <div className="space-y-2 mb-5">
                  {lastChoice.consequenceLines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15 }}
                      className="font-mono text-sm"
                      style={{ color: 'rgba(255,255,255,0.75)' }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>

                <div className="flex gap-3">
                  <div
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{
                      background: lastChoice.moraleDelta >= 0 ? 'rgba(0,191,255,0.08)' : 'rgba(255,68,68,0.08)',
                      border: `1px solid ${lastChoice.moraleDelta >= 0 ? 'rgba(0,191,255,0.2)' : 'rgba(255,68,68,0.2)'}`,
                    }}
                  >
                    <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>MORALE</p>
                    <p className="font-mono font-black text-lg" style={{ color: lastChoice.moraleDelta >= 0 ? '#00bfff' : '#ff4444' }}>
                      {lastChoice.moraleDelta >= 0 ? '+' : ''}{lastChoice.moraleDelta}%
                    </p>
                  </div>
                  <div
                    className="flex-1 rounded-xl p-3 text-center"
                    style={{
                      background: lastChoice.clarityDelta >= 0 ? 'rgba(160,0,255,0.08)' : 'rgba(255,68,68,0.08)',
                      border: `1px solid ${lastChoice.clarityDelta >= 0 ? 'rgba(160,0,255,0.2)' : 'rgba(255,68,68,0.2)'}`,
                    }}
                  >
                    <p className="font-mono text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>CLARITY</p>
                    <p className="font-mono font-black text-lg" style={{ color: lastChoice.clarityDelta >= 0 ? '#a000ff' : '#ff4444' }}>
                      {lastChoice.clarityDelta >= 0 ? '+' : ''}{lastChoice.clarityDelta}%
                    </p>
                  </div>
                </div>
              </div>

              <HUD morale={morale} clarity={clarity} />

              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileTap={{ scale: 0.97 }}
                onClick={nextChapter}
                className="w-full py-4 rounded-2xl font-mono font-bold tracking-wider mt-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(0,102,255,0.3), rgba(160,0,255,0.3))',
                  border: '1px solid rgba(0,191,255,0.4)',
                  color: '#00bfff',
                }}
              >
                {chapterIdx + 1 >= DEEP_SIGNAL_CHAPTERS.length ? '▶ MISSION ABSCHLIESSEN_' : `▶ KAPITEL ${chapterIdx + 2} LADEN_`}
              </motion.button>
            </motion.div>
          )}

          {/* ENDING PHASE */}
          {phase === 'ending' && (
            <motion.div
              key="ending"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              {/* Stars burst animation */}
              <motion.div
                className="w-full rounded-3xl p-8 flex flex-col items-center gap-4 relative overflow-hidden mb-6 text-center"
                style={{
                  background: `radial-gradient(ellipse at 50% 30%, ${ending.color}15, rgba(0,0,20,0.9))`,
                  border: `1px solid ${ending.color}40`,
                  boxShadow: `0 0 60px ${ending.color}15`,
                }}
              >
                <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, transparent, ${ending.color}, transparent)` }} />

                <motion.div
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
                  className="text-7xl"
                >
                  {ending.emoji}
                </motion.div>

                <div>
                  <p className="font-mono text-xs mb-1" style={{ color: `${ending.color}80` }}>
                    MISSION ABGESCHLOSSEN
                  </p>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="font-mono font-black text-2xl mb-1"
                    style={{ color: ending.color, textShadow: `0 0 20px ${ending.color}` }}
                  >
                    {ending.title}
                  </motion.p>
                  <p className="font-mono text-xs" style={{ color: `${ending.color}70` }}>
                    {ending.subtitle}
                  </p>
                </div>

                <div className="space-y-1.5 mt-2">
                  {ending.lines.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.6 + i * 0.12 }}
                      className="font-mono text-sm"
                      style={{
                        color: line === '' ? 'transparent' : line.startsWith('"') ? `${ending.color}` : 'rgba(255,255,255,0.65)',
                        fontStyle: line.startsWith('"') ? 'italic' : 'normal',
                      }}
                    >
                      {line || ' '}
                    </motion.p>
                  ))}
                </div>

                <div className="w-full mt-2 pt-4 border-t" style={{ borderColor: `${ending.color}25` }}>
                  <div className="flex justify-center gap-6">
                    <div className="text-center">
                      <p className="font-mono text-xs" style={{ color: 'rgba(0,191,255,0.5)' }}>MORALE</p>
                      <p className="font-mono font-black text-xl" style={{ color: '#00bfff' }}>{morale}%</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-xs" style={{ color: 'rgba(160,0,255,0.5)' }}>CLARITY</p>
                      <p className="font-mono font-black text-xl" style={{ color: '#a000ff' }}>{clarity}%</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex gap-3 w-full">
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setPhase('intro')
                    setChapterIdx(0)
                    setMorale(50)
                    setClarity(0)
                    setVotes({})
                    setLastChoice(null)
                  }}
                  className="flex-1 py-3 rounded-2xl font-mono text-sm"
                  style={{
                    background: 'rgba(0,191,255,0.06)',
                    border: '1px solid rgba(0,191,255,0.2)',
                    color: 'rgba(0,191,255,0.6)',
                  }}
                >
                  🔄 Nochmal
                </motion.button>
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigate('hub')}
                  className="flex-1 py-3 rounded-2xl font-mono text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                >
                  ← Game Hub
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
