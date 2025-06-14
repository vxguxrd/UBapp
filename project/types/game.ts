export interface Player {
  id: number;
  name: string;
  avatar: string | null;
  role?: PlayerRole;
  isAlive?: boolean;
}

export type PlayerRole = 'civilian' | 'undercover' | 'mrwhite';

export interface GameSettings {
  numPlayers: number;
  numUndercovers: number;
  hasMrWhite: boolean;
  players: Player[];
}

export interface WordPair {
  civilian: string;
  undercover: string;
}

export interface GameState {
  players: Player[];
  alivePlayers: Player[];
  totalPlayers: number;
  civilWord: string;
  undercoverWord: string;
  currentRound: number;
  gamePhase: 'setup' | 'playing' | 'ended';
  winner?: string;
}