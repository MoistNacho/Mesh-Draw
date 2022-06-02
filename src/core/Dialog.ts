import { action, observable } from "mobx";

import { AlertProps } from "components/AlertWrapper";

export default class Dialog {
  @observable
  public isAlertShow = false;

  @observable
  public isSpinnerShow = false;

  @observable
  public isSpinnerBlocking = false;

  @observable
  public spinnerMessage?: string;

  @observable
  public alertProps: AlertProps = {
    title: "",
    message: "",
  };

  @action
  public openAlert = (
    alertProps: Pick<AlertProps, Exclude<keyof AlertProps, "close">>,
  ) => {
    this.alertProps = alertProps;
    this.isAlertShow = true;
  };

  @action
  public closeAlert = () => {
    this.isAlertShow = false;
  };

  @action
  public openSpinner = (blocking?: boolean, message?: string) => {
    this.isSpinnerShow = true;
    this.isSpinnerBlocking = !!blocking;
    this.spinnerMessage = message;
  };

  @action
  public closeSpinner = () => {
    this.isSpinnerShow = false;
  };
}
