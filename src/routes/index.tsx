import React, { lazy, Suspense } from "react";
import { Route, Switch } from "react-router-dom";

import { PrivateRoute } from "lib/router";

import Layout from "../Layout";

const HomePage = lazy(() => import("./home/HomePage"));
const VotePage = lazy(() => import("./vote/VotePage"));
const LoginPageProvider = lazy(() => import("./login/LoginPageProvider"));
const WelcomePage = lazy(() => import("./welcome/WelcomePage"));
const AuthorizePage = lazy(() => import("./authorize/AuthorizePage"));
const NotFound = lazy(() => import("./NotFound"));

const Routes = () => (
  <Layout>
    <Suspense fallback={<div />}>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/vote" component={VotePage} />
        <Route path="/login" component={LoginPageProvider} />
        <Route path="/welcome" component={WelcomePage} />
        <Route path="/authorize" component={AuthorizePage} />
        <PrivateRoute
          path="/"
          component={() => (
            <>
              <Switch>
                <Route component={NotFound} />
              </Switch>
            </>
          )}
        />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  </Layout>
);

export default Routes;
