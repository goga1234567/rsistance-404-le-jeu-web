import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useGameState } from "../lib/stores/useGameState";
import { useTerminal } from "../lib/stores/useTerminal";
import { useAudio } from "../lib/stores/useAudio";
import type { Puzzle as PuzzleType } from "../types";

interface PuzzleProps {
  puzzle: PuzzleType;
}

const Puzzle = ({ puzzle }: PuzzleProps) => {
  const [selectedNodes, setSelectedNodes] = useState<number[]>([]);
  const [completed, setCompleted] = useState(false);
  const { addHackingPoints, updateSecurityLevel, setPuzzle } = useGameState();
  const { addLine } = useTerminal();
  
  // Handle node selection
  const toggleNode = (id: number) => {
    if (completed) return;
    
    if (selectedNodes.includes(id)) {
      setSelectedNodes(selectedNodes.filter(nodeId => nodeId !== id));
    } else {
      setSelectedNodes([...selectedNodes, id]);
      
      // Play hit sound
      const { hitSound, isMuted } = useAudio.getState();
      if (hitSound && !isMuted) {
        hitSound.currentTime = 0;
        hitSound.play().catch(error => {
          console.log("Error playing sound:", error);
        });
      }
    }
  };
  
  // Check if the puzzle is solved
  useEffect(() => {
    if (puzzle.type === "node_sequence" && puzzle.solution) {
      // For sequence puzzles, check if the selected nodes match the solution
      const sequenceSolution = puzzle.solution as number[];
      if (selectedNodes.length === sequenceSolution.length) {
        let correct = true;
        for (let i = 0; i < selectedNodes.length; i++) {
          if (selectedNodes[i] !== sequenceSolution[i]) {
            correct = false;
            break;
          }
        }
        
        if (correct) {
          solvePuzzle();
        }
      }
    } else if (puzzle.type === "node_selection" && puzzle.solution) {
      // For selection puzzles, check if all required nodes are selected (order doesn't matter)
      const selectionSolution = puzzle.solution as number[];
      if (selectedNodes.length === selectionSolution.length) {
        const allSelected = selectionSolution.every(node => selectedNodes.includes(node));
        if (allSelected) {
          solvePuzzle();
        }
      }
    }
  }, [selectedNodes]);
  
  // Solve the puzzle
  const solvePuzzle = () => {
    setCompleted(true);
    
    // Play success sound
    const { successSound, isMuted } = useAudio.getState();
    if (successSound && !isMuted) {
      successSound.currentTime = 0;
      successSound.play().catch(error => {
        console.log("Error playing sound:", error);
      });
    }
    
    // Add points for solving
    addHackingPoints(puzzle.reward || 100);
    
    // Reduce security level
    updateSecurityLevel(-10);
    
    // Add message to terminal
    addLine("Puzzle successfully solved! Security protocols bypassed.", "success");
    
    // Close the puzzle after a delay
    setTimeout(() => {
      setPuzzle(null);
    }, 2000);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-[#0a0e16] border border-[#1a2e46] rounded overflow-hidden flex flex-col"
    >
      <div className="bg-[#0d1420] border-b border-[#1a2e46] px-4 py-2 flex justify-between items-center">
        <h3 className="text-[#32ffa7] font-semibold">{puzzle.title}</h3>
        <div className="text-[#a0b0c7] text-xs">
          {completed ? "SOLVED" : "ACTIVE"}
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-[#32ffa7] animate-pulse"></span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="mb-4 text-[#a0b0c7]">{puzzle.description}</div>
        
        {/* Render puzzle based on type */}
        {puzzle.type === "node_sequence" || puzzle.type === "node_selection" ? (
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {Array.from({ length: 9 }).map((_, index) => {
              const nodeId = index + 1;
              const isSelected = selectedNodes.includes(nodeId);
              const selectionIndex = selectedNodes.indexOf(nodeId) + 1;
              
              return (
                <motion.button
                  key={nodeId}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleNode(nodeId)}
                  className={`aspect-square rounded flex items-center justify-center border-2 transition-all ${
                    isSelected 
                      ? 'border-[#32ffa7] bg-[#32ffa7]/20'
                      : 'border-[#1a2e46] bg-[#0d1420] hover:border-[#32ffa7]/50'
                  }`}
                >
                  {puzzle.type === "node_sequence" && isSelected ? (
                    <span className="font-bold text-[#32ffa7]">{selectionIndex}</span>
                  ) : (
                    <span className="text-[#a0b0c7]">{nodeId}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : puzzle.type === "code_input" ? (
          <div className="max-w-md mx-auto">
            <input
              type="text"
              placeholder="Enter access code..."
              className="w-full px-3 py-2 bg-[#0d1420] border border-[#1a2e46] text-[#32ffa7] rounded focus:outline-none focus:ring-1 focus:ring-[#32ffa7]"
            />
            <button
              className="mt-2 w-full px-4 py-2 bg-[#1a2e46] text-[#32ffa7] rounded hover:bg-[#2a3e56]"
            >
              Submit Code
            </button>
          </div>
        ) : null}
      </div>
      
      <div className="border-t border-[#1a2e46] p-3 bg-[#0d1420]">
        <div className="flex justify-between items-center">
          <div className="text-xs text-[#a0b0c7]">Security bypass: {completed ? '100%' : `${Math.min(100, selectedNodes.length * 20)}%`}</div>
          <button
            onClick={() => setPuzzle(null)}
            className="px-3 py-1 text-xs text-[#a0b0c7] hover:text-[#32ffa7] border border-[#1a2e46] rounded"
          >
            {completed ? "Close" : "Cancel"}
          </button>
        </div>
      </div>
      
      {completed && (
        <div className="absolute inset-0 bg-[#32ffa7]/10 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-[#0d1420]/90 border-2 border-[#32ffa7] rounded-lg px-8 py-4 text-center"
          >
            <div className="text-2xl font-bold text-[#32ffa7] mb-2">Access Granted</div>
            <div className="text-[#a0b0c7]">Security layer bypassed successfully</div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default Puzzle;
