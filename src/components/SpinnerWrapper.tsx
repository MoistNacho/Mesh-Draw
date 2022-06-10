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
    background-color: #435d7a40;
    border-radius: 50%;
    border: 4px solid #435d7a40;
    path:nth-child(1) {
      fill: #fff;
    }
    path:nth-child(2) {
      fill: #59789a;
    }
  }
`;
