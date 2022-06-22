import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  User,
} from "firebase/auth";
import { action, computed, observable } from "mobx";

import type Core from "./Core";
import { fbAuth, provider } from "./services/FireBase";

export default class GoogleAuth {
  public core: Core;

  @observable
  public user: User | null;

  constructor(core: Core) {
    this.core = core;
  }

  @computed
  get isLoggedIn(): boolean | null {
    if (this.user === null) {
      return null;
    }

    return !!this.user;
  }

  @action
  public googleLogin() {
    setPersistence(fbAuth, browserLocalPersistence).then(() => {
      signInWithPopup(fbAuth, provider)
        .then((data) => {
          this.user = data.user;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          console.error(err);
        });
    });
  }

  @action
  public logout = () => {
    fbAuth.signOut();
    this.user = null;
  };

  @action
  public setUser = () => {
    onAuthStateChanged(fbAuth, (result) => {
      this.user = result;
    });
  };
}
