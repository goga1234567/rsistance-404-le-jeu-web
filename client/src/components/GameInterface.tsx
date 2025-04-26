import { useState, useEffect, useContext } from "react";
import { motion } from "framer-motion";
import Terminal from "./Terminal";
import StatusBar from "./StatusBar";
import NetworkMap from "./NetworkMap";
import HackingProgress from "./HackingProgress";
import Puzzle from "./Puzzle";
import { useGameState } from "../lib/stores/useGameState";
import { useAudio } from "../lib/stores/useAudio";
import { GameContext } from "../contexts/GameContext";

const GameInterface = () => {
  const [showMap, setShowMap] = useState(false);
  const { securityLevel, hackingPoints, availableTools, currentPuzzle } = useGameState();
  const { playerName } = useContext(GameContext);
  
  // Start background music when game interface loads
  useEffect(() => {
    const { backgroundMusic, toggleMute, isMuted } = useAudio.getState();
    if (backgroundMusic && isMuted) {
      toggleMute(); // Turn sound on
      backgroundMusic.play().catch(error => {
        console.log("Error playing background music:", error);
      });
    }
    
    // Clean up
    return () => {
      if (backgroundMusic) {
        backgroundMusic.pause();
      }
    };
  }, []);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-screen w-full flex flex-col bg-[#080c12] text-green-400 overflow-hidden"
    >
      <StatusBar 
        playerName={playerName}
        securityLevel={securityLevel}
        hackingPoints={hackingPoints}
        tools={availableTools}
      />
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4 overflow-hidden">
        <motion.div 
          layout
          className={`flex-1 flex flex-col ${currentPuzzle ? 'md:w-1/2' : 'w-full'} h-full overflow-hidden`}
        >
          <Terminal />
        </motion.div>
        
        {currentPuzzle && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 md:w-1/2 h-full overflow-hidden"
          >
            <Puzzle puzzle={currentPuzzle} />
          </motion.div>
        )}
      </div>
      
      {/* Network Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-3xl bg-[#0a0e16] border border-[#1a2e46] rounded-lg overflow-hidden"
          >
            <div className="flex justify-between items-center px-4 py-2 border-b border-[#1a2e46]">
              <h2 className="text-xl font-bold text-[#32ffa7]">Network Map</h2>
              <button 
                onClick={() => setShowMap(false)}
                className="text-gray-400 hover:text-white"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="p-4">
              <NetworkMap />
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Bottom Toolbar */}
      <div className="bg-[#0d1420] border-t border-[#1a2e46] p-2 flex justify-between items-center">
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowMap(true)}
            className="px-3 py-1 bg-[#1a2e46] hover:bg-[#2a3e56] rounded text-sm flex items-center"
          >
            <i className="bi bi-diagram-3 mr-1"></i> Network Map
          </button>
        </div>
        
        <HackingProgress />
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => useAudio.getState().toggleMute()}
            className="p-2 text-gray-400 hover:text-white"
          >
            {useAudio.getState().isMuted ? (
              <i className="bi bi-volume-mute"></i>
            ) : (
              <i className="bi bi-volume-up"></i>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GameInterface;
