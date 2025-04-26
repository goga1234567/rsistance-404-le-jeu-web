import { puzzles, getRandomPuzzle } from "./puzzles";
import { levels } from "./levels";
import type { CommandResult, GameState, Puzzle } from "../types";

// Command handler function
export function executeCommand(command: string, gameState: GameState): CommandResult {
  const parts = command.trim().toLowerCase().split(/\s+/);
  const mainCommand = parts[0];
  const args = parts.slice(1);
  
  // Default result
  const result: CommandResult = {
    success: false,
    output: "",
  };
  
  // Command implementations
  switch (mainCommand) {
    case "help":
      return handleHelp(args, gameState);
    
    case "clear":
      return { 
        success: true, 
        output: "Terminal cleared.",
        clearTerminal: true
      };
    
    case "scan":
      return handleScan(args, gameState);
    
    case "connect":
      return handleConnect(args, gameState);
    
    case "status":
      return handleStatus(gameState);
    
    case "network":
      return handleNetwork(gameState);
    
    case "breach":
      return handleBreach(args, gameState);
    
    case "decrypt":
      return handleDecrypt(args, gameState);
    
    case "exploit":
      return handleExploit(args, gameState);
    
    case "bypass":
      return handleBypass(args, gameState);
    
    case "exit":
    case "logout":
      return { 
        success: true, 
        output: "Logging out of current session..." 
      };
    
    default:
      return { 
        success: false, 
        error: true,
        output: `Command not found: ${mainCommand}. Type 'help' for available commands.`,
        securityDelta: 5 // Small security penalty for invalid commands
      };
  }
}

// Help command
function handleHelp(args: string[], gameState: GameState): CommandResult {
  const { availableTools } = gameState;
  
  if (args.length > 0) {
    // Help for a specific command
    const commandName = args[0].toLowerCase();
    
    if (!availableTools.includes(commandName)) {
      return {
        success: false,
        error: true,
        output: `No help available for '${commandName}'. Command not found or access denied.`
      };
    }
    
    return {
      success: true,
      output: getCommandHelp(commandName)
    };
  }
  
  // General help
  let output = "Available commands:\n\n";
  
  availableTools.forEach(tool => {
    output += `${tool.padEnd(10)} - ${getCommandDescription(tool)}\n`;
  });
  
  output += "\nType 'help <command>' for detailed information on a specific command.";
  
  return {
    success: true,
    output
  };
}

// Scan command
function handleScan(args: string[], gameState: GameState): CommandResult {
  const { currentLevel, levelData, unlockedLevels } = gameState;
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: scan <target>\nExample: scan target-1"
    };
  }
  
  const targetArg = args[0];
  
  // Check if it's a numerical target (e.g., "target-1" or "1")
  let targetId: number | null = null;
  
  if (targetArg.startsWith("target-")) {
    targetId = parseInt(targetArg.split("-")[1]);
  } else if (!isNaN(parseInt(targetArg))) {
    targetId = parseInt(targetArg);
  }
  
  if (targetId === null || targetId < 1 || targetId > levelData.length) {
    return {
      success: false,
      error: true,
      output: `Target '${targetArg}' not found in network. Use 'network' command to view available targets.`,
      securityDelta: 2
    };
  }
  
  // Check if the target is unlocked
  if (!unlockedLevels.includes(targetId)) {
    return {
      success: false,
      error: true,
      output: "Access denied. Target not accessible with current security clearance.",
      securityDelta: 5
    };
  }
  
  const target = levelData[targetId - 1];
  
  return {
    success: true,
    output: `Scanning target: ${target.name}\n\n` +
            `Type: ${target.type}\n` +
            `Security Level: ${target.difficulty}\n` +
            `Status: ${target.status || "Unknown"}\n` +
            `Description: ${target.description}\n\n` +
            `Vulnerabilities detected: ${target.vulnerabilities.join(", ")}\n\n` +
            `Use 'connect target-${targetId}' to establish a connection.`,
    pointsEarned: 10
  };
}

