import { Button } from "@meshkorea/vroong-design-system-web";
import { Location } from "history";
import { observer } from "mobx-react";
import * as React from "react";
import { Redirect } from "react-router-dom";

import { useCore } from "core";

interface WelcomePageProps {
  location: Location;
}

const WelcomePage = observer(({ location }: WelcomePageProps) => {
  const core = useCore();
  const { isLoggedIn } = core.auth;
  if (isLoggedIn) {
    const redirect = new URLSearchParams(location.search).get("redirect") || "";

    return (
      <Redirect
        to={`${decodeURIComponent(redirect) || "/"}${location.hash || ""}`}
      />
    );
  }

  if (isLoggedIn === undefined) return null;

  return (
    <div>
      <Button onClick={core.auth.redirectToUAALogin}>로그인</Button>
    </div>
  );
});

export default WelcomePage;
