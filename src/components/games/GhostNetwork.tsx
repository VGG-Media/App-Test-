import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { GameState, Screen, Player } from '../../types'
import {
  GHOST_NETWORK_INTRO,
  chapters,
  endings,
  type Chapter,
  type Choice,
} from '../../data/mysteryContent'

interface Props {
  state: GameState
  currentPlayer: Player | undefined
  onNavigate: (screen: Screen) => void
  onNextPlayer: () => void
  onAddScore: (id: string, pts: number) => void
  onAddDrink: (id: string) => void
  onAddBadge: (id: string, badge: string) => void
}

type Phase = 'intro' | 'briefing' | 'chapter' | 'evidence' | 'voting' | 'reveal' | 'ending'

interface GameProgress {
  chapterIndex: number
  justiceScore: number
  tensionLevel: number
  decisions: string[]
  playerVotes: Record<string, string>
}

// --- Typewriter hook ---
function useTypewriter(lines: string[], active: boolean, speed = 30) {
  const [displayed, setDisplayed] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const ref = useRef({ lineIdx: 0, charIdx: 0, interval: 0 as unknown as ReturnType<typeof setInterval> })

  useEffect(() => {
    if (!active) return
    setDisplayed([])
    setDone(false)
    ref.current.lineIdx = 0
    ref.current.charIdx = 0

    const tick = () => {
      const { lineIdx, charIdx } = ref.current
      if (lineIdx >= lines.length) {
        setDone(true)
        clearInterval(ref.current.interval)
        return
      }
      const line = lines[lineIdx]
      if (charIdx <= line.length) {
        setDisplayed(prev => {
          const next = [...prev]
          next[lineIdx] = line.slice(0, charIdx)
          return next
        })
        ref.current.charIdx++
      } else {
        ref.current.lineIdx++
        ref.current.charIdx = 0
        setDisplayed(prev => [...prev, ''])
      }
    }

    ref.current.interval = setInterval(tick, speed)
    return () => clearInterval(ref.current.interval)
  }, [active, lines.join('|'), speed])

  const skip = useCallback(() => {
    setDisplayed(lines)
    setDone(true)
    clearInterval(ref.current.interval)
  }, [lines])

  return { displayed, done, skip }
}

// --- Scanlines overlay ---
function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
      style={{
        backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.5) 2px, rgba(0,255,65,0.5) 4px)',
        backgroundSize: '100% 4px',
      }}
    />
  )
}

// --- Glitch text ---
function GlitchText({ text, className = '', style = {} }: { text: string; className?: string; style?: React.CSSProperties }) {
  return (
    <span className={`relative inline-block ${className}`} style={style}>
      <span className="relative z-10">{text}</span>
      <motion.span
        className="absolute inset-0"
        style={{ color: '#ff0040', clipPath: 'inset(30% 0 30% 0)' }}
        animate={{ x: [-2, 2, -1, 0], opacity: [0, 0.8, 0, 0] }}
        transition={{ duration: 0.15, repeat: Infinity, repeatDelay: 4 }}
      >
        {text}
      </motion.span>
      <motion.span
        className="absolute inset-0"
        style={{ color: '#0088ff', clipPath: 'inset(60% 0 10% 0)' }}
        animate={{ x: [2, -1, 1, 0], opacity: [0, 0.6, 0, 0] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatDelay: 5, delay: 2 }}
      >
        {text}
      </motion.span>
    </span>
  )
}

// --- Terminal lines display ---
function TerminalLines({ lines, className = '' }: { lines: string[]; className?: string }) {
  return (
    <div className={`font-mono text-sm leading-relaxed ${className}`}>
      {lines.map((line, i) => (
        <div key={i} style={{ color: line.startsWith('>') ? '#00ff41' : 'rgba(0,255,65,0.6)', minHeight: '1.4em' }}>
          {line || ' '}
        </div>
      ))}
      <motion.span
        className="inline-block w-2 h-4 ml-1"
        style={{ background: '#00ff41' }}
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </div>
  )
}

