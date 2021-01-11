[![Build Status](https://travis-ci.org/cmdbg/tokenator.svg?branch=develop)](https://travis-ci.org/cmdbg/tokenator)
# tokenator
Simple HTTP library to get tokens from 3rd party identity providers


# Usage

```javascript
import {
  AuthConfig,
  AadAuthenticationClient,
  Token,
  TokenError,
} from '@cmdbg/tokenator';

export class AadRopcStrategy {

  async getAccessToken(payload: AuthConfig): Promise<string> {
    const authConfig = {
      clientID: payload.clientID,
      clientSecret: payload.clientSecret,
      tenant: payload.tenant,
      scope: payload.scope,
      username: payload.username,
      password: payload.password,
    };

    const authClient = new AadAuthenticationClient(() => authConfig);
    const res = await authClient.authenticateROPC();
    const token = res as Token;

    if (token) return token.access_token;

    const err = res as TokenError;
    throw new Error(err.error_description);
  }
}
```
