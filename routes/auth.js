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

router.post('/callback',
    function (req, res, next) {
        console.log("/callback");
        passport.authenticate('azuread-openidconnect',
            {
                response: res,
                failureRedirect: '/',
                failureFlash: true,
                successRedirect: '/auth/signincomplete'
            }
        )(req, res, next);
    },
    function (req, res) {
        // TEMPORARY!
        // Flash the access token for testing purposes
        console.log("/callback - flash");
        req.flash('error_msg', { message: 'Access token', debug: req.user.accessToken });
        res.redirect('/');
    }
);

router.get('/signincomplete', function (req, res) {
    console.log("/signincomplete");
    res.redirect('/');
});

router.get('/signout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    }
);

module.exports = router;