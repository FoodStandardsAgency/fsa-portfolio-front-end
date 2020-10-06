var { add_supplier } = require('./../app/add_supplier');
var { render_add_supplier } = require('./../app/add_supplier');
var { check } = require('express-validator');
var express = require('express');
var login = require('./../app/login');
var router = express.Router();

//-------------------------------------------------------------------
// SUPPLIER ACCOUNT
//-------------------------------------------------------------------

router.get('/:portfolio/add-supplier', login.requireLogin, function (req, res) {
	var portfolio = req.params.portfolio;
	if (req.session.user == 'portfolio') { render_add_supplier(req, res) }
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
});

router.post('/add-supplier', [check('user').escape()], function (req, res) { add_supplier(req, res); });

module.exports = router;