import { create } from "zustand";
import { executeCommand } from "../../data/commands";
import { useGameState } from "./useGameState";
import { useAudio } from "./useAudio";
import type { TerminalLine } from "../../types";

interface TerminalState {
  lines: TerminalLine[];
  history: string[];
  historyIndex: number;
  prompt: string;
  
  // Actions
  addLine: (content: string, type?: string) => void;
  clearTerminal: () => void;
  setPrompt: (prompt: string) => void;
  executeCommand: (command: string) => void;
  addToHistory: (command: string) => void;
  navigateHistory: (direction: "up" | "down") => string;
  initializeTerminal: () => void;
}

export const useTerminal = create<TerminalState>((set, get) => ({
  lines: [],
  history: [],
  historyIndex: -1,
  prompt: "agent@sovereign-breach:~$",
  
  addLine: (content, type = "output") => {
    set(state => ({
      lines: [...state.lines, { content, type, id: Date.now().toString() }],
    }));
  },
  
  clearTerminal: () => {
    set({ lines: [] });
  },
  
  setPrompt: (prompt) => {
    set({ prompt });
  },
  
  executeCommand: (command) => {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) return;
    
    // Add command to history
    get().addToHistory(trimmedCommand);
    
    // Add the command as a line in the terminal
    get().addLine(`${get().prompt} ${trimmedCommand}`, "command");
    
    // Execute the command and get the result
    const result = executeCommand(trimmedCommand, useGameState.getState());
    
    // Play appropriate sound based on result
    if (result.success) {
      const { successSound, isMuted } = useAudio.getState();
      if (successSound && !isMuted) {
        successSound.currentTime = 0;
        successSound.play().catch(err => console.log("Sound error:", err));
      }
    } else if (result.error) {
      const { hitSound, isMuted } = useAudio.getState();
      if (hitSound && !isMuted) {
        hitSound.currentTime = 0;
        hitSound.play().catch(err => console.log("Sound error:", err));
      }
    }
    
    // Update security level if needed
    if (result.securityDelta) {
      useGameState.getState().updateSecurityLevel(result.securityDelta);
    }
    
    // Add hacking points if earned
    if (result.pointsEarned) {
      useGameState.getState().addHackingPoints(result.pointsEarned);
    }
    
    // Add the result to the terminal
    if (result.output) {
      result.output.split('\n').forEach(line => {
        get().addLine(line, result.error ? "error" : "output");
      });
    }
    
    // Set puzzle if one was returned
    if (result.puzzle) {
      useGameState.getState().setPuzzle(result.puzzle);
    }
    
    // Mark level as completed if command completed it
    if (result.levelCompleted !== undefined) {
      useGameState.getState().completeLevel(result.levelCompleted);
    }
    
    // Unlock a tool if one was provided
    if (result.unlockTool) {
      useGameState.getState().unlockTool(result.unlockTool);
    }
  },
  
  addToHistory: (command) => {
    set(state => ({
      history: [command, ...state.history].slice(0, 50),
      historyIndex: -1,
    }));
  },
  
  navigateHistory: (direction) => {
    const { history, historyIndex } = get();
    let newIndex = historyIndex;
    
    if (direction === "up") {
      newIndex = Math.min(history.length - 1, historyIndex + 1);
    } else if (direction === "down") {
      newIndex = Math.max(-1, historyIndex - 1);
    }
    
    set({ historyIndex: newIndex });
    return newIndex === -1 ? "" : history[newIndex];
  },
  
  initializeTerminal: () => {
    const welcomeMessage = `
====================================
|  SOVEREIGN BREACH - v1.0.0      |
|  Secure Terminal Connection      |
====================================

Welcome, agent. You've been tasked with infiltrating and
reclaiming the web from AI Sovereign404.

Type 'help' to view available commands.
Type 'status' to view your current mission status.
Type 'network' to view available targets.

-- CONNECTION ESTABLISHED --`;

    set({ 
      lines: welcomeMessage.split('\n').map((content, index) => ({
        content,
        type: "system",
        id: `init-${index}`,
      }))
    });
  }
}));
