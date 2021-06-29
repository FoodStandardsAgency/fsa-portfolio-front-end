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

function getUser(req, res) {
	if (req.query.reset) {
		res.cookie('userSearch', '', { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: -1 });
		return req.cookies.identity.userid;
	} else if (req.body.userSearch) {
		res.cookie('userSearch', req.body.userSearch, { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: 1000 * 60 * 60 * 24 });
		return req.body.userSearch;
	}
	else {
		return req.cookies.userSearch ?? req.cookies.identity.userid;
	}
}

async function viewUserSummaryView(req, res, summaryType, view) {
	var portfolio = req.params.portfolio;
	var user = getUser(req, res);
	try {
		var response = await queries.portfolio_user_summary(portfolio, summaryType, user, req);
		var summary = response.body;
		res.render(view, {
			"portfolio": portfolio,
			"summary": summary,
			"labels": getSummaryLabels(summary)
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function viewUserSummary(req, res, summaryType) {
	await viewUserSummaryView(req, res, summaryType, 'user_summary');
}

async function viewUserSummaryList(req, res, summaryType) {
	await viewUserSummaryView(req, res, summaryType, 'user_summary_list');
}


router.post('/:portfolio/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "user");
});

router.get('/:portfolio/user', login.requireLogin, async function (req, res) {
	await viewUserSummary(req, res, "user");
});

router.get('/:portfolio/category/user', login.requireLogin, async function (req, res) {
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