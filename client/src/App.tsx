import { useEffect, useState } from "react";
import { GameContext } from "./contexts/GameContext";
import { AnimatePresence } from "framer-motion";
import IntroScreen from "./components/IntroScreen";
import GameInterface from "./components/GameInterface";
import { useGameState } from "./lib/stores/useGameState";
import { useTerminal } from "./lib/stores/useTerminal";
import { useAudio } from "./lib/stores/useAudio";
import BossEncounter from "./components/BossEncounter";

function App() {
  const [loadingComplete, setLoadingComplete] = useState(false);
  const { gamePhase, playerName, setPlayerName, initializeGame } = useGameState();
  const { initializeTerminal } = useTerminal();
  
  // Initialize audio elements
  useEffect(() => {
    // Background music
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    // Success sound
    const successSound = new Audio("/sounds/success.mp3");
    successSound.volume = 0.5;
    
    // Hit/error sound
    const hitSound = new Audio("/sounds/hit.mp3");
    hitSound.volume = 0.4;
    
    // Set the sounds in the audio store
    const { setBackgroundMusic, setSuccessSound, setHitSound } = useAudio.getState();
    setBackgroundMusic(bgMusic);
    setSuccessSound(successSound);
    setHitSound(hitSound);
    
    // Simulate loading assets
    const timer = setTimeout(() => {
      setLoadingComplete(true);
      initializeGame();
      initializeTerminal();
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  // Start the game when player name is set
  const startGame = (name: string) => {
    setPlayerName(name);
  };

  return (
    <GameContext.Provider value={{ playerName }}>
      <div className="min-h-screen bg-[#080c12] text-green-400 font-mono">
        <AnimatePresence mode="wait">
          {!loadingComplete && (
            <div className="flex items-center justify-center min-h-screen">
              <div className="animate-pulse text-xl text-neon-green">
                Loading system...
              </div>
            </div>
          )}
          
          {loadingComplete && gamePhase === "intro" && (
            <IntroScreen onStart={startGame} />
          )}
          
          {loadingComplete && gamePhase === "playing" && (
            <GameInterface />
          )}
          
          {loadingComplete && gamePhase === "boss" && (
            <BossEncounter />
          )}
          
          {loadingComplete && gamePhase === "victory" && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
              <h1 className="text-4xl font-bold text-neon-blue mb-4">Mission Complete</h1>
              <p className="text-xl mb-8">You've successfully defeated AI Sovereign404 and reclaimed the free web!</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-neon-blue/20 border border-neon-blue text-neon-blue rounded hover:bg-neon-blue/30 transition-all"
              >
                New Mission
              </button>
            </div>
          )}
          
          {loadingComplete && gamePhase === "defeat" && (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
              <h1 className="text-4xl font-bold text-red-500 mb-4">Mission Failed</h1>
              <p className="text-xl mb-8">AI Sovereign404 has detected your presence and locked you out of the system.</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-500/20 border border-red-500 text-red-500 rounded hover:bg-red-500/30 transition-all"
              >
                Retry Mission
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </GameContext.Provider>
  );
}

export default App;
