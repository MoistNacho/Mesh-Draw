import { observer } from "mobx-react";
import * as React from "react";
import {
  Redirect,
  Route,
  RouteProps,
  RouteComponentProps,
} from "react-router-dom";

import { useCore } from "core";

const PrivateRoute = observer(
  ({ component: Component, ...rest }: RouteProps) => {
    const core = useCore();

    const render = Component
      ? (props: RouteComponentProps) => <Component {...props} />
      : () => <></>;

    const renderFallback = (props: RouteProps) => {
      const { location } = props;
      if (!location) return <Redirect to="/welcome" />;

      const redirect = `${location.pathname}${encodeURIComponent(
        location.search,
      )}${location.hash}`;
      const to = redirect === "/" ? "/home" : `/home?redirect=${redirect}`;

      return <Redirect to={to} />;
    };

    return (
      <Route
        {...rest}
        render={core.googleAuth.isLoggedIn ? render : renderFallback}
      />
    );
  },
);

export default PrivateRoute;
