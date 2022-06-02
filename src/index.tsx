import "core-js/stable";
import "regenerator-runtime/runtime";
import "url-search-params-polyfill";

import React from "react";
import { hydrate, render } from "react-dom";

import App from "./App";

const root = document.getElementById("app");

if (root && root.hasChildNodes()) {
  hydrate(<App />, root);
} else {
  render(<App />, root);
}
