var express = require('express');
var passport = require('passport');
var router = express.Router();
const backend = require('../app/backend');
const graph = require('../app/graph');
const tokens = require('../app/tokens');
const errors = require('../app/error');
const handleError = errors.handleError;
const oauth_prompt = process.env.OAUTH_PROMPT;


/* GET auth callback. */
router.get('/signin',
    function (req, res, next) {
        console.log("LOGIN: /signin...");
        passport.authenticate('azuread-openidconnect',
            {
                session: false,
                response: res,
                prompt: oauth_prompt,
                failureRedirect: '/auth/signinfail',
                //failureFlash: true
            }
        )(req, res, next);
    },
    function (req, res) {
        console.log("LOGIN: /signin - response received from Azure"); // NEVER GETS HERE!!! BUT THIS IS IN THE EXAMPLE!?
        res.redirect('/');
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
    function (req, res, next) {
        console.log("LOGIN: /callback...");
        next();
    },
    function (req, res, next) {
        passport.authenticate('azuread-openidconnect', { response: res, failureRedirect: '/auth/openidfail' })(req, res, next);
    },
    async function (req, res, next) {
        console.log("LOGIN: /callback: logging in...");
        var result = await loginWithIdToken(req, res);
        if (!result) {
            console.log("LOGIN: loginWithIdToken failed");
            tokens.logout(req, res);
            res.redirect('/login');
        }
        else {
            console.log("LOGIN: loginWithIdToken success");
            res.redirect('/');
        }
    }
);



async function loginWithIdToken(req, res) {
    // Get the access token
    console.log("LOGIN: loginWithIdToken()");
    var accessToken = await tokens.getAccessToken(req);
    var user = await graph.getUserDetails(accessToken);
    if (user) {
        console.log(`LOGIN: loginWithIdToken - user=${user.userPrincipalName}`);
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

router.get('/openidfail',
    function (req, res) {
        console.log("LOGIN: openID fail");
        res.redirect('/');
    }
);
router.get('/signinfail',
    function (req, res) {
        console.log("LOGIN: signIn fail");
        res.redirect('/');
    }
);


router.get('/signout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;