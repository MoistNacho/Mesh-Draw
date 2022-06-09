import { observable } from "mobx";

import Auth from "./Auth";
import Dialog from "./Dialog";
import GoogleAuth from "./GoogleAuth";
import PopUp from "./PopUp";
import Router from "./Router";

export default class Core {
  public auth: Auth;

  public dialog: Dialog;

  public router: Router;

  public popUp: PopUp;

  public googleAuth: GoogleAuth;

  @observable
  public locale = "ko";

  private stores: {
    [key: string]: any;
  } = {};

  constructor() {
    this.auth = new Auth(this);
    this.dialog = new Dialog();
    this.router = new Router();
    this.popUp = new PopUp();
    this.googleAuth = new GoogleAuth(this);

    // expose core during tests
    if ((window as any).Cypress) {
      (window as any).core = this;
    }
  }

  public addStore = (key: string, store: any) => {
    this.stores[key] = store;
  };

  public getStore = (key: string) => this.stores[key];

  public clearStores = () => {
    this.stores = {};
  };

  public reset = () => this.clearStores();
}
