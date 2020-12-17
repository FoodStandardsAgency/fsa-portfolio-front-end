var express = require('express');
var passport = require('passport');
var router = express.Router();

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
    regenerateSessionAfterAuthentication,
    function (req, res) {
        console.log("/callback");
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