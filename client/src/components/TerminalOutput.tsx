import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TerminalLine } from "../types";

interface TerminalOutputProps {
  lines: TerminalLine[];
}

const TerminalOutput = ({ lines }: TerminalOutputProps) => {
  const outputRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);
  
  return (
    <div ref={outputRef} className="font-mono whitespace-pre-wrap break-words">
      <AnimatePresence initial={false}>
        {lines.map((line) => (
          <motion.div
            key={line.id}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            className={`mb-1 ${getLineStyle(line.type)}`}
          >
            {line.content}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Helper function to determine line style based on type
function getLineStyle(type: string | undefined): string {
  switch (type) {
    case "command":
      return "text-blue-400";
    case "error":
      return "text-red-400";
    case "success":
      return "text-green-400 font-semibold";
    case "warning":
      return "text-yellow-400";
    case "system":
      return "text-purple-400";
    case "important":
      return "text-yellow-300 font-bold";
    default:
      return "text-[#32ffa7]";
  }
}

export default TerminalOutput;
