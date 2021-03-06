import React from "react";

import { useCore } from "core";
import { generateUseContext } from "lib/context";

import VoteStore from "./VoteStore";

export interface VoteContext {
  voteStore: VoteStore;
}

interface Props {
  children: React.ReactNode;
}

const LocalContext = React.createContext<VoteContext | null>(null);

export const useVoteStore = generateUseContext(LocalContext);

const VoteProvider: React.FC<Props> = ({ children }) => {
  const core = useCore();

  const [stores] = React.useState<VoteContext>(() => ({
    voteStore: new VoteStore(core),
  }));

  return (
    <LocalContext.Provider value={stores}>{children}</LocalContext.Provider>
  );
};

export default VoteProvider;
