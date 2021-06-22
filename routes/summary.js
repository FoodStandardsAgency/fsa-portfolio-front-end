const login = require('./../app/login');
const errors = require('./../app/error');
const handleError = errors.handleError;
var queries = require('./../app/queries');
const txt = require('./../app/libs/textUtils');


var express = require('express');
var router = express.Router();

//-------------------------------------------------------------------
// SUMMARY PAGES
//-------------------------------------------------------------------
function getSummaryLabels(summary) {
	return summary.labels.reduce(function (map, obj) {
		map[obj.field] = txt.toLowercaseExceptTLAs(obj.label || obj.fieldtitle);
		return map;
	}, {});
}


router.get('/:portfolio', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "category", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
});


router.get('/:portfolio/priority/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "priority", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}

});

router.get('/:portfolio/team/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "team", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}
});

router.get('/:portfolio/rag/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "rag", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}

});

router.get('/:portfolio/status/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "phase", req);
		var summary = response.body;
		res.render('summary_list', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}
});

router.get('/:portfolio/lead/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "lead", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}
});

router.get('/:portfolio/new_projects/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "newbyteam", req);
		var summary = response.body;
		res.render('summary', {
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		if (!handleError(error)) res.end();
	}
});

router.get('/:portfolio/completed', login.requireLogin, function (req, res) { res.redirect('/archived'); });

router.get('/:portfolio/portfolio-team', login.requireAdmin, (req, res) => {
	var portfolio = req.params.portfolio;
	res.render('team-page', { "portfolio": portfolio });
});

module.exports = router;