// --- Evidence card ---
function EvidenceCard({ evidence }: { evidence: Chapter['evidence'] }) {
  const [open, setOpen] = useState(false)
  const typeIcons = { file: '📄', audio: '🎙️', image: '🖼️', code: '💻', location: '📍' }
  const classColors: Record<string, string> = {
    'TOP SECRET': '#ff0040',
    'CLASSIFIED': '#ff6a00',
    'RESTRICTED': '#ffe600',
    'EYES ONLY': '#a000ff',
  }

  return (
    <div
      className="rounded-xl overflow-hidden border"
      style={{ borderColor: classColors[evidence.classification] + '50', background: 'rgba(0,0,0,0.6)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 p-3 text-left"
      >
        <span className="text-xl">{typeIcons[evidence.type]}</span>
        <div className="flex-1 min-w-0">
          <p className="font-mono text-xs truncate" style={{ color: '#00ff41' }}>{evidence.label}</p>
        </div>
        <span
          className="text-xs font-bold px-2 py-0.5 rounded border flex-shrink-0"
          style={{ color: classColors[evidence.classification], borderColor: classColors[evidence.classification] + '60', background: classColors[evidence.classification] + '15' }}
        >
          {evidence.classification}
        </span>
        <span className="text-white/40 ml-2">{open ? '▲' : '▼'}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="px-4 pb-4 pt-1 font-mono text-xs leading-relaxed whitespace-pre-line border-t"
              style={{ color: '#00cc33', borderColor: 'rgba(0,255,65,0.1)' }}
            >
              {evidence.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// --- Tension meter ---
function TensionMeter({ level }: { level: number }) {
  const max = 20
  const pct = Math.min(100, (level / max) * 100)
  const color = level < 7 ? '#00ff88' : level < 13 ? '#ffe600' : '#ff0040'
  const label = level < 7 ? 'RUHIG' : level < 13 ? 'ANGESPANNT' : 'KRITISCH'

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.5)' }}>SPANNUNG</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,255,65,0.1)' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 8px ${color}` }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6 }}
        />
      </div>
      <span className="font-mono text-xs font-bold" style={{ color }}>{label}</span>
    </div>
  )
}

// --- Main component ---
export default function GhostNetwork({ state, onNavigate, onAddScore, onAddBadge }: Props) {
  const [phase, setPhase] = useState<Phase>('intro')
  const [progress, setProgress] = useState<GameProgress>({
    chapterIndex: 0,
    justiceScore: 0,
    tensionLevel: 0,
    decisions: [],
    playerVotes: {},
  })
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [voteResult, setVoteResult] = useState<{ choice: Choice; tally: Record<string, string> } | null>(null)
  const [endingKey, setEndingKey] = useState<string>('')

  const chapter = chapters[progress.chapterIndex]

  // Briefing typewriter
  const briefingLines = GHOST_NETWORK_INTRO.briefing
  const { displayed: briefingDisplayed, done: briefingDone, skip: skipBriefing } = useTypewriter(briefingLines, phase === 'briefing')

  // Chapter typewriter
  const { displayed: chapterDisplayed, done: chapterDone, skip: skipChapter } = useTypewriter(chapter?.terminalLines ?? [], phase === 'chapter')

  const voteForChoice = useCallback((playerId: string, choiceId: string) => {
    setProgress(p => ({ ...p, playerVotes: { ...p.playerVotes, [playerId]: choiceId } }))
  }, [])

  const allVoted = state.players.length === 0
    ? false
    : state.players.every(p => progress.playerVotes[p.id] !== undefined)

  const confirmVote = useCallback(() => {
    if (!allVoted || !chapter) return
    const votes = progress.playerVotes
    const tally: Record<string, number> = {}
    Object.values(votes).forEach(v => { tally[v] = (tally[v] || 0) + 1 })
    const winnerChoiceId = Object.entries(tally).sort((a, b) => b[1] - a[1])[0][0]
    const winnerChoice = chapter.choices.find(c => c.id === winnerChoiceId)!

    setVoteResult({ choice: winnerChoice, tally: votes })
    setProgress(p => ({
      ...p,
      justiceScore: p.justiceScore + winnerChoice.justicePoints,
      tensionLevel: p.tensionLevel + winnerChoice.tensionPoints + chapter.tensionDelta,
      decisions: [...p.decisions, winnerChoiceId],
      playerVotes: {},
    }))
    setPhase('reveal')

    // Award badges
    state.players.forEach(p => {
      if (winnerChoice.justicePoints >= 4) onAddBadge(p.id, '⚖️')
      if (winnerChoice.tensionPoints >= 4) onAddBadge(p.id, '💀')
    })
  }, [allVoted, chapter, progress.playerVotes, state.players, onAddBadge])

  const goNextChapter = useCallback(() => {
    const next = progress.chapterIndex + 1
    if (next >= chapters.length) {
      // Calculate ending
      const { justiceScore } = progress
      let ending: string
      if (justiceScore >= 14) ending = 'LICHT'
      else if (justiceScore >= 7) ending = 'SCHATTEN'
      else ending = 'DUNKEL'
      setEndingKey(ending)
      setPhase('ending')

      // Award scores based on ending
      const pts = ending === 'LICHT' ? 50 : ending === 'SCHATTEN' ? 25 : 10
      state.players.forEach(p => { onAddScore(p.id, pts); onAddBadge(p.id, '🕵️') })
    } else {
      setProgress(p => ({ ...p, chapterIndex: next, playerVotes: {} }))
      setVoteResult(null)
      setEvidenceOpen(false)
      setPhase('chapter')
    }
  }, [progress, state.players, onAddScore, onAddBadge])

  // -- INTRO SCREEN --
  if (phase === 'intro') {
    return (
      <div className="min-h-screen min-h-dvh flex flex-col items-center justify-center px-4 py-8"
        style={{ background: '#000000', fontFamily: 'monospace' }}
      >
        <Scanlines />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full max-w-sm flex flex-col items-center gap-6 text-center"
        >
          {/* Logo */}
          <div className="relative">
            <motion.div
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-8xl select-none"
            >
              👁️
            </motion.div>
            <motion.div
              className="absolute -inset-4 rounded-full border"
              style={{ borderColor: 'rgba(0,255,65,0.2)' }}
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>

          <div>
            <GlitchText
              text="GHOST NETWORK"
              className="block text-3xl font-black tracking-widest"
              style={{ color: '#00ff41' }}
            />
            <p className="font-mono text-sm mt-2" style={{ color: 'rgba(0,255,65,0.5)' }}>
              SIGNAL_VERLOREN.exe
            </p>
          </div>

          <div
            className="w-full rounded-xl p-4 text-left"
            style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.15)' }}
          >
            <p className="font-mono text-xs leading-relaxed" style={{ color: 'rgba(0,255,65,0.7)' }}>
              Ein kooperatives Mystery-Spiel.<br />
              Alle spielen gemeinsam als Gruppe.<br />
              Ihr seid <span style={{ color: '#00ff41' }}>GHOST NETWORK</span> —<br />
              ein anonymes Hackerkollektiv.<br />
              <br />
              Trefft eure Entscheidungen demokratisch.<br />
              Die Mehrheit entscheidet.<br />
              <br />
              Findet Elena. Oder findet die Wahrheit.<br />
              Beides gleichzeitig ist vielleicht nicht möglich.
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => setPhase('briefing')}
            className="w-full py-4 rounded-xl font-mono font-bold tracking-widest text-black"
            style={{ background: '#00ff41', boxShadow: '0 0 30px rgba(0,255,65,0.5)' }}
          >
            &gt; VERBINDUNG AUFBAUEN_
          </motion.button>

          <button
            onClick={() => onNavigate('hub')}
            className="font-mono text-xs"
            style={{ color: 'rgba(0,255,65,0.3)' }}
          >
            &lt; ZURÜCK
          </button>
        </motion.div>
      </div>
    )
  }

  // -- BRIEFING --
  if (phase === 'briefing') {
    return (
      <div className="min-h-screen min-h-dvh flex flex-col px-4 py-6"
        style={{ background: '#000000' }}
      >
        <Scanlines />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>GHOST_NETWORK v1.0</p>
            <GlitchText text="EINGEHENDE NACHRICHT" className="font-mono font-bold text-sm" style={{ color: '#00ff41' }} />
          </div>
          <span className="font-mono text-xs px-2 py-1 rounded border" style={{ color: '#ff0040', borderColor: '#ff004040', background: '#ff004010' }}>
            LIVE
          </span>
        </div>

        {/* Terminal window */}
        <div
          className="flex-1 rounded-2xl p-4 overflow-y-auto mb-5"
          style={{ background: 'rgba(0,10,0,0.8)', border: '1px solid rgba(0,255,65,0.2)' }}
        >
          <div className="flex gap-2 mb-3">
            {['#ff5f57', '#ffbd2e', '#28c941'].map(c => (
              <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
            ))}
            <span className="font-mono text-xs ml-2" style={{ color: 'rgba(0,255,65,0.4)' }}>
              terminal — ghost_network_secure
            </span>
          </div>
          <TerminalLines lines={briefingDisplayed} />
        </div>

        {/* Controls */}
        <div className="flex gap-3">
          {!briefingDone && (
            <button
              onClick={skipBriefing}
              className="py-3 px-5 rounded-xl font-mono text-sm"
              style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.15)', color: 'rgba(0,255,65,0.5)' }}
            >
              SKIP &gt;&gt;
            </button>
          )}
          <motion.button
            onClick={() => briefingDone && setPhase('chapter')}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-4 rounded-xl font-mono font-bold text-black"
            style={{
              background: briefingDone ? '#00ff41' : 'rgba(0,255,65,0.1)',
              color: briefingDone ? '#000' : 'rgba(0,255,65,0.3)',
              boxShadow: briefingDone ? '0 0 20px rgba(0,255,65,0.4)' : 'none',
              transition: 'all 0.3s',
            }}
            animate={briefingDone ? { scale: [1, 1.02, 1] } : {}}
            transition={{ duration: 1, repeat: briefingDone ? Infinity : 0 }}
          >
            {briefingDone ? '> KAPITEL 01 STARTEN_' : '> EMPFANGE DATEN...'}
          </motion.button>
        </div>
      </div>
    )
  }

  // -- CHAPTER / EVIDENCE / VOTING / REVEAL --
  if (phase === 'chapter' || phase === 'evidence' || phase === 'voting' || phase === 'reveal') {
    return (
      <div className="min-h-screen min-h-dvh flex flex-col px-4 py-6" style={{ background: '#000000' }}>
        <Scanlines />

        {/* Header with chapter + tension */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-mono text-xs" style={{ color: '#ff0040' }}>
                [{chapter.id.replace('_', ' ').toUpperCase()}]
              </p>
              <GlitchText
                text={chapter.subtitle}
                className="font-mono font-bold text-lg"
                style={{ color: '#00ff41' }}
              />
            </div>
            <div className="text-right">
              <p className="font-mono text-xs" style={{ color: 'rgba(0,255,65,0.4)' }}>
                {progress.chapterIndex + 1}/5
              </p>
              <p className="font-mono text-xs font-bold" style={{ color: '#ffe600' }}>
                JUSTICE: {progress.justiceScore}
              </p>
            </div>
          </div>
          <TensionMeter level={progress.tensionLevel} />
        </div>

        <AnimatePresence mode="wait">

          {/* CHAPTER INTRO */}
          {phase === 'chapter' && (
            <motion.div key="chapter" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <div
                className="flex-1 rounded-2xl p-4 overflow-y-auto mb-4"
                style={{ background: 'rgba(0,10,0,0.8)', border: '1px solid rgba(0,255,65,0.2)' }}
              >
                <div className="flex gap-2 mb-3">
                  {['#ff5f57', '#ffbd2e', '#28c941'].map(c => (
                    <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <TerminalLines lines={chapterDisplayed} />
              </div>

              <div className="flex gap-3">
                {!chapterDone && (
                  <button onClick={skipChapter} className="py-3 px-4 rounded-xl font-mono text-sm"
                    style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.15)', color: 'rgba(0,255,65,0.4)' }}>
                    SKIP
                  </button>
                )}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => { if (chapterDone) { setEvidenceOpen(true); setPhase('evidence') } }}
                  className="flex-1 py-4 rounded-xl font-mono font-bold text-black"
                  style={{
                    background: chapterDone ? '#00ff41' : 'rgba(0,255,65,0.1)',
                    color: chapterDone ? '#000' : 'rgba(0,255,65,0.3)',
                    boxShadow: chapterDone ? '0 0 20px rgba(0,255,65,0.4)' : 'none',
                    transition: 'all 0.3s',
                  }}
                  animate={chapterDone ? { scale: [1, 1.01, 1] } : {}}
                  transition={{ duration: 1.5, repeat: chapterDone ? Infinity : 0 }}
                >
                  {chapterDone ? '> BEWEIS PRÜFEN_' : '> ANALYSE LÄUFT...'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* EVIDENCE */}
          {phase === 'evidence' && (
            <motion.div key="evidence" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.5)' }}>
                &gt; BEWEISDATEI ENTSCHLÜSSELT:
              </p>
              <EvidenceCard evidence={chapter.evidence} />

              <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(255,230,0,0.05)', border: '1px solid rgba(255,230,0,0.2)' }}>
                <p className="font-mono text-xs" style={{ color: '#ffe600' }}>
                  💡 LEST DIE DATEI GEMEINSAM. Diskutiert. Dann entscheidet ihr als Gruppe.
                </p>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setPhase('voting')}
                className="mt-4 py-4 rounded-xl font-mono font-bold text-black"
                style={{ background: '#ff6a00', boxShadow: '0 0 20px rgba(255,106,0,0.4)' }}
              >
                &gt; ENTSCHEIDUNG TREFFEN_
              </motion.button>
            </motion.div>
          )}

          {/* VOTING */}
          {phase === 'voting' && (
            <motion.div key="voting" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <p className="font-mono text-sm font-bold mb-4" style={{ color: '#00ff41' }}>
                &gt; ALLE STIMMEN AB — MEHRHEIT ENTSCHEIDET:
              </p>

              <div className="space-y-3 mb-5">
                {chapter.choices.map(choice => (
                  <div
                    key={choice.id}
                    className="rounded-2xl p-4"
                    style={{
                      background: 'rgba(0,10,0,0.8)',
                      border: '1px solid rgba(0,255,65,0.2)',
                    }}
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <span className="text-2xl">{choice.emoji}</span>
                      <div>
                        <p className="font-mono font-bold text-sm" style={{ color: '#00ff41' }}>{choice.label}</p>
                        <p className="font-mono text-xs mt-0.5" style={{ color: 'rgba(0,255,65,0.5)' }}>{choice.subtext}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {state.players.map(player => {
                        const voted = progress.playerVotes[player.id] === choice.id
                        return (
                          <motion.button
                            key={player.id}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => voteForChoice(player.id, choice.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
                            style={{
                              background: voted ? `${player.color}30` : 'rgba(0,255,65,0.05)',
                              border: voted ? `1px solid ${player.color}80` : '1px solid rgba(0,255,65,0.15)',
                              color: voted ? player.color : 'rgba(0,255,65,0.5)',
                              boxShadow: voted ? `0 0 10px ${player.color}40` : 'none',
                            }}
                          >
                            <span>{player.emoji}</span>
                            <span>{player.name}</span>
                            {voted && <span>✓</span>}
                          </motion.button>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={confirmVote}
                disabled={!allVoted}
                className="py-4 rounded-xl font-mono font-bold text-black"
                style={{
                  background: allVoted ? '#00ff41' : 'rgba(0,255,65,0.1)',
                  color: allVoted ? '#000' : 'rgba(0,255,65,0.3)',
                  boxShadow: allVoted ? '0 0 20px rgba(0,255,65,0.4)' : 'none',
                  opacity: allVoted ? 1 : 0.6,
                }}
              >
                {allVoted
                  ? '> ENTSCHEIDUNG BESTÄTIGEN_'
                  : `> WARTET AUF ${state.players.length - Object.keys(progress.playerVotes).length} STIMME(N)...`
                }
              </motion.button>
            </motion.div>
          )}

          {/* REVEAL */}
          {phase === 'reveal' && voteResult && (
            <motion.div key="reveal" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col">
              <p className="font-mono text-xs mb-3" style={{ color: 'rgba(0,255,65,0.5)' }}>
                &gt; GRUPPENENTSCHEID AUSGEFÜHRT:
              </p>

              {/* Chosen option */}
              <div
                className="rounded-2xl p-5 mb-4"
                style={{ background: 'rgba(0,10,0,0.9)', border: '1px solid rgba(0,255,65,0.4)', boxShadow: '0 0 20px rgba(0,255,65,0.1)' }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{voteResult.choice.emoji}</span>
                  <p className="font-mono font-bold" style={{ color: '#00ff41' }}>{voteResult.choice.label}</p>
                </div>
                <div className="h-px mb-3" style={{ background: 'rgba(0,255,65,0.2)' }} />
                <p className="font-mono text-sm leading-relaxed" style={{ color: 'rgba(0,255,65,0.7)' }}>
                  &gt; {voteResult.choice.consequence}
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="rounded-xl p-3" style={{ background: 'rgba(0,255,136,0.08)', border: '1px solid rgba(0,255,136,0.2)' }}>
                  <p className="font-mono text-xs" style={{ color: 'rgba(0,255,136,0.5)' }}>GERECHTIGKEIT</p>
                  <p className="font-mono font-black text-xl" style={{ color: '#00ff88' }}>
                    +{voteResult.choice.justicePoints}
                  </p>
                </div>
                <div className="rounded-xl p-3" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}>
                  <p className="font-mono text-xs" style={{ color: 'rgba(255,68,68,0.5)' }}>SPANNUNG</p>
                  <p className="font-mono font-black text-xl" style={{ color: '#ff4444' }}>
                    +{voteResult.choice.tensionPoints}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={goNextChapter}
                className="py-4 rounded-xl font-mono font-bold text-black mt-auto"
                style={{ background: '#ff6a00', boxShadow: '0 0 20px rgba(255,106,0,0.4)' }}
                animate={{ scale: [1, 1.01, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                {progress.chapterIndex >= chapters.length - 1
                  ? '> FINALE INITIIEREN_'
                  : `> KAPITEL ${(progress.chapterIndex + 2).toString().padStart(2, '0')} LADEN_`
                }
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  // -- ENDING --
  if (phase === 'ending') {
    const ending = endings[endingKey] ?? endings['SCHATTEN']
    return (
      <div className="min-h-screen min-h-dvh flex flex-col px-4 py-8"
        style={{ background: '#000000' }}
      >
        <Scanlines />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="flex-1 flex flex-col items-center justify-center gap-6"
        >
          {/* Ending badge */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.5 }}
            className="flex flex-col items-center gap-3"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-7xl"
            >
              {ending.emoji}
            </motion.div>
            <div
              className="px-4 py-1 rounded-full font-mono font-bold text-sm"
              style={{ background: ending.color + '20', border: `1px solid ${ending.color}60`, color: ending.color }}
            >
              {ending.code}
            </div>
          </motion.div>

          {/* Title */}
          <GlitchText
            text={ending.title}
            className="text-3xl font-black tracking-widest text-center font-mono"
            style={{ color: ending.color }}
          />

          {/* Description */}
          <div
            className="w-full max-w-sm rounded-2xl p-5"
            style={{ background: 'rgba(0,10,0,0.9)', border: `1px solid ${ending.color}30` }}
          >
            <p className="font-mono text-sm font-bold mb-3" style={{ color: ending.color }}>
              {ending.description}
            </p>
            <div className="h-px mb-3" style={{ background: `${ending.color}20` }} />
            <p className="font-mono text-xs leading-relaxed whitespace-pre-line" style={{ color: 'rgba(0,255,65,0.6)' }}>
              {ending.detail}
            </p>
          </div>

          {/* Stats */}
          <div className="w-full max-w-sm grid grid-cols-3 gap-2">
            {[
              { label: 'JUSTICE', value: progress.justiceScore, color: '#00ff88' },
              { label: 'SPANNUNG', value: progress.tensionLevel, color: '#ff4444' },
              { label: 'KAPITEL', value: chapters.length, color: '#00f5ff' },
            ].map(s => (
              <div key={s.label} className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(0,10,0,0.8)', border: `1px solid ${s.color}20` }}
              >
                <p className="font-mono font-black text-xl" style={{ color: s.color }}>{s.value}</p>
                <p className="font-mono text-xs mt-0.5" style={{ color: 'rgba(0,255,65,0.4)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="w-full max-w-sm flex gap-3">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => {
                setPhase('intro')
                setProgress({ chapterIndex: 0, justiceScore: 0, tensionLevel: 0, decisions: [], playerVotes: {} })
                setVoteResult(null)
              }}
              className="flex-1 py-4 rounded-xl font-mono font-bold text-black"
              style={{ background: '#00ff41', boxShadow: '0 0 20px rgba(0,255,65,0.4)' }}
            >
              &gt; NEU STARTEN_
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onNavigate('hub')}
              className="py-4 px-5 rounded-xl font-mono text-sm"
              style={{ background: 'rgba(0,255,65,0.05)', border: '1px solid rgba(0,255,65,0.2)', color: 'rgba(0,255,65,0.5)' }}
            >
              HUB
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  return null
}