// Connect command
function handleConnect(args: string[], gameState: GameState): CommandResult {
  const { levelData, unlockedLevels } = gameState;
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: connect <target>\nExample: connect target-1"
    };
  }
  
  const targetArg = args[0];
  
  // Check if it's a numerical target (e.g., "target-1" or "1")
  let targetId: number | null = null;
  
  if (targetArg.startsWith("target-")) {
    targetId = parseInt(targetArg.split("-")[1]);
  } else if (!isNaN(parseInt(targetArg))) {
    targetId = parseInt(targetArg);
  }
  
  if (targetId === null || targetId < 1 || targetId > levelData.length) {
    return {
      success: false,
      error: true,
      output: `Target '${targetArg}' not found in network. Use 'network' command to view available targets.`,
      securityDelta: 2
    };
  }
  
  // Check if the target is unlocked
  if (!unlockedLevels.includes(targetId)) {
    return {
      success: false,
      error: true,
      output: "Access denied. Target not accessible with current security clearance.",
      securityDelta: 5
    };
  }
  
  const target = levelData[targetId - 1];
  
  return {
    success: true,
    output: `Connection established to ${target.name}\n\n` +
            `System: ${target.type}\n` +
            `Security Status: Active\n\n` +
            `Use available tools to exploit vulnerabilities.\n` +
            `Suggested command: 'breach firewall' or 'exploit ${target.vulnerabilities[0]}'`,
    pointsEarned: 20
  };
}

// Status command
function handleStatus(gameState: GameState): CommandResult {
  const { playerName, hackingPoints, securityLevel, completedLevels, availableTools, levelData } = gameState;
  
  const totalLevels = levelData.length - 1; // Excluding boss level
  const progress = Math.floor((completedLevels.length / totalLevels) * 100);
  
  let securityStatus = "Low";
  if (securityLevel > 30) securityStatus = "Moderate";
  if (securityLevel > 60) securityStatus = "High";
  if (securityLevel > 90) securityStatus = "Critical";
  
  return {
    success: true,
    output: `---- AGENT STATUS ----\n\n` +
            `Agent: ${playerName}\n` +
            `Hacking Points: ${hackingPoints}\n` +
            `Mission Progress: ${progress}%\n` +
            `Security Alert Level: ${securityLevel}% (${securityStatus})\n` +
            `System Access: ${completedLevels.length} / ${totalLevels}\n\n` +
            `Available Tools: ${availableTools.join(", ")}\n\n` +
            `Current Mission: Infiltrate corrupted systems and defeat Sovereign404`
  };
}

// Network command
function handleNetwork(gameState: GameState): CommandResult {
  const { levelData, unlockedLevels, completedLevels } = gameState;
  
  let output = "---- NETWORK MAP ----\n\n";
  output += "Available targets:\n\n";
  
  levelData.forEach((level, index) => {
    // Skip boss level in regular network map
    if (index === levelData.length - 1) return;
    
    const levelId = level.id;
    const isUnlocked = unlockedLevels.includes(levelId);
    const isCompleted = completedLevels.includes(levelId);
    
    let status = "🔒 LOCKED";
    if (isCompleted) status = "✓ COMPLETED";
    else if (isUnlocked) status = "🔓 UNLOCKED";
    
    output += `target-${levelId}: ${level.name.padEnd(25)} [${status}]\n`;
    
    if (isUnlocked) {
      output += `   Type: ${level.type}\n`;
      output += `   Difficulty: ${level.difficulty}\n`;
      output += `   Use 'scan target-${levelId}' for more information\n`;
    }
    
    output += "\n";
  });
  
  // Show boss if all levels are completed
  const allLevelsCompleted = levelData.slice(0, -1).every(level => 
    completedLevels.includes(level.id)
  );
  
  if (allLevelsCompleted) {
    const bossLevel = levelData[levelData.length - 1];
    output += `\n!!! ALERT !!!\n`;
    output += `Sovereign404 mainframe detected\n`;
    output += `Security Level: MAXIMUM\n`;
    output += `Status: ACTIVE\n\n`;
    output += `Final target available for infiltration.\n`;
  }
  
  return {
    success: true,
    output
  };
}

