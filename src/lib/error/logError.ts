import debug from "debug";
import ReactGA from "react-ga";

import DefaultError from "./DefaultError";

const debugError = debug("app:error");

const logError = (e: DefaultError, description?: string) => {
  debugError(e);
  ReactGA.exception({
    description: `${description}: ${e.displayMessage}`,
    fatal: true,
  });
};

export default logError;
