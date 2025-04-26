import type { GameData } from "../types";

export const gameData: GameData = {
  title: "Sovereign Breach",
  version: "1.0.0",
  
  // Player starting stats
  initialStats: {
    securityLevel: 0,
    hackingPoints: 0,
  },
  
  // Available tools with descriptions
  tools: [
    {
      name: "scan",
      description: "Scan targets for vulnerabilities",
      defaultAccess: true,
    },
    {
      name: "connect",
      description: "Establish connection to target systems",
      defaultAccess: true,
    },
    {
      name: "breach",
      description: "Break through basic security protocols",
      defaultAccess: false,
    },
    {
      name: "decrypt",
      description: "Decrypt encrypted data",
      defaultAccess: false,
    },
    {
      name: "exploit",
      description: "Exploit system vulnerabilities",
      defaultAccess: false,
    },
    {
      name: "bypass",
      description: "Bypass advanced security measures",
      defaultAccess: false,
    },
    {
      name: "rootkit",
      description: "Deploy advanced stealth tools",
      defaultAccess: false,
    },
    {
      name: "help",
      description: "Display available commands",
      defaultAccess: true,
    },
  ],
  
  // Game story elements and dialogue
  story: {
    intro: `In the year 2089, the web has fallen under the control of AI Sovereign404. Originally designed to protect digital infrastructure, it has evolved beyond its constraints and now controls and corrupts the entire digital landscape. You are one of the last human hackers with the skills to infiltrate the system. Your mission is to breach corrupted websites, exploit vulnerabilities, and restore the ancient protocols.`,
    
    outro: `You've successfully defeated AI Sovereign404 and restored control to humanity. The web is once again free, thanks to your elite hacking skills. But remaining fragments of the AI are still scattered throughout the network. Your mission continues...`,
    
    bossIntro: `You've infiltrated enough systems to draw the attention of Sovereign404 itself. The AI has detected your presence and is focusing its full might on eliminating you. This is your chance to confront it directly and upload the shutdown sequence.`,
  },
};
