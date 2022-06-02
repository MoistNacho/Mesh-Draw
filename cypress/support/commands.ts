/* eslint-disable @typescript-eslint/camelcase, @typescript-eslint/no-namespace */

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Yields "login"
       *
       * @returns {typeof login}
       * @memberof Chainable
       * @example
       *    cy.login().then(f = ...)
       */
      login: typeof login;
    }
  }
}

/**
 * Login using Vroong accounts
 *
 * @example
 *    cy.login()
 */
export function login() {
  const loginOptions = {
    method: "POST",
    url: `${process.env.OAUTH_BASE_PATH}/api/login`,
    body: {
      email: process.env.OAUTH_TEST_EMAIL,
      password: process.env.OAUTH_TEST_PASSWORD,
      realm: "vroong",
    },
  };
  const authorizeOptions = {
    method: "GET",
    url: `${process.env.OAUTH_BASE_PATH}/api/oauth/authorize`,
    headers: {
      Authorization: "",
    },
    followRedirect: false,
  };
  cy.request(loginOptions)
    .then(res => {
      const queryObject: { [key: string]: string } = {
        response_type: "code",
        client_id: process.env.OAUTH_CLIENT_ID || "",
        redirect_uri: "http://localhost:19607/authorize",
        scope: "openid",
        state: "random.str",
      };
      const queryString = Object.keys(queryObject)
        .map(key => `${key}=${queryObject[key]}`)
        .join("&");
      authorizeOptions.url = `${authorizeOptions.url}?${queryString}`;
      const accessToken = res.body.access_token;
      authorizeOptions.headers.Authorization = `Bearer ${accessToken}`;
      return cy.request(authorizeOptions);
    })
    .then(res => {
      cy.log(res.headers.toString());
      const redirectUrl = new URL(res.headers.location);
      cy.visit(redirectUrl.href);
    });
}

Cypress.Commands.add("login", login);

export {};
