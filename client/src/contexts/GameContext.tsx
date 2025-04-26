import { createContext } from "react";

interface GameContextType {
  playerName: string;
}

export const GameContext = createContext<GameContextType>({
  playerName: "",
});
