/* eslint-disable no-restricted-globals */
// location을 직접적으로 구독하는 기능이 있으므로, eslint의 no-restricted-globals를 끕니다.

import { createBrowserHistory, Location } from "history";
import {
  SynchronizedHistory,
  RouterStore,
  syncHistoryWithStore,
} from "mobx-react-router";

import config from "config";

/**
 * RouterStore를 대체합니다.
 * 페이지를 열고, 하위 페이지를 관리합니다.
 */
export default class Router {
  public unsubscribeLocation?: () => void;

  public synchronizedHistory: SynchronizedHistory;

  // 추후 private로 변경될 예정
  private routerMobXStore: RouterStore;

  private subscribedListenerTuple?: [string, (location: Location) => void];

  constructor() {
    this.routerMobXStore = new RouterStore();

    const browserHistory = createBrowserHistory({
      basename: config.routerBaseName,
    });
    this.synchronizedHistory = syncHistoryWithStore(
      browserHistory,
      this.routerMobXStore,
    );
  }

  public get location() {
    return this.routerMobXStore.location;
  }

  public get history() {
    return this.routerMobXStore.history;
  }

  public open = (address: string, e?: React.MouseEvent<HTMLElement>) => {
    if (e && (e.metaKey || e.ctrlKey)) {
      window.open(address, "_blank");
    } else {
      this.routerMobXStore.push(address);
    }
  };

  public replace = (address: string) => {
    this.routerMobXStore.replace(address);
  };

  public goBack = () => {
    this.routerMobXStore.goBack();
  };

  public goForward = () => {
    this.routerMobXStore.goForward();
  };

  public go = (n: number) => {
    this.routerMobXStore.go(n);
  };

  public subscribeLocation = (listener: (l: Location) => void) => {
    if (!this.synchronizedHistory) {
      return;
    }

    if (
      this.unsubscribeLocation &&
      this.subscribedListenerTuple &&
      this.subscribedListenerTuple[0] === location.pathname
    ) {
      const prevListener = this.subscribedListenerTuple[1];
      this.subscribedListenerTuple = [
        location.pathname,
        (location: Location) => {
          listener(location);
          prevListener(location);
        },
      ];
      this.unsubscribeLocation();
      this.unsubscribeLocation = this.synchronizedHistory.subscribe(
        this.subscribedListenerTuple[1],
      );
    } else {
      if (this.unsubscribeLocation) {
        this.unsubscribeLocation();
      }
      this.subscribedListenerTuple = [location.pathname, listener];
      this.unsubscribeLocation = this.synchronizedHistory.subscribe(listener);
    }
  };
}
