import { motion } from "framer-motion";

interface StatusBarProps {
  playerName: string;
  securityLevel: number;
  hackingPoints: number;
  tools: string[];
}

const StatusBar = ({ playerName, securityLevel, hackingPoints, tools }: StatusBarProps) => {
  // Calculate color based on security level
  const getSecurityColor = (level: number) => {
    if (level < 30) return "bg-green-500";
    if (level < 70) return "bg-yellow-500";
    return "bg-red-500";
  };
  
  return (
    <motion.div 
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full bg-[#0d1420] border-b border-[#1a2e46] text-[#a0b0c7] flex flex-col sm:flex-row items-center px-4 py-2 shadow-md"
    >
      <div className="flex-1 flex items-center space-x-4 mb-2 sm:mb-0">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-[#32ffa7] font-semibold">Agent: {playerName}</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-xs">|</span>
          <span className="text-xs">SERVER: GLOBAL-NET</span>
          <span className="text-xs">|</span>
          <span className="text-xs">MODE: INFILTRATION</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Security Level */}
        <div className="flex items-center">
          <span className="text-xs mr-2">SECURITY:</span>
          <div className="w-24 h-3 bg-[#1a2e46] rounded overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${securityLevel}%` }}
              transition={{ duration: 0.5 }}
              className={`h-full ${getSecurityColor(securityLevel)}`}
            ></motion.div>
          </div>
          <span className="text-xs ml-1">{securityLevel}%</span>
        </div>
        
        {/* Hacking Points */}
        <div className="flex items-center">
          <span className="text-xs mr-2">DATA:</span>
          <span className="text-[#32ffa7] font-mono">{hackingPoints}</span>
        </div>
        
        {/* Available Tools (desktop only) */}
        <div className="hidden lg:flex items-center">
          <span className="text-xs mr-2">TOOLS:</span>
          <div className="flex space-x-1">
            {tools.map((tool) => (
              <span 
                key={tool}
                className="text-xs px-1.5 py-0.5 bg-[#1a2e46] rounded text-[#32ffa7]"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatusBar;
