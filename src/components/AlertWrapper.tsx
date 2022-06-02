import { Alert } from "@meshkorea/vroong-design-system-web";
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
  const {
    title,
    message,
    showCancel,
    onClose,
    onConfirm,
    cancelText = "취소",
    confirmText,
  } = alertProps;

  const onClickConfirm = () => {
    if (onConfirm) onConfirm();
    if (onClose) onClose();
    closeAlert();
  };

  return (
    <>
      {isAlertShow && (
        <Alert
          title={title}
          message={message}
          showCancel={showCancel}
          onClose={onClose}
          onConfirm={onClickConfirm}
          cancelText={cancelText}
          confirmText={confirmText}
        />
      )}
    </>
  );
});

export default AlertWrapper;
