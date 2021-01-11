import { Token, AuthConfig, TokenError, AuthConfigFactory } from "../../types";
import { AuthFlow, HttpClient } from "../../util";

/**
 * Http client for authentication scenarios against AAD.
 *
 *
 * Examples:
 *
 * ```
 * const authConfig  = {
 * clientID: process.env.AUTH_AAD_CLIENT_APP_ID ?? '',
 * clientSecret: process.env.AUTH_AAD_CLIENT_APP_SECRET ?? '',
 * scope: process.env.AUTH_AAD_API_SCOPE ?? '',
 * tenant: process.env.AUTH_AAD_TENANT ?? '',
 * username: process.env.AUTH_AAD_USER_UPN ?? '',
 * password: process.env.AUTH_AAD_USER_PASSWORD ?? '',
 * }
 *
 * const authClient = new AuthenticationClient(() => authConfig);
 * const res = await authClient.authenticateROPC();
 * const token = res as Token;
 * if(token)
 * doSomething(token.access_token); //token acquired successfully
 * else
 * {
 * console.log(res); //token couldn't be acquired
 *}
 *```
 */
export class AadAuthenticationClient extends HttpClient {
  authConfig: AuthConfig;

  public constructor(authConfig: AuthConfigFactory) {
    super(
      () =>
        `https://login.microsoftonline.com/${
          authConfig().tenant
        }/oauth2/v2.0/token`
    );
    this.authConfig = authConfig();
  }

  /**
   * [Resource Owner Password Credentials flow (ROPC)](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth-ropc)
   * [RFC 6749 Section 4.3](https://tools.ietf.org/html/rfc6749#section-4.3)
   *
   * @api public
   * @returns Returns {@linkcode TokenError} if the grant is successful or {@linkcode TokenError}  if the grant fails.
   */
  async authenticateROPC(): Promise<Token | TokenError> {
    let token;
    const params = new URLSearchParams();
    params.append("client_id", this.authConfig.clientID);
    params.append("scope", this.authConfig.scope);
    params.append("username", this.authConfig.username);
    params.append("password", this.authConfig.password);
    params.append("grant_type", AuthFlow.ROPC);

    try {
      token = await this.authenticate(params);
    } catch (error) {
      return error.response.data as TokenError;
    }

    return token as Token;
  }

  /**
   * [Client credentials grant flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-client-creds-grant-flow)
   * [RFC 6749 Section 4.4](https://tools.ietf.org/html/rfc6749#section-4.4)
   *
   *
   * @api public
   * @returns Returns {@linkcode Token} if the grant is successful or {@linkcode TokenError} if the grant fails.
   */
  async authenticateClientCredentials(): Promise<Token | TokenError> {
    let token;
    const params = new URLSearchParams();
    params.append("client_id", this.authConfig.clientID);
    params.append("client_secret", this.authConfig.clientSecret);
    params.append("scope", this.authConfig.scope);
    params.append("grant_type", AuthFlow.CLIENT_CREDENTIALS);

    try {
      token = await this.authenticate(params);
    } catch (error) {
      return error.response.data as TokenError;
    }

    return token as Token;
  }

  /**
   * [On-behalf-of Flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow)
   *
   *
   * @api public
   * @returns Returns {@linkcode Token} if the grant is successful or {@linkcode TokenError} if the grant fails.
   */
  async authenticateOBO(access_token: string): Promise<Token | TokenError> {
    let token;
    const params = new URLSearchParams();
    params.append("client_id", this.authConfig.clientID);
    params.append("client_secret", this.authConfig.clientSecret);
    params.append("scope", this.authConfig.scope);
    params.append("grant_type", AuthFlow.OBO);
    params.append("assertion", access_token);
    params.append("requested_token_use", "on_behalf_of");

    try {
      token = await this.authenticate(params);
    } catch (error) {
      return error.response.data as TokenError;
    }

    return token as Token;
  }
}
