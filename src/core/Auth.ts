import { action, computed, observable } from "mobx";
import ReactGA from "react-ga";

import config from "config";
import { formatError } from "lib/error";

// 여기서는 type만 사용하기 때문에, import type문 사용 (사용하지 않을 경우 circular dependency 발생)
import type Core from "./Core";
import {
  AuthService,
  AccessTokenResult as User,
  TokenEndpointRequestOption,
} from "./services/AuthService";

const tokenStorageKey = `uaa:authUser:${config.oauth.clientId}`;

export default class Auth {
  @observable
  public isTokenLoading = false;

  @observable
  public profile?: {
    name: string;
  };

  // undefined: 인증 데이터를 브라우저 sessionStorage에서 불러오는 중
  // null: 인증 데이터 존재하지 않음
  // User: 인증 데이터 있음
  @observable
  private user?: User | null;

  private tokenTimer?: number;

  private watchingSessionStorage = false;

  private authService: AuthService;

  private core: Core;

  constructor(core: Core) {
    this.authService = new AuthService();
    this.core = core;
    this.init();
  }

  @computed
  get isLoggedIn(): boolean | undefined {
    if (this.user === undefined) {
      return undefined;
    }
    return !!this.user && !!this.profile;
  }

  @computed
  get apiKey(): string | undefined {
    if (!this.user || !this.user.accessToken) return undefined;
    return `Bearer ${this.user.accessToken}`;
  }

  @computed
  get accessToken() {
    return this.user ? this.user.accessToken : "";
  }

  @action
  public loadAccessToken = async (option: TokenEndpointRequestOption) => {
    try {
      this.isTokenLoading = true;
      this.user = await this.authService.getAccessToken(option);
      this.profile = { name: "test" }; // getProfile()
      this.startUpdateTokenTimer();
      sessionStorage.setItem(tokenStorageKey, JSON.stringify(this.user));

      ReactGA.event({
        category: "Auth",
        action: `Logged in (${option.code ? "manual" : "auto"})`,
        label: `Logged in to ${this.profile && this.profile.name}`,
      });
    } catch (e) {
      this.user = null;
      this.profile = undefined;

      if (e.status === 500 && e.message === "GENERAL") {
        this.core.dialog.openAlert({
          title: "인증 실패",
          message: `일시적인 오류로 사용자 인증이 실패했습니다.`,
          onConfirm: () => {
            this.redirectToUaaLogout();
          },
        });
      } else {
        throw e;
      }
    } finally {
      this.isTokenLoading = false;
    }
  };

  @action
  public logout = () => {
    this.clearSession(true);
    this.redirectToUaaLogout();
  };

  @action
  public startUpdateTokenTimer = () => {
    if (this.user === null) return;

    if (this.tokenTimer && this.tokenTimer > 0) {
      clearInterval(this.tokenTimer);
    }

    this.tokenTimer = window.setInterval(() => {
      this.updateToken();
    }, 5000);
  };

  @action
  public updateToken = async () => {
    try {
      if (!this.user) return;

      const currentTime = new Date().getTime();
      const expectedLatencyTime = 10000;
      if (currentTime >= this.user.tokenExpireTime - expectedLatencyTime) {
        await this.loadAccessToken({
          refreshToken: this.user.refreshToken,
        });
      }
    } catch (e) {
      this.core.dialog.openAlert({
        title: "재인증 실패",
        message: e.displayMessage,
      });
    }
  };

  public redirectToUAALogin = () => {
    const queryObj = new URLSearchParams({
      client_id: config.oauth.clientId!,
      redirect_uri: `${window.location.origin}/authorize${window.location.search}`,
      account_type: "VROONG",
    });

    window.location.href = `${config.oauth.basePath}?${queryObj.toString()}`;
  };

  public isTokenInStorage = () => {
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i) as string;
      const session = sessionStorage.getItem(tokenStorageKey);

