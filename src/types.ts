export type Screen =
  | 'home'
  | 'setup'
  | 'hub'
  | 'truthordare'
  | 'neverhaive'
  | 'hottakes'
  | 'chaoswheel'
  | 'challenge'
  | 'scoreboard'

export interface Player {
  id: string
  name: string
  emoji: string
  color: string
  score: number
  drinks: number
  badges: string[]
}

export interface GameState {
  players: Player[]
  currentPlayerIndex: number
  chaosLevel: number
  roundCount: number
  activeScreen: Screen
}

export type GameMode = {
  id: Screen
  title: string
  emoji: string
  description: string
  color: string
  gradient: string
  minPlayers: number
}
