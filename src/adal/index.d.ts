declare module 'adal' {
    export function inject(config: adal.Config): adal.AuthenticationContext;
}

declare namespace adal {

    interface Config {
        clientId: string,
        anonymousEndpoints?: any,
        cacheLocation?: string,
        correlationId?: string,
        displayCall?: (urlNavigate: string) => any,
        endpoints?: any,  // If you need to send CORS api requests.
        expireOffsetSeconds?: number,
        extraQueryParameter?: string,
        instance?: string,
        localLoginUrl?: string,
        loginResource?: string,
        postLogoutRedirectUri?: string,
        redirectUri?: string,
        state?: string,
        tenant?: string
    }

    interface User {
        userName: string,
        profile?: any
    }

    interface RequestInfo {
        valid: boolean,
        parameters: any,
        stateMatch: boolean,
        stateResponse: string,
        requestType: string
    }

    interface AuthenticationContextStatic {
        new (config: Config): AuthenticationContext;
    }

    interface AuthenticationContext {

        REQUEST_TYPE: {
            LOGIN: string,
            RENEW_TOKEN: string,
            UNKNOWN: string
        };
        instance: string;
        config: Config;

        /**
         * Gets initial Idtoken for the app backend
         * Saves the resulting Idtoken in localStorage.
         */
        login(): void;
        loginInProgress(): boolean;

        /**
         * Gets token for the specified resource from local storage cache
         * @param {string}   resource A URI that identifies the resource for which the token is valid.
         * @returns {string} token if exists and not expired or null
         */
        getCachedToken(resource: string): string;

        /**
         * Retrieves and parse idToken from localstorage
         * @returns {User} user object
         */
        getCachedUser(): User;

        registerCallback(expectedState: string, resource: string, callback: (message: string, token: string) => any): void;

        /**
         * Acquire token from cache if not expired and available. Acquires token from iframe if expired.
         * @param {string}   resource  ResourceUri identifying the target resource
         * @param {requestCallback} callback
         */
        acquireToken(resource: string, callback: (message: string, token: string) => any): void;

        /**
         * Redirect the Browser to Azure AD Authorization endpoint
         * @param {string}   urlNavigate The authorization request url
         */
        promptUser(urlNavigate: string): void;

        /**
         * Clear cache items.
         */
        clearCache(): void;

        /**
         * Clear cache items for a resource.
         */
        clearCacheForResource(resource: string): void;

        /**
         * Logout user will redirect page to logout endpoint.
         * After logout, it will redirect to post_logout page if provided.
         */
        logOut(): void;

        /**
         * Gets a user profile
         * @param {requestCallback} callback - The callback that handles the response.
         */
        getUser(callback: (message: string, user?: User) => any): void;

        /**
         * Checks if hash contains access token or id token or error_description
         * @param {string} hash  -  Hash passed from redirect page
         * @returns {Boolean}
         */
        isCallback(hash: string): boolean;

        /**
         * Gets login error
         * @returns {string} error message related to login
         */
        getLoginError(): string;

        /**
         * Gets requestInfo from given hash.
         * @returns {string} error message related to login
         */
        getRequestInfo(hash: string): RequestInfo;

        /**
         * Saves token from hash that is received from redirect.
         */
        saveTokenFromHash(requestInfo: RequestInfo): void;

        /**
         * Gets resource for given endpoint if mapping is provided with config.
         * @param {string} endpoint  -  API endpoint
         * @returns {string} resource for this API endpoint
         */
        getResourceForEndpoint(endpoint: string): string;

        handleWindowCallback(): void;

        callback : any;

        _getItem : any;

        _renewFailed : any;

        CONSTANTS : any;

        log(level: number, message: string, error: any): void;
        error(message: string, error: any): void;
        warn(message: string): void;
        info(message: string): void;
        verbose(message: string): void;
    }

}

interface Window {
    AuthenticationContext : any;
    callBackMappedToRenewStates : any;
}

