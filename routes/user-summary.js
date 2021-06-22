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

function getUser(req) {
	if (req.body.userSearch) {
		return req.body.userSearch;
	}
	else {
		return req.cookies.identity.userid;
	}
}

async function viewUserSummary(req, res, summaryType) {
	var portfolio = req.params.portfolio;
	var user = getUser(req);
	try {
		var response = await queries.portfolio_user_summary(portfolio, summaryType, user, req);
		var summary = response.body;
		res.render('user_summary', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function viewUserSummaryList(req, res, summaryType) {
	var portfolio = req.params.portfolio;
	var user = getUser(req);
	try {
		var response = await queries.portfolio_user_summary(portfolio, summaryType, user, req);
		var summary = response.body;
		res.render('user_summary_list', {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}


router.post('/:portfolio/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "category");
});

router.get('/:portfolio/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "category");
});

router.get('/:portfolio/priority/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "priority");
});

router.get('/:portfolio/team/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "team");
});

router.get('/:portfolio/rag/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "rag");
});

router.get('/:portfolio/status/user', login.requireLogin, async function (req, res) {
	await viewUserSummaryList(req, res, "phase");
});

router.get('/:portfolio/lead/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "lead");
});

router.get('/:portfolio/new_projects/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "newbyteam");
});

module.exports = router;