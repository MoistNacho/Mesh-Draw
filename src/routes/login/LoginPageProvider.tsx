import React, { useState } from "react";
import { hot } from "react-hot-loader/root";

import Core, { useCore } from "core";

import LoginPage from "./LoginPage";
import LoginStore from "./LoginStore";

interface LocalStores {
  core: Core;
  loginStore: LoginStore;
}

const LocalContext = React.createContext<LocalStores>(
  (null as unknown) as LocalStores,
);

export const useLoginPageStores = () => {
  const store = React.useContext(LocalContext);
  if (!store) {
    throw new Error("useStore must be used within a LocalContext Provider");
  }
  return store;
};

const LoginPageProvider = () => {
  const core = useCore();
  const [stores] = useState<LocalStores>(() => {
    const loginStore = new LoginStore(core);

    return {
      core,
      loginStore,
    };
  });

  return (
    <LocalContext.Provider value={stores}>
      <LoginPage />
    </LocalContext.Provider>
  );
};

export default hot(LoginPageProvider);
