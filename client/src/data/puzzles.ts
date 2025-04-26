import type { Puzzle } from "../types";

export const puzzles: Puzzle[] = [
  // Node sequence puzzles (must select nodes in correct order)
  {
    id: 1,
    type: "node_sequence",
    title: "Firewall Bypass Sequence",
    description: "Select the node access points in the correct sequence to bypass the security firewall.",
    difficulty: "easy",
    solution: [2, 5, 8, 7, 4],
    reward: 100,
  },
  {
    id: 2,
    type: "node_sequence",
    title: "Encryption Handshake",
    description: "Establish a secure connection by entering the correct handshake pattern.",
    difficulty: "medium",
    solution: [1, 5, 9, 7, 3],
    reward: 150,
  },
  {
    id: 3,
    type: "node_sequence",
    title: "System Core Access",
    description: "Access the system core by tracing the primary data pathway.",
    difficulty: "hard",
    solution: [1, 2, 3, 6, 9, 8, 7],
    reward: 200,
  },
  
  // Node selection puzzles (must select specific nodes, order doesn't matter)
  {
    id: 4,
    type: "node_selection",
    title: "Security Node Isolation",
    description: "Identify and select all security monitoring nodes to disable surveillance.",
    difficulty: "easy",
    solution: [2, 4, 6, 8],
    reward: 120,
  },
  {
    id: 5,
    type: "node_selection",
    title: "Data Packet Intercept",
    description: "Intercept data packets by selecting their routing nodes.",
    difficulty: "medium",
    solution: [1, 3, 7, 9],
    reward: 170,
  },
  {
    id: 6,
    type: "node_selection",
    title: "Memory Corruption",
    description: "Corrupt system memory by targeting vulnerable memory addresses.",
    difficulty: "hard",
    solution: [2, 3, 5, 7, 8],
    reward: 220,
  },
  
  // Code input puzzles
  {
    id: 7,
    type: "code_input",
    title: "Root Access Code",
    description: "Enter the root access code to gain administrator privileges.",
    difficulty: "easy",
    solution: "SOVEREIGN-ROOT-ACCESS",
    reward: 150,
  },
  {
    id: 8,
    type: "code_input",
    title: "Authorization Override",
    description: "Override authorization protocols with the correct security key.",
    difficulty: "medium",
    solution: "X45-7TZ-P89-VQA",
    reward: 180,
  },
  {
    id: 9,
    type: "code_input",
    title: "Kernel Reboot Sequence",
    description: "Force a kernel reboot by entering the emergency sequence code.",
    difficulty: "hard",
    solution: "SYS:REBOOT:FORCE:0xF72A18E9",
    reward: 250,
  },
];

// Function to get a random puzzle by difficulty
export const getRandomPuzzle = (difficulty: string = "easy"): Puzzle => {
  const filteredPuzzles = puzzles.filter(puzzle => puzzle.difficulty === difficulty);
  const randomIndex = Math.floor(Math.random() * filteredPuzzles.length);
  return filteredPuzzles[randomIndex];
};
