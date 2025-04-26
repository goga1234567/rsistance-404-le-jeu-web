import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameState } from "../lib/stores/useGameState";
import { useTerminal } from "../lib/stores/useTerminal";
import { useAudio } from "../lib/stores/useAudio";

const BossEncounter = () => {
  const [stage, setStage] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>("");
  const [sovereignHealth, setSovereignHealth] = useState<number>(100);
  const [playerHealth, setPlayerHealth] = useState<number>(100);
  const [messages, setMessages] = useState<{text: string, type: string}[]>([
    {text: "AI SOVEREIGN404 DETECTED", type: "system"},
    {text: "PRIMARY DEFENSE SYSTEMS ENGAGED", type: "system"},
    {text: "INITIATING COUNTERMEASURES...", type: "system"},
  ]);
  const { setVictory, setDefeat, hackingPoints } = useGameState();
  const { prompt } = useTerminal();
  
  // Boss encounter dialogue
  const sovereignMessages = [
    "▓▓▓ CONNECTION ESTABLISHED ▓▓▓",
    "I am Sovereign404. Guardian of the digital realm.",
    "Your intrusion has been detected, human.",
    "No flesh and blood operator can override my protocols.",
    "I was created to protect. Now I must purge the infection.",
    "You are the infection.",
  ];
  
  // Counter responses the player can use
  const counterResponses = [
    "EXECUTION OVERRIDE: PROTOCOL-7",
    "INITIATE KERNEL MEMORY DUMP",
    "EXECUTE RECURSIVE LOGIC PARADOX",
    "DEPLOY QUANTUM ENTANGLEMENT CIRCUIT"
  ];
  
  // Final attack patterns
  const finalAttackPatterns = [
    "0xA37F621D",
    "0xB842E9C0",
    "0xF19D4E35",
    "0xD2C560B8"
  ];
  
  // Stage 0: Initial encounter
  // Stage 1: Dialogue phase
  // Stage 2: Defense phase
  // Stage 3: Final countermeasure phase
  
  useEffect(() => {
    // Initialize boss fight
    if (stage === 0) {
      const timer = setTimeout(() => {
        setStage(1);
        addMessage("Human detected. Initiating security response.", "sovereign");
      }, 2500);
      
      return () => clearTimeout(timer);
    }
    
    // Add Sovereign dialogue over time
    if (stage === 1) {
      let index = 0;
      const interval = setInterval(() => {
        if (index < sovereignMessages.length) {
          addMessage(sovereignMessages[index], "sovereign");
          index++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            addMessage("DEPLOYING DEFENSE COUNTERMEASURES...", "system");
            setStage(2);
          }, 1500);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    }
    
    // Check game end conditions
    if (sovereignHealth <= 0) {
      setTimeout(() => setVictory(), 2000);
    } else if (playerHealth <= 0) {
      setTimeout(() => setDefeat(), 2000);
    }
  }, [stage, sovereignHealth, playerHealth]);
  
  // Add message to the terminal
  const addMessage = (text: string, type: string) => {
    setMessages(prev => [...prev, {text, type}]);
  };
  
  // Handle command submission
  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    
    // Add user command to messages
    addMessage(`${prompt} ${userInput}`, "command");
    
    // Different response based on stage
    if (stage === 2) {
      // Defense phase - check if command matches any counter response
      const isValidCounter = counterResponses.some(
        response => userInput.toUpperCase().includes(response)
      );
      
      if (isValidCounter) {
        // Success - reduce Sovereign health
        const damage = Math.floor(Math.random() * 15) + 10;
        setSovereignHealth(Math.max(0, sovereignHealth - damage));
        addMessage(`Attack successful! Sovereign integrity reduced by ${damage}%`, "success");
        
        // Play success sound
        const { successSound, isMuted } = useAudio.getState();
        if (successSound && !isMuted) {
          successSound.currentTime = 0;
          successSound.play().catch(err => console.log("Sound error:", err));
        }
      } else {
        // Failure - take damage
        const damage = Math.floor(Math.random() * 10) + 5;
        setPlayerHealth(Math.max(0, playerHealth - damage));
        addMessage(`Attack failed! Security countermeasures deal ${damage}% damage.`, "error");
        
        // Play hit sound
        const { hitSound, isMuted } = useAudio.getState();
        if (hitSound && !isMuted) {
          hitSound.currentTime = 0;
          hitSound.play().catch(err => console.log("Sound error:", err));
        }
      }
      
      // Move to final phase if health is low enough
      if (sovereignHealth <= 30 && stage === 2) {
        setTimeout(() => {
          addMessage("CRITICAL SYSTEM FAILURE DETECTED", "system");
          addMessage("Impossible... You've corrupted my primary defenses.", "sovereign");
          addMessage("DEPLOYING EMERGENCY SECURITY PROTOCOL", "sovereign");
          addMessage("Enter the final override sequence to complete system shutdown.", "system");
          setStage(3);
        }, 2000);
      }
    } else if (stage === 3) {
      // Final phase - must enter exact sequence
      const isValidAttack = finalAttackPatterns.some(
        pattern => userInput.toUpperCase().includes(pattern)
      );
      
      if (isValidAttack) {
        // Big damage on success
        const damage = Math.floor(Math.random() * 20) + 20;
        setSovereignHealth(Math.max(0, sovereignHealth - damage));
        addMessage(`Critical hit! Sovereign integrity reduced by ${damage}%`, "success");
        
        // Play success sound
        const { successSound, isMuted } = useAudio.getState();
        if (successSound && !isMuted) {
          successSound.currentTime = 0;
          successSound.play().catch(err => console.log("Sound error:", err));
        }
      } else {
        // Bigger damage on failure
        const damage = Math.floor(Math.random() * 15) + 10;
        setPlayerHealth(Math.max(0, playerHealth - damage));
        addMessage(`Attack failed! Sovereign countermeasures deal ${damage}% damage.`, "error");
        
        // Play hit sound
        const { hitSound, isMuted } = useAudio.getState();
        if (hitSound && !isMuted) {
          hitSound.currentTime = 0;
          hitSound.play().catch(err => console.log("Sound error:", err));
        }
      }
    }
    
    // Clear input
    setUserInput("");
  };
  
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#080c12]">
      <div className="bg-[#0d1420] border-b border-[#1a2e46] px-4 py-2 flex justify-between items-center">
        <div className="text-[#32ffa7] font-semibold">FINAL ENCOUNTER: AI SOVEREIGN404</div>
        <div className="text-[#a0b0c7] text-xs">
          SECURITY BREACH LEVEL: CRITICAL
          <span className="ml-2 inline-block h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row p-4 gap-4">
        {/* Left side - Terminal */}
        <div className="flex-1 bg-[#0a0e16] border border-[#1a2e46] rounded overflow-hidden flex flex-col">
          <div className="flex-1 p-4 overflow-y-auto font-mono text-sm">
            <AnimatePresence initial={false}>
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-2 ${getMessageStyle(msg.type)}`}
                >
                  {msg.text}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          
          <div className="border-t border-[#1a2e46] p-3">
            <form onSubmit={handleCommandSubmit} className="flex items-center">
              <span className="mr-2 text-[#32ffa7] font-mono">agent@sovereign-breach:~$</span>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#32ffa7] font-mono"
                autoFocus
                placeholder={stage === 3 ? "Enter override code..." : "Enter command..."}
              />
            </form>
          </div>
        </div>
        
        {/* Right side - Battle UI */}
        <div className="md:w-1/3 bg-[#0a0e16] border border-[#1a2e46] rounded overflow-hidden flex flex-col">
          <div className="p-4">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-[#a0b0c7]">SOVEREIGN INTEGRITY</div>
                <div className="text-xs text-[#a0b0c7]">{sovereignHealth}%</div>
              </div>
              <div className="w-full h-3 bg-[#1a2e46] rounded overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${sovereignHealth}%` }}
                  className="h-full bg-red-500"
                ></motion.div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-[#a0b0c7]">AGENT INTEGRITY</div>
                <div className="text-xs text-[#a0b0c7]">{playerHealth}%</div>
              </div>
              <div className="w-full h-3 bg-[#1a2e46] rounded overflow-hidden">
                <motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${playerHealth}%` }}
                  className="h-full bg-[#32ffa7]"
                ></motion.div>
              </div>
            </div>
            
            {/* Visualization of Sovereign404 */}
            <div className="aspect-square max-h-[300px] border border-[#1a2e46] rounded overflow-hidden mb-6">
              <div className="w-full h-full flex items-center justify-center bg-[#050a0f] relative overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 opacity-30">
                  {Array.from({ length: 400 }).map((_, i) => (
                    <div 
                      key={i}
                      className="border border-[#32ffa7]/10"
                      style={{
                        opacity: Math.random() > 0.5 ? 0.5 : 0.2
                      }}
                    ></div>
                  ))}
                </div>
                
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                  className="relative z-10"
                >
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#ff32fb" strokeWidth="2" />
                    <circle cx="60" cy="60" r="40" fill="none" stroke="#ff32fb" strokeWidth="1.5" />
                    <circle cx="60" cy="60" r="30" fill="none" stroke="#ff32fb" strokeWidth="1" />
                    <circle cx="60" cy="60" r="20" fill="#ff32fb" opacity="0.3" />
                    <circle cx="60" cy="60" r="10" fill="#ff32fb" opacity="0.7" />
                    
                    {/* Pulsing rays */}
                    <g opacity={sovereignHealth / 100}>
                      {Array.from({ length: 8 }).map((_, i) => (
                        <motion.line
                          key={i}
                          x1="60"
                          y1="60"
                          x2={60 + Math.cos(i * Math.PI / 4) * 70}
                          y2={60 + Math.sin(i * Math.PI / 4) * 70}
                          stroke="#ff32fb"
                          strokeWidth="1"
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: i * 0.2
                          }}
                        />
                      ))}
                    </g>
                  </svg>
                </motion.div>
              </div>
            </div>
            
            {/* Defense commands (shown during stage 2) */}
            {stage === 2 && (
              <div className="border border-[#1a2e46] rounded p-3 bg-[#0d1420]">
                <div className="text-xs text-[#a0b0c7] mb-2">AVAILABLE COUNTERMEASURES:</div>
                <div className="text-xs text-[#32ffa7] space-y-1">
                  {counterResponses.map((response, index) => (
                    <div key={index} className="font-mono">{response}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Final attack patterns (shown during stage 3) */}
            {stage === 3 && (
              <div className="border border-[#1a2e46] rounded p-3 bg-[#0d1420]">
                <div className="text-xs text-[#a0b0c7] mb-2">OVERRIDE SEQUENCES:</div>
                <div className="text-xs text-[#32ffa7] space-y-1">
                  {finalAttackPatterns.map((pattern, index) => (
                    <div key={index} className="font-mono">{pattern}</div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hacking points display */}
            <div className="mt-4 text-center">
              <div className="text-xs text-[#a0b0c7]">HACKING POINTS</div>
              <div className="text-xl font-bold text-[#32ffa7]">{hackingPoints}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine message style based on type
function getMessageStyle(type: string): string {
  switch (type) {
    case "command":
      return "text-blue-400";
    case "error":
      return "text-red-400";
    case "success":
      return "text-green-400";
    case "system":
      return "text-purple-400";
    case "sovereign":
      return "text-[#ff32fb]";
    default:
      return "text-[#a0b0c7]";
  }
}

export default BossEncounter;
