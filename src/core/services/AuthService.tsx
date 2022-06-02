/* eslint-disable camelcase, class-methods-use-this, no-await-in-loop */
import config from "config";
import { formatError } from "lib/error";

export interface TokenResultDTO {
  access_token: string;
  token_type: string;
  refresh_token: string;
  scope: string;
  expires_in: number;
  iat: number;
  jti: string;
}

// TokenResultDTO의 access_token의 payload가 객체로 파싱된 후 인터페이스
interface AccessTokenDTO {
  user_name: string;
  authorities: string[];
  client_id: string;
  scope: string[];
  exp: number;
  iat: number;
  jti: string;
}

export interface AccessTokenResult {
  userName: string;
  authorities: string[];
  accessToken: string;
  refreshToken: string;
  tokenExpireTime: number;
  tokenIssueTime: number;
}

export interface TokenEndpointRequestOption {
  refreshToken?: string;
  code?: string;
}

export interface UaaTokenApi {
  getToken: (option: TokenEndpointRequestOption) => Promise<TokenResultDTO>;
}

export const getPayloadFromJWT = (encodded: string) =>
  JSON.parse(atob(encodded.split(".")[1])) as AccessTokenDTO;

export const uaaApi: UaaTokenApi = {
  async getToken(option: TokenEndpointRequestOption): Promise<TokenResultDTO> {
    let requestBody;

    if (option.code) {
      requestBody = {
        grant_type: "authorization_code",
        code: option.code,
        redirect_uri: `${window.location.origin}/authorize`,
      };
    } else if (option.refreshToken) {
      requestBody = {
        grant_type: "refresh_token",
        refresh_token: option.refreshToken,
      };
    }

    requestBody = new URLSearchParams(requestBody);

    const res = await fetch(`${config.oauth.basePath}/api/oauth/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(
          `${config.oauth.clientId}:${config.oauth.clientSecret}`,
        )}`,
        "Content-Type": "application/x-www-form-urlencoded;",
      },
      body: requestBody.toString(),
    });

    const body = await res.json();
    return body;
  },
};

export class AuthService {
  public async getAccessToken(
    option: TokenEndpointRequestOption,
  ): Promise<AccessTokenResult> {
    try {
      let tokenRes: TokenResultDTO;
      for (let count = 0; count < 6; count += 1) {
        tokenRes = await uaaApi.getToken(option);

        if ("error" in tokenRes) {
          if (count === 5) {
            throw tokenRes;
          }

          await new Promise<void>((res) => {
            setTimeout(() => res(), 200);
          });
        } else {
          break;
        }
      }

      const accessTokenPayload = getPayloadFromJWT(tokenRes!.access_token);

      return {
        userName: accessTokenPayload.user_name,
        accessToken: tokenRes!.access_token,
        refreshToken: tokenRes!.refresh_token,
        authorities: accessTokenPayload.authorities,
        tokenExpireTime: accessTokenPayload.exp * 1000,
        tokenIssueTime: accessTokenPayload.iat * 1000,
      };
    } catch (e) {
      throw await formatError(e);
    }
  }
}
