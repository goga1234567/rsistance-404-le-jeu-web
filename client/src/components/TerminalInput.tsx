import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { useTerminal } from "../lib/stores/useTerminal";

const TerminalInput = () => {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { prompt, executeCommand, navigateHistory } = useTerminal();
  
  // Auto-focus the input field
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Handle command execution
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      executeCommand(input);
      setInput("");
    }
  };
  
  // Handle keyboard navigation through command history
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevCommand = navigateHistory("up");
      setInput(prevCommand);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextCommand = navigateHistory("down");
      setInput(nextCommand);
    }
  };
  
  // Handle clicks on the terminal to focus the input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <form onSubmit={handleSubmit} onClick={handleTerminalClick} className="flex items-center">
      <span className="mr-2 text-[#32ffa7] font-mono whitespace-nowrap">{prompt}</span>
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow bg-transparent outline-none text-[#32ffa7] font-mono text-sm caret-[#32ffa7]"
        autoComplete="off"
        autoCapitalize="off"
        spellCheck="false"
      />
    </form>
  );
};

export default TerminalInput;
