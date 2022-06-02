import { observer } from "mobx-react";
import React from "react";
// @ts-ignore
import Div100vh from "react-div-100vh";

import AlertWrapper from "components/AlertWrapper";
import SpinnerWrapper from "components/SpinnerWrapper";

interface LayoutProps {
  children?: React.ReactNode;
}

const Layout = observer(({ children }: LayoutProps) => {
  return (
    <Div100vh>
      {children}
      <AlertWrapper />
      <SpinnerWrapper />
    </Div100vh>
  );
});

export default Layout;
