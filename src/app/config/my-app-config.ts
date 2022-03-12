export default {
    oidc: {
        clientId: '0oa44w12li8jNe13G5d7', //public identifier of client app
        issuer: 'https://dev-72723088.okta.com/oauth2/default', //issuer of tokens
        redirectUri: 'http://localhost:4200/login/callback',
        scopes: ['openid', 'profile', 'email'] //scopes provide access to information about a user
    }   //openid is required for authentication requests profile: user's first name, last name, phone etc

}
