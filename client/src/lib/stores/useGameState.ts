import { create } from "zustand";
import { levels } from "../../data/levels";
import type { Level, GamePhase, Puzzle } from "../../types";
import { useAudio } from "./useAudio";

interface GameState {
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
  
  // Actions
  setGamePhase: (phase: GamePhase) => void;
  setPlayerName: (name: string) => void;
  incrementLevel: () => void;
  startLevel: (levelId: number) => void;
  completeLevel: (levelId: number) => void;
  setPuzzle: (puzzle: Puzzle | null) => void;
  updateSecurityLevel: (delta: number) => void;
  addHackingPoints: (points: number) => void;
  unlockTool: (tool: string) => void;
  initializeGame: () => void;
  startBossFight: () => void;
  setVictory: () => void;
  setDefeat: () => void;
}

export const useGameState = create<GameState>((set, get) => ({
  gamePhase: "intro",
  playerName: "",
  currentLevel: 0,
  unlockedLevels: [1],
  completedLevels: [],
  currentPuzzle: null,
  levelData: levels,
  securityLevel: 0,
  hackingPoints: 0,
  availableTools: ["scan", "connect", "help"],
  
  setGamePhase: (phase) => set({ gamePhase: phase }),
  
  setPlayerName: (name) => {
    set({ playerName: name });
    set({ gamePhase: "playing" });
  },
  
  incrementLevel: () => {
    const { currentLevel, levelData } = get();
    if (currentLevel < levelData.length - 1) {
      set({ currentLevel: currentLevel + 1 });
    }
  },
  
  startLevel: (levelId) => {
    set({ currentLevel: levelId });
    // Play success sound when starting a level
    const { successSound, isMuted } = useAudio.getState();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Error playing sound:", error);
      });
    }
  },
  
  completeLevel: (levelId) => {
    const { completedLevels, unlockedLevels, levelData } = get();
    
    // Add to completed levels if not already there
    if (!completedLevels.includes(levelId)) {
      const newCompleted = [...completedLevels, levelId];
      set({ completedLevels: newCompleted });
      
      // Add hacking points for completing the level
      get().addHackingPoints(levelData[levelId-1].rewardPoints || 100);
      
      // Unlock the next level if it exists and isn't already unlocked
      if (levelId < levelData.length && !unlockedLevels.includes(levelId + 1)) {
        set({ unlockedLevels: [...unlockedLevels, levelId + 1] });
      }
      
      // If all levels completed, prepare for boss fight
      if (newCompleted.length >= levelData.length - 1) { // -1 because boss level doesn't count
        setTimeout(() => {
          get().startBossFight();
        }, 1500);
      }
    }
  },
  
  setPuzzle: (puzzle) => set({ currentPuzzle: puzzle }),
  
  updateSecurityLevel: (delta) => {
    const newLevel = Math.max(0, Math.min(100, get().securityLevel + delta));
    set({ securityLevel: newLevel });
    
    // If security level reaches 100, game over
    if (newLevel >= 100) {
      get().setDefeat();
    }
  },
  
  addHackingPoints: (points) => {
    set({ hackingPoints: get().hackingPoints + points });
  },
  
  unlockTool: (tool) => {
    const { availableTools } = get();
    if (!availableTools.includes(tool)) {
      set({ availableTools: [...availableTools, tool] });
    }
  },
  
  initializeGame: () => {
    set({
      gamePhase: "intro",
      currentLevel: 0,
      unlockedLevels: [1],
      completedLevels: [],
      securityLevel: 0,
      hackingPoints: 0,
      availableTools: ["scan", "connect", "help"]
    });
  },
  
  startBossFight: () => {
    set({ gamePhase: "boss", currentLevel: levels.length });
  },
  
  setVictory: () => {
    set({ gamePhase: "victory" });
    
    // Play success sound for victory
    const { successSound, isMuted } = useAudio.getState();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Error playing sound:", error);
      });
    }
  },
  
  setDefeat: () => {
    set({ gamePhase: "defeat" });
    
    // Play hit sound for defeat
    const { hitSound, isMuted } = useAudio.getState();
    if (hitSound && !isMuted) {
      hitSound.currentTime = 0;
      hitSound.play().catch(error => {
        console.log("Error playing sound:", error);
      });
    }
  }
}));
