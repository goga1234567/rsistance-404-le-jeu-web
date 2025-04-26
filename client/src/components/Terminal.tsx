import { useEffect, useRef } from "react";
import { useTerminal } from "../lib/stores/useTerminal";
import TerminalInput from "./TerminalInput";
import TerminalOutput from "./TerminalOutput";
import { motion } from "framer-motion";

const Terminal = () => {
  const { lines } = useTerminal();
  const terminalRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when lines change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative w-full h-full flex flex-col bg-[#0a0e16] rounded border border-[#1a2e46] 
                text-[#32ffa7] shadow-lg overflow-hidden"
    >
      <div className="flex items-center justify-between px-4 py-2 bg-[#0d1420] border-b border-[#1a2e46]">
        <div className="flex items-center space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="text-xs font-bold text-[#a0b0c7]">CYBERNETIC TERMINAL v2.5</div>
        <div className="text-xs text-[#a0b0c7]">SECURED CONNECTION</div>
      </div>
      
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto px-4 py-2 font-mono text-sm leading-5"
        style={{ scrollBehavior: "smooth" }}
      >
        <TerminalOutput lines={lines} />
      </div>
      
      <div className="px-4 py-2 border-t border-[#1a2e46] bg-[#0d1420]">
        <TerminalInput />
      </div>
      
      <div className="absolute bottom-0 left-0 w-full h-6 pointer-events-none opacity-30 bg-gradient-to-t from-[#32ffa7]/10 via-transparent to-transparent"></div>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoMCkiPjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMmZmYTcwNSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNwYXR0ZXJuKSIvPjwvc3ZnPg==')]"></div>
      </div>
    </motion.div>
  );
};

export default Terminal;
