import { BaseTheme } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React from "react";
import { hot } from "react-hot-loader/root";
import { ThemeProvider } from "styled-components";

import "sanitize.css/sanitize.css";

import CoreProvider from "core/CoreProvider";

import GlobalStyle from "./GlobalStyle";
import MainRouter from "./MainRouter";

const App = observer(() => (
  <CoreProvider>
    <ThemeProvider theme={BaseTheme}>
      <GlobalStyle />
      <MainRouter />
    </ThemeProvider>
  </CoreProvider>
));

export default hot(App);