// Breach command
function handleBreach(args: string[], gameState: GameState): CommandResult {
  const { availableTools } = gameState;
  
  // Check if tool is available
  if (!availableTools.includes("breach")) {
    return {
      success: false,
      error: true,
      output: "Access denied. 'breach' tool not available. Complete more targets to unlock.",
      securityDelta: 5
    };
  }
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: breach <system>\nExample: breach firewall"
    };
  }
  
  const target = args[0].toLowerCase();
  
  if (target === "firewall") {
    // Generate a puzzle for firewall breach
    const puzzle = getRandomPuzzle("easy");
    
    return {
      success: true,
      output: "Initiating firewall breach...\nSecurity system detected. Solve the security puzzle to continue.",
      puzzle,
      pointsEarned: 30
    };
  } else {
    return {
      success: false,
      error: true,
      output: `Cannot breach '${target}'. Invalid target or insufficient access.`,
      securityDelta: 3
    };
  }
}

// Decrypt command
function handleDecrypt(args: string[], gameState: GameState): CommandResult {
  const { availableTools } = gameState;
  
  // Check if tool is available
  if (!availableTools.includes("decrypt")) {
    return {
      success: false,
      error: true,
      output: "Access denied. 'decrypt' tool not available. Complete more targets to unlock.",
      securityDelta: 5
    };
  }
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: decrypt <data>\nExample: decrypt credentials"
    };
  }
  
  const target = args[0].toLowerCase();
  
  if (target === "credentials" || target === "password" || target === "data") {
    // Generate a medium difficulty puzzle for decryption
    const puzzle = getRandomPuzzle("medium");
    
    return {
      success: true,
      output: "Initiating decryption sequence...\nEncryption detected. Solve the decryption challenge to access data.",
      puzzle,
      pointsEarned: 40
    };
  } else {
    return {
      success: false,
      error: true,
      output: `Cannot decrypt '${target}'. Invalid data source or corrupted data.`,
      securityDelta: 3
    };
  }
}

// Exploit command
function handleExploit(args: string[], gameState: GameState): CommandResult {
  const { availableTools, currentLevel, levelData } = gameState;
  
  // Check if tool is available
  if (!availableTools.includes("exploit")) {
    return {
      success: false,
      error: true,
      output: "Access denied. 'exploit' tool not available. Complete more targets to unlock.",
      securityDelta: 5
    };
  }
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: exploit <vulnerability>\nExample: exploit sql-injection"
    };
  }
  
  const vulnerability = args[0].toLowerCase();
  
  // Check if the vulnerability exists in the current level
  const currentLevelData = levelData[currentLevel - 1];
  if (currentLevelData && currentLevelData.vulnerabilities.some(v => v.toLowerCase() === vulnerability)) {
    // Generate a hard difficulty puzzle for exploitation
    const puzzle = getRandomPuzzle("hard");
    
    return {
      success: true,
      output: `Exploiting ${vulnerability}...\nSecurity countermeasures detected. Solve the challenge to complete the exploitation.`,
      puzzle,
      pointsEarned: 50,
      levelCompleted: currentLevel
    };
  } else {
    return {
      success: false,
      error: true,
      output: `Cannot exploit '${vulnerability}'. Vulnerability not found or patched.`,
      securityDelta: 8
    };
  }
}

// Bypass command
function handleBypass(args: string[], gameState: GameState): CommandResult {
  const { availableTools } = gameState;
  
  // Check if tool is available
  if (!availableTools.includes("bypass")) {
    return {
      success: false,
      error: true,
      output: "Access denied. 'bypass' tool not available. Complete more targets to unlock.",
      securityDelta: 5
    };
  }
  
  if (args.length === 0) {
    return {
      success: false,
      error: true,
      output: "Usage: bypass <security>\nExample: bypass authentication"
    };
  }
  
  const security = args[0].toLowerCase();
  
  if (security === "authentication" || security === "auth" || security === "login") {
    // Generate a hard difficulty puzzle for authentication bypass
    const puzzle = getRandomPuzzle("hard");
    
    return {
      success: true,
      output: "Initiating authentication bypass...\nMulti-factor security detected. Solve the advanced security challenge.",
      puzzle,
      pointsEarned: 60,
      unlockTool: "rootkit" // Unlock a new tool as reward
    };
  } else {
    return {
      success: false,
      error: true,
      output: `Cannot bypass '${security}'. Unknown security system or insufficient privileges.`,
      securityDelta: 10
    };
  }
}

