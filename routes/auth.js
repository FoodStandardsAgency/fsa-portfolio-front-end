var express = require('express');
var passport = require('passport');
var router = express.Router();
const graph = require('../app/graph');
const tokens = require('../app/tokens');
const login = require('../app/login');


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
    async function (req, res) {
        console.log("/callback: logging in...");
        var result = await loginWithIdToken(req, res);
        if (!result) {
            console.log("loginWithIdToken failed - redirecting");
            tokens.logout(req, res);
            res.redirect('/login');
            res.end();
        }
        else {
            console.log("loginWithIdToken success - redirecting");
            req.session.save(() => {
                console.log("/callback: session saved.");
                res.redirect('/');
            });
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
                await login.loginUser(req, res, user.userPrincipalName, accessToken);
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

router.get('/signout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;