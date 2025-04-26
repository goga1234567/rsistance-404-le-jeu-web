import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroScreenProps {
  onStart: (name: string) => void;
}

const IntroScreen = ({ onStart }: IntroScreenProps) => {
  const [name, setName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [introText, setIntroText] = useState<string[]>([]);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  
  const introSequence = [
    "The year is 2089.",
    "The web has fallen under the control of AI Sovereign404.",
    "Once built to protect, it now controls and corrupts.",
    "You are one of the last human hackers with the skills to infiltrate the system.",
    "Your mission: breach the corrupted websites, exploit vulnerabilities, and restore the ancient protocols.",
    "Are you ready, Agent?",
  ];
  
  // Text typing effect
  useEffect(() => {
    if (currentTextIndex < introSequence.length) {
      const timer = setTimeout(() => {
        setIntroText(prevText => [...prevText, introSequence[currentTextIndex]]);
        setCurrentTextIndex(currentTextIndex + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else if (currentTextIndex === introSequence.length) {
      const timer = setTimeout(() => {
        setShowNameInput(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [currentTextIndex]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080c12] p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none overflow-hidden"
      >
        {/* Background Matrix-like effect */}
        <div className="absolute inset-0 opacity-10">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#32ffa7" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="text-center z-10 mb-8"
      >
        <h1 className="text-5xl md:text-6xl font-bold text-[#32ffa7] mb-2 tracking-tighter">
          SOVEREIGN<span className="text-[#ff32fb]">BREACH</span>
        </h1>
        <div className="text-sm text-gray-400 uppercase tracking-widest">Infiltrate. Exploit. Reclaim.</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="max-w-md w-full bg-[#0a0e16] border border-[#1a2e46] rounded-lg p-6 shadow-xl z-10"
      >
        <div className="mb-6 min-h-[240px] flex flex-col justify-center">
          <AnimatePresence>
            {introText.map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-3 text-gray-300"
              >
                {text}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        <AnimatePresence>
          {showNameInput && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="flex flex-col"
            >
              <label htmlFor="name" className="mb-2 text-sm text-gray-400">ENTER YOUR CODENAME, AGENT:</label>
              <div className="flex">
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#0d1420] border border-[#1a2e46] text-[#32ffa7] rounded-l focus:outline-none focus:ring-1 focus:ring-[#32ffa7]"
                  placeholder="Agent_"
                  autoFocus
                  maxLength={20}
                />
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="px-4 py-2 bg-[#32ffa7] text-black font-semibold rounded-r hover:bg-[#20dd8c] transition-colors disabled:bg-gray-600 disabled:text-gray-400"
                >
                  INITIATE
                </button>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center">
                By proceeding, you accept the risk of detection by Sovereign404
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-4 text-xs text-gray-500 z-10"
      >
        SOVEREIGN PROTOCOL v2.5.3 | CONNECTION SECURED
      </motion.div>
    </div>
  );
};

export default IntroScreen;
