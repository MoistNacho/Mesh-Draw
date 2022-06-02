import { Spinner } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React from "react";

import { useCore } from "core";

const SpinnerWrapper = observer(() => {
  const core = useCore();
  const { isSpinnerShow, isSpinnerBlocking, spinnerMessage } = core.dialog;

  return (
    <>
      {isSpinnerShow && (
        <Spinner blocking={isSpinnerBlocking} message={spinnerMessage} />
      )}
    </>
  );
});

export default SpinnerWrapper;
