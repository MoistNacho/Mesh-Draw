import { observer } from "mobx-react";
import React, { useEffect } from "react";
import { Redirect } from "react-router-dom";

import { useCore } from "core";

const AuthorizePage = observer(() => {
  const core = useCore();
  const parsedSearch = new URLSearchParams(window.location.search);
  useEffect(() => {
    const code = parsedSearch.get("code");
    if (code) core.auth.loadAccessToken({ code });
  }, [core.auth, parsedSearch]);
  const redirect = parsedSearch.get("redirect");

  if (core.auth.isTokenLoading) return null;

  return <Redirect to={`/welcome?redirect=${redirect}`} />;
});

export default AuthorizePage;
