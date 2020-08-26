var passport = require('passport');
var OIDCStrategy = require('passport-azure-ad').OIDCStrategy;

function configurePassport() {
    console.log("Configuring passport");

    // Configure passport

    // In-memory storage of logged-in users
    // For demo purposes only, production apps should store
    // this in a reliable storage
    var users = {};

    // Passport calls serializeUser and deserializeUser to
    // manage users
    passport.serializeUser(function (user, done) {
        // Use the OID property of the user as a key
        users[user.profile.oid] = user;
        done(null, user.profile.oid);
    });

    passport.deserializeUser(function (id, done) {
        done(null, users[id]);
    });

    // Callback function called once the sign-in is complete
    // and an access token has been obtained
    async function signInComplete(iss, sub, profile, accessToken, refreshToken, params, done) {
        if (!profile.oid) {
            return done(new Error("No OID found in user profile."));
        }

        // Save the profile and tokens in user storage
        users[profile.oid] = { profile, accessToken };
        return done(null, users[profile.oid]);
    }

    // Configure OIDC strategy
    passport.use(new OIDCStrategy(
        {
            identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
            clientID: process.env.OAUTH_APP_ID,
            responseType: 'code id_token',
            responseMode: 'form_post',
            redirectUrl: process.env.OAUTH_REDIRECT_URI,
            allowHttpForRedirectUrl: true,
            clientSecret: process.env.OAUTH_APP_PASSWORD,
            validateIssuer: false,
            passReqToCallback: false,
            scope: process.env.OAUTH_SCOPES.split(' ')
        },
        signInComplete
    ));
}

module.exports = {
    configurePassport
};