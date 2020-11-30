const backend = require('./backend');

module.exports = {
    getAccessToken: async function (req) {
        if (req.user) {
            // Get the stored token
            var storedToken = req.user.oauthToken;

            if (storedToken) {
                if (storedToken.expired()) {
                    // refresh token
                    var newToken = await storedToken.refresh();

                    // Update stored token
                    req.user.oauthToken = newToken;
                    return newToken.token.access_token;
                }

                // Token still valid, just return it
                return storedToken.token.access_token;
            }
        }
    },
    setBearerToken: async function (req, res, tokenbody) {
        var idresult = await backend.api(`Users/identity`, { context: { token: tokenbody.access_token } });
        var identity = idresult.body;
        res.cookie('access_token', tokenbody.access_token, { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: 360000 });
        res.cookie('identity', identity, { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: 360000 });
    },
    logout: function (req, res) {
        res.clearCookie('access_token');
        res.clearCookie('identity');
        //res.cookie('access_token', { expires: Date.now() });
        //res.cookie('identity', { expires: Date.now() });
    }
};