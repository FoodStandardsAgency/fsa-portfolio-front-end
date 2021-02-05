var express = require('express');
var passport = require('passport');
var router = express.Router();
const backend = require('../app/backend');
const graph = require('../app/graph');
const tokens = require('../app/tokens');
const errors = require('./error');
const handleError = errors.handleError;



/* GET auth callback. */
router.get('/signin',
    function (req, res, next) {
        console.log("/signin");
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                prompt: 'login',
                failureRedirect: '/',
                failureFlash: true,
                successRedirect: '/'
            }
        )(req, res, next);
    }
);

function regenerateSessionAfterAuthentication(req, res, next) {
    var passportInstance = req.session.passport;
    return req.session.regenerate(function (err) {
        if (err) {
            return next(err);
        }
        req.session.passport = passportInstance;
        return req.session.save(next);
    });
}

router.post('/callback',
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/' } ),
    async function (req, res, next) {
        console.log("/callback: logging in...");
        var result = await loginWithIdToken(req, res);
        if (!result) {
            console.log("loginWithIdToken failed");
            tokens.logout(req, res);
            res.redirect('/login');
        }
        else {
            console.log("loginWithIdToken success");
            res.redirect('/');
        }
    }
);

async function loginWithIdToken(req, res) {
    // Get the access token
    console.log("loginWithIdToken()");
    var accessToken = await tokens.getAccessToken(req);
    var user = await graph.getUserDetails(accessToken);
    if (user) {
        try {
            const groups = await graph.getUserGroups(accessToken);
            if (groups) {
                await loginUser(req, res, user.userPrincipalName, accessToken);
                return true;
            }
        }
        catch (error) {
            handleError(error);
            return false;
        }
    }
    return false;
}

async function loginUser(req, res, loginUser, accessToken) {
    var result = await backend.api.post('Token', {
        form: {
            username: loginUser,
            password: '',
            grant_type: 'password'
        },
        context: {
            accessToken: accessToken
        }
    });

    if (result.statusCode == 200) {
        var tokenbody = result.body;
        await tokens.setBearerToken(req, res, tokenbody);
    }
    else {
        tokens.logout(req, res);
        errors.handleUnauthorised(res);
    }
}


router.get('/signout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;