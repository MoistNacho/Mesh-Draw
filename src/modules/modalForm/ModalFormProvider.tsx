import React from "react";

import { useCore } from "core";
import { generateUseContext } from "lib/context";

import ModalFormStore from "./ModalFormStore";

export interface ModalFormContext {
  modalFormStore: ModalFormStore;
}

interface Props {
  children: React.ReactNode;
}

const LocalContext = React.createContext<ModalFormContext | null>(null);

export const useModalFormStore = generateUseContext(LocalContext);

const ModalFormProvider: React.FC<Props> = ({ children }) => {
  const core = useCore();

  const [stores] = React.useState<ModalFormContext>(() => ({
    modalFormStore: new ModalFormStore(core),
  }));

  return (
    <LocalContext.Provider value={stores}>{children}</LocalContext.Provider>
  );
};

export default ModalFormProvider;
