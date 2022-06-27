import React from "react";

import { useCore } from "core";
import { generateUseContext } from "lib/context";

import RouletteStore from "./RouletteStore";

export interface RouletteContext {
  rouletteStore: RouletteStore;
}

interface Props {
  children: React.ReactNode;
}

const LocalContext = React.createContext<RouletteContext | null>(null);

export const useRouletteStore = generateUseContext(LocalContext);

const VoteProvider: React.FC<Props> = ({ children }) => {
  const core = useCore();

  const [stores] = React.useState<RouletteContext>(() => ({
    rouletteStore: new RouletteStore(core),
  }));

  return (
    <LocalContext.Provider value={stores}>{children}</LocalContext.Provider>
  );
};

export default VoteProvider;
