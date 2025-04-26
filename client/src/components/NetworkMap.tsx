import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useGameState } from "../lib/stores/useGameState";

const NetworkMap = () => {
  const { levelData, unlockedLevels, completedLevels, startLevel } = useGameState();
  const [hoveredLevel, setHoveredLevel] = useState<number | null>(null);
  
  // Position levels in a network layout
  const getLevelPosition = (index: number, total: number) => {
    // Create a circular layout
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
    const angle = (index / total) * Math.PI * 2;
    
    // Boss level goes in center
    if (index === total - 1) {
      return { x: 0, y: 0 };
    }
    
    // Other levels in a circle around the boss
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };
  
  const handleLevelClick = (levelId: number) => {
    if (unlockedLevels.includes(levelId)) {
      startLevel(levelId);
    }
  };
  
  return (
    <div className="w-full h-[500px] relative bg-[#050a0f] rounded overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%">
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#32ffa7" strokeWidth="0.5"/>
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="relative w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {/* Center point for the boss level */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={`w-16 h-16 rounded-full flex items-center justify-center cursor-pointer ${
                unlockedLevels.includes(levelData.length) 
                  ? 'bg-red-500/30 border-2 border-red-500' 
                  : 'bg-gray-800/50 border-2 border-gray-700'
              }`}
              onClick={() => {
                if (unlockedLevels.includes(levelData.length)) {
                  handleLevelClick(levelData.length);
                }
              }}
            >
              <div className="text-center">
                <div className="text-xs font-bold">SOVEREIGN</div>
                <div className="text-xs">404</div>
              </div>
            </motion.div>
          </div>
          
          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {levelData.map((level, index) => {
              const pos = getLevelPosition(index, levelData.length);
              const centerX = window.innerWidth / 2;
              const centerY = window.innerHeight / 2;
              
              // Skip boss level (it's in the center)
              if (index === levelData.length - 1) return null;
              
              return (
                <line
                  key={`line-${level.id}`}
                  x1={centerX + pos.x}
                  y1={centerY + pos.y}
                  x2={centerX}
                  y2={centerY}
                  stroke={unlockedLevels.includes(level.id) ? "#32ffa7" : "#1a2e46"}
                  strokeWidth={unlockedLevels.includes(level.id) ? 2 : 1}
                  strokeDasharray={unlockedLevels.includes(level.id) ? "none" : "5,5"}
                  opacity={unlockedLevels.includes(level.id) ? 0.7 : 0.3}
                />
              );
            })}
          </svg>
          
          {/* Level nodes */}
          {levelData.map((level, index) => {
            if (index === levelData.length - 1) return null; // Skip boss level, it's already rendered
            
            const pos = getLevelPosition(index, levelData.length);
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            const isCompleted = completedLevels.includes(level.id);
            const isUnlocked = unlockedLevels.includes(level.id);
            const isHovered = hoveredLevel === level.id;
            
            return (
              <motion.div
                key={level.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ 
                  left: centerX + pos.x,
                  top: centerY + pos.y,
                }}
                whileHover={{ scale: 1.1 }}
                onHoverStart={() => setHoveredLevel(level.id)}
                onHoverEnd={() => setHoveredLevel(null)}
              >
                <motion.div
                  onClick={() => handleLevelClick(level.id)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                    isCompleted
                      ? 'bg-[#32ffa7]/30 border-2 border-[#32ffa7]'
                      : isUnlocked
                      ? 'bg-[#00a6ff]/30 border-2 border-[#00a6ff]'
                      : 'bg-gray-800/50 border-2 border-gray-700 cursor-not-allowed'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xs font-bold">{level.id}</div>
                  </div>
                </motion.div>
                
                {/* Level Info Tooltip */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-48 bg-[#0d1420] border border-[#1a2e46] rounded p-2 z-10"
                  >
                    <div className="text-sm font-bold text-[#32ffa7] mb-1">{level.name}</div>
                    <div className="text-xs text-[#a0b0c7] mb-1">{level.description}</div>
                    <div className="text-xs text-[#a0b0c7]">
                      Status: {isCompleted ? 'Completed' : isUnlocked ? 'Unlocked' : 'Locked'}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

export default NetworkMap;
