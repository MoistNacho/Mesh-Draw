import React from "react";
import { hot } from "react-hot-loader/root";

import { VoteBody, VoteProvider } from "modules/vote";

const VotePage = () => {
  return (
    <VoteProvider>
      <VoteBody />
    </VoteProvider>
  );
};

export default hot(VotePage);
