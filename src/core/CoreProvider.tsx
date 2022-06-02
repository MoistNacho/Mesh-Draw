import { observer } from "mobx-react";
import React, { createContext, FC, useState } from "react";
import { IntlProvider } from "react-intl";

import Core from "core";
import { generateUseContext } from "lib/context";

const CoreContext = createContext<Core | null>(null);

export const useCore = generateUseContext(
  CoreContext,
  "Cannot find the core context.",
);

const CoreProvider: FC = observer(({ children }) => {
  const [core] = useState(() => new Core());
  return (
    <CoreContext.Provider value={core}>
      <IntlProvider locale={core.locale}>{children}</IntlProvider>
    </CoreContext.Provider>
  );
});

export default CoreProvider;
