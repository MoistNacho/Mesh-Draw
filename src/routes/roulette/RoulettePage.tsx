import React from "react";
import { hot } from "react-hot-loader/root";

import { RouletteBody, RouletteProvider } from "modules/roulette";

const RoulettePage = () => {
  return (
    <RouletteProvider>
      <RouletteBody />
    </RouletteProvider>
  );
};

export default hot(RoulettePage);
