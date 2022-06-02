import { Context, useContext } from "react";

const generateUseContext = <C>(
  ctx: Context<C | null>,
  errorMessage?: string,
): (() => C) => () => {
  const store = useContext(ctx);

  if (!store) {
    throw new Error(
      errorMessage || "useStore must be used within a LocalContext Provider",
    );
  }
  return store;
};

export default generateUseContext;
