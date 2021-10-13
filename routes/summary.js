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

function getProjectType(req, res) {
	return req.cookies.projectType;
}


async function renderSummaryView(req, res, summaryType, view) {
	var portfolio = req.params.portfolio;
	try {
		var projectType = getProjectType(req, res);
		var response = await queries.portfolio_projectType_summary(portfolio, summaryType, projectType, req);
		var summary = response.body;
		var labels = getSummaryLabels(summary);
		res.render(view, {
			"portfolio": portfolio,
			"summaryType": summaryType,
			"summary": summary,
			"labels": labels,
			"project_type": projectType
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

router.post('/:portfolio/projectType', login.requireLogin, async function (req, res) {
	if (req.body.project_type) {
		res.cookie('projectType', req.body.project_type, { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: 1000 * 60 * 60 * 24 });
		req.cookies.projectType = req.body.project_type;
	}
	else {
		res.cookie('projectType', '', { httpOnly: true, secure: process.env.NODE_ENV != 'development', maxAge: -1 });
		req.cookies.projectType = '';
    }
	var summaryType = req.query.summaryType || "category";
	var view = summaryType == "phase" ? "summary_list" : "summary";
	await renderSummaryView(req, res, summaryType, view);
});

router.get('/:portfolio', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "category", "summary");
});

router.get('/:portfolio/priority/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "priority", "summary");
});

router.get('/:portfolio/team/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "team", "summary");
});

router.get('/:portfolio/rag/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "rag", "summary");
});

router.get('/:portfolio/status/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "phase", "summary_list");
});

router.get('/:portfolio/lead/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "lead", "summary");
});

router.get('/:portfolio/new_projects/', login.requireLogin, async function (req, res) {
	await renderSummaryView(req, res, "newbyteam", "summary");
});

router.get('/:portfolio/completed', login.requireLogin, function (req, res) { res.redirect('/archived'); });


// Admin screen
router.get('/:portfolio/portfolio-team', login.requireAdmin, async (req, res) => {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary_labels(portfolio, req);
		var summary = response.body;
		var labels = getSummaryLabels(summary);
		res.render('team-page', {
			"portfolio": portfolio,
			"labels": labels
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}

});

module.exports = router;