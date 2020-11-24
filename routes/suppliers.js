var { add_supplier } = require('./../app/add_supplier');
var { render_add_supplier } = require('./../app/add_supplier');
var { check } = require('express-validator');
var express = require('express');
var login = require('./../app/login');
var router = express.Router();

//-------------------------------------------------------------------
// SUPPLIER ACCOUNT
//-------------------------------------------------------------------

router.get('/:portfolio/add-supplier', login.requireAdmin, async function (req, res) {
	await render_add_supplier(req, res);
});

router.post('/:portfolio/add-supplier', [check('user').escape()], async function (req, res) { await add_supplier(req, res); });

module.exports = router;