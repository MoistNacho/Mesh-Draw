import { AlertV2 } from "@meshkorea/vroong-design-system-web";
import { observer } from "mobx-react";
import React, { FC } from "react";

import { useCore } from "core";

export interface AlertProps {
  title: string;
  message: string;
  showCancel?: boolean;
  cancelText?: string;
  confirmText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
}

const AlertWrapper: FC = observer(() => {
  const core = useCore();

  const { isAlertShow, alertProps, closeAlert } = core.dialog!;
  const { title, message, onConfirm, confirmText = "확인" } = alertProps;

  const onClickConfirm = () => {
    if (onConfirm) onConfirm();
    closeAlert();
  };

  return (
    <>
      {isAlertShow && (
        <AlertV2
          title={title}
          message={message}
          onConfirm={onClickConfirm}
          confirmText={confirmText}
        />
      )}
    </>
  );
});

export default AlertWrapper;
