import React from "react";
import { Router, Route } from "react-router-dom";

import { useCore } from "core";
import { withTracker } from "lib/router";

import Routes from "./routes";

const MainRouter: React.FC = () => {
  const core = useCore();
  return (
    <Router history={core.router.synchronizedHistory}>
      <Route component={withTracker(Routes)} />
    </Router>
  );
};

export default MainRouter;
