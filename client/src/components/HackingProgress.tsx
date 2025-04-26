import { motion } from "framer-motion";
import { useGameState } from "../lib/stores/useGameState";

const HackingProgress = () => {
  const { completedLevels, levelData } = useGameState();
  
  // Calculate progress percentage
  const totalLevels = levelData.length - 1; // Excluding boss level
  const completedCount = completedLevels.length;
  const progressPercentage = Math.floor((completedCount / totalLevels) * 100);
  
  return (
    <div className="flex items-center">
      <div className="text-xs text-[#a0b0c7] mr-2">Mission Progress:</div>
      <div className="w-24 h-2 bg-[#1a2e46] rounded overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          className="h-full bg-[#32ffa7]"
        ></motion.div>
      </div>
      <div className="text-xs text-[#a0b0c7] ml-2">{progressPercentage}%</div>
    </div>
  );
};

export default HackingProgress;