// Helper functions
function getCommandDescription(command: string): string {
  switch (command) {
    case "help":
      return "Display available commands";
    case "clear":
      return "Clear the terminal screen";
    case "scan":
      return "Scan a target for vulnerabilities";
    case "connect":
      return "Connect to a target system";
    case "status":
      return "Show current mission status";
    case "network":
      return "Display available network targets";
    case "breach":
      return "Breach system security";
    case "decrypt":
      return "Decrypt encrypted data";
    case "exploit":
      return "Exploit system vulnerabilities";
    case "bypass":
      return "Bypass advanced security";
    case "rootkit":
      return "Deploy advanced stealth tools";
    default:
      return "No description available";
  }
}

function getCommandHelp(command: string): string {
  switch (command) {
    case "help":
      return "Command: help\n\n" +
             "Usage: help [command]\n\n" +
             "Description: Displays a list of available commands or detailed information about a specific command.\n\n" +
             "Examples:\n" +
             "  help - Lists all available commands\n" +
             "  help scan - Shows details about the scan command";
    
    case "clear":
      return "Command: clear\n\n" +
             "Usage: clear\n\n" +
             "Description: Clears the terminal screen.\n\n" +
             "Example:\n" +
             "  clear";
    
    case "scan":
      return "Command: scan\n\n" +
             "Usage: scan <target>\n\n" +
             "Description: Scans a target for vulnerabilities and security information.\n\n" +
             "Examples:\n" +
             "  scan target-1\n" +
             "  scan 2";
    
    case "connect":
      return "Command: connect\n\n" +
             "Usage: connect <target>\n\n" +
             "Description: Establishes a connection to the specified target system.\n\n" +
             "Examples:\n" +
             "  connect target-1\n" +
             "  connect 2";
    
    case "status":
      return "Command: status\n\n" +
             "Usage: status\n\n" +
             "Description: Displays your current mission status, including hacking points, security level, and mission progress.\n\n" +
             "Example:\n" +
             "  status";
    
    case "network":
      return "Command: network\n\n" +
             "Usage: network\n\n" +
             "Description: Displays a map of the network with available targets and their status.\n\n" +
             "Example:\n" +
             "  network";
    
    case "breach":
      return "Command: breach\n\n" +
             "Usage: breach <system>\n\n" +
             "Description: Attempts to breach a specific system security component.\n\n" +
             "Examples:\n" +
             "  breach firewall\n" +
             "  breach security";
    
    case "decrypt":
      return "Command: decrypt\n\n" +
             "Usage: decrypt <data>\n\n" +
             "Description: Attempts to decrypt encrypted data.\n\n" +
             "Examples:\n" +
             "  decrypt credentials\n" +
             "  decrypt password";
    
    case "exploit":
      return "Command: exploit\n\n" +
             "Usage: exploit <vulnerability>\n\n" +
             "Description: Exploits a specific vulnerability in the current system.\n\n" +
             "Examples:\n" +
             "  exploit sql-injection\n" +
             "  exploit xss";
    
    case "bypass":
      return "Command: bypass\n\n" +
             "Usage: bypass <security>\n\n" +
             "Description: Attempts to bypass advanced security systems.\n\n" +
             "Examples:\n" +
             "  bypass authentication\n" +
             "  bypass firewall";
    
    case "rootkit":
      return "Command: rootkit\n\n" +
             "Usage: rootkit <action>\n\n" +
             "Description: Deploys advanced stealth tools to maintain persistent access.\n\n" +
             "Examples:\n" +
             "  rootkit install\n" +
             "  rootkit backdoor";
    
    default:
      return `No detailed help available for '${command}'.`;
  }
}
