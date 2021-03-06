import React, { useEffect } from "react";
import ReactGA, { FieldsObject } from "react-ga";
import { RouteComponentProps } from "react-router-dom";

import config from "config";

ReactGA.initialize([
  {
    trackingId: config.googleAnalytics.trackingId!,
  },
]);

const withTracker = <P extends RouteComponentProps>(
  WrappedComponent: React.ComponentType<P>,
  options: FieldsObject = {},
) => {
  const trackPage = (page: string) => {
    ReactGA.set({ page, ...options });
    ReactGA.pageview(page);
  };

  return (props: P) => {
    const { location } = props;
    useEffect(() => {
      trackPage(location.pathname);
    }, [location.pathname]);

    return <WrappedComponent {...props} />;
  };
};

export default withTracker;
