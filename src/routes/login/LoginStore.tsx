import { observable, action } from "mobx";

import Core from "core";

export default class LoginStore {
  @observable
  public username = "";

  @observable
  public password = "";

  @observable
  public isLoading = false;

  private core: Core;

  constructor(core: Core) {
    this.core = core;
  }

  @action
  public setUsername = (value: string) => {
    this.username = value;
  };

  @action
  public setPassword = (value: string) => {
    this.password = value;
  };

  @action
  // eslint-disable-next-line require-await
  public login = async () => {
    this.isLoading = true;
    try {
      // await this.authStore.login(this.username, this.password);
      this.core.dialog.openAlert({
        title: "로그인 성공",
        message: "로그인에 성공하였습니다.",
      });
    } catch (e) {
      this.core.dialog.openAlert({
        title: "로그인 실패",
        message: "로그인에 실패하였습니다.",
      });
    } finally {
      this.isLoading = false;
    }
  };
}

// prevent HMR and reload to update changes
if (module.hot) module.hot.decline();