      if (
        key === tokenStorageKey &&
        typeof session === "string" &&
        session.length > 0
      ) {
        return true;
      }
    }
    return false;
  };

  @action
  private init = async () => {
    const user = sessionStorage.getItem(tokenStorageKey);

    this.watchStorageEvent();

    if (!this.isTokenInStorage()) {
      localStorage.setItem("getSessionStorage", Date.now().toString());
    }

    if (user) {
      try {
        const userObject = JSON.parse(user) as User;
        if (this.isValidUserObject(userObject)) {
          if (Date.now() >= userObject.tokenExpireTime) {
            await this.loadAccessToken({
              refreshToken: userObject.refreshToken,
            });
          } else {
            this.user = userObject;
            this.profile = { name: "test" }; // getProfile()
            this.startUpdateTokenTimer();
          }
        } else {
          throw new Error();
        }
      } catch (e) {
        this.core.dialog.openAlert({
          title: "인증 오류",
          message:
            "접속 유저 정보가 잘못되었습니다. 로그아웃 후 재접속이 필요합니다.",
          onConfirm: () => {
            this.clearSession(false);
            this.redirectToUaaLogout();
          },
        });
      }
    } else {
      this.user = null;
      this.profile = undefined;
    }
  };

  private sessionEventListener = (event: StorageEvent) => {
    if (
      event.key === "getSessionStorage" &&
      event.newValue !== null &&
      Object.keys(sessionStorage).length // 비어있으면 복사하지 않는다
    ) {
      localStorage.setItem("sessionStorage", JSON.stringify(sessionStorage));
      localStorage.removeItem("sessionStorage");
    } else if (event.key === "sessionStorage") {
      try {
        const copiedStorage = JSON.parse(event.newValue!);
        if (copiedStorage !== null && typeof copiedStorage === "object") {
          Object.keys(copiedStorage).forEach((key) => {
            sessionStorage.setItem(key, copiedStorage[key]);
          });

          this.init();
        }
      } catch (e) {
        // json parsing error
      }
    } else if (event.key === "clearSession") {
      this.clearSession(false);
      this.core.dialog.openAlert({
        title: "세션 만료",
        message: "다른 탭에서 로그아웃되었습니다.",
        onConfirm: () => {
          this.redirectToUaaLogout();
        },
      });
    }
  };

  @action
  private clearSession = async (isExplicit: boolean) => {
    try {
      sessionStorage.removeItem(tokenStorageKey);

      ReactGA.event({
        category: "Auth",
        action: `Logged out (${isExplicit ? "manual" : "auto"})`,
        label: `Logged out by ${this.profile && this.profile.name}`,
      });

      localStorage.setItem("clearSession", Date.now().toString());
      this.unwatchStorageEvent();
      localStorage.removeItem("getSessionStorage");
      localStorage.removeItem("clearSession");
      window.clearInterval(this.tokenTimer);
      this.user = isExplicit ? undefined : null;
      this.profile = undefined;
    } catch (e) {
      const formattedError = await formatError(e);
      this.core.dialog.openAlert({
        title: "세션 만료",
        message: formattedError.displayMessage,
        onConfirm: () => {
          this.redirectToUaaLogout();
        },
      });
    }
  };

  private redirectToUaaLogout = () => {
    window.location.href = `${
      config.oauth.basePath
    }/logged-out?redirect_uri=${encodeURIComponent(window.location.href)}`;
  };

  private watchStorageEvent = () => {
    if (!this.watchingSessionStorage) {
      this.watchingSessionStorage = true;
      window.addEventListener("storage", this.sessionEventListener);
    }
  };

  private unwatchStorageEvent = () => {
    if (this.watchingSessionStorage) {
      this.watchingSessionStorage = false;
      window.removeEventListener("storage", this.sessionEventListener);
    }
  };

  private isValidUserObject = (user?: User): boolean => {
    return (
      !!user &&
      !!user.userName &&
      !!user.accessToken &&
      !!user.refreshToken &&
      !!user.tokenExpireTime &&
      !!user.tokenIssueTime
    );
  };
}
