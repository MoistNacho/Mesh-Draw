import { Spinner } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React from "react";
import styled from "styled-components";

import { useCore } from "core";

const SpinnerWrapper = observer(() => {
  const core = useCore();
  const { isSpinnerShow, isSpinnerBlocking, spinnerMessage } = core.dialog;

  return (
    <Custom>
      {isSpinnerShow && (
        <Spinner blocking={isSpinnerBlocking} message={spinnerMessage} />
      )}
    </Custom>
  );
});

export default SpinnerWrapper;

const Custom = styled.div`
  svg {
    /* background-color: #fff;
    border-radius: 50%; */
    path:nth-child(1) {
      fill: #fff;
    }
    path:nth-child(2) {
      fill: #435d7a;
    }
  }
`;
