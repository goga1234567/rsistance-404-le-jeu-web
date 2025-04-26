// Game phases
export type GamePhase = "intro" | "playing" | "boss" | "victory" | "defeat";

// Terminal line types
export interface TerminalLine {
  content: string;
  type?: string;
  id: string;
}

// Command result interface
export interface CommandResult {
  success: boolean;
  output: string;
  error?: boolean;
  clearTerminal?: boolean;
  securityDelta?: number;
  pointsEarned?: number;
  puzzle?: Puzzle;
  levelCompleted?: number;
  unlockTool?: string;
}

// Puzzle interface
export interface Puzzle {
  id: number;
  type: "node_sequence" | "node_selection" | "code_input";
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  solution: number[] | string;
  reward: number;
}

// Level interface
export interface Level {
  id: number;
  name: string;
  type: string;
  difficulty: string;
  description: string;
  status: string;
  vulnerabilities: string[];
  rewardPoints: number;
}

// Game state interface
export interface GameState {
  gamePhase: GamePhase;
  playerName: string;
  currentLevel: number;
  unlockedLevels: number[];
  completedLevels: number[];
  currentPuzzle: Puzzle | null;
  levelData: Level[];
  securityLevel: number;
  hackingPoints: number;
  availableTools: string[];
}

// Game data interface
export interface GameData {
  title: string;
  version: string;
  initialStats: {
    securityLevel: number;
    hackingPoints: number;
  };
  tools: {
    name: string;
    description: string;
    defaultAccess: boolean;
  }[];
  story: {
    intro: string;
    outro: string;
    bossIntro: string;
  };
}
