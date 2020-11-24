var express = require('express');
var { check } 		= require('express-validator');
const _ 				= require('lodash');
const multer			= require('multer');
const jwt 				= require('jsonwebtoken');
const xss				= require('xss');
const stringify 		= require('csv-stringify')

// Custom modules
const handleError		= require('./error');
const config 			= require('./config');
var queries 			= require('./queries');

const add_project 		= require('./render_add_project');
const update_portfolio 	= require('./update_portfolio');
const delete_portfolio	= require('./delete_portfolio');
const update_odd 		= require('./update_odd');
const handle_form 		= require('./handle_add_update');
const handle_delete		= require('./handle_delete');
const bulk				= require('./bulk');
const login 			= require('./login');
const filter_view 		= require('./filter_view');
const project_view 		= require('./project_view');
const odd_view			= require('./oddleads_view');

var router = express.Router();

// Add timestamps to logs
require('log-timestamp');
console.log("User entry (timestamp 1hr behind)");

// Prep data for summary views
function nestedGroupBy(data, keys) {
  var grouped = {};
  data.forEach((item) => {
    _.update(grouped,
      keys.map((k) => item[k]).join('.'),
      (val) => val ? (val.push(item), val) : [item]
    );
  });
  
 return grouped;
}





//-------------------------------------------------------------------
// LOGIN PAGE
//-------------------------------------------------------------------

router.get ('/login', function (req, res) {res.render("login");});
router.post('/login', [check('user').escape()], function (req, res) { login.login(req, res); });

router.get('/log-out', (req, res) => {
	// Destroy session and log out
	req.session.destroy(function (err) {
		req.logout();
		res.redirect('/login');
	});
});


//-------------------------------------------------------------------
// PORTFOLIO LANDING PAGE
//-------------------------------------------------------------------

router.get('/', login.requireLogin, async (req, res) => {
	var result = await queries.portfolio_index();
	var portfolios = result.body;
	res.render('landing', {
		"data":portfolios,
		"sess": req.session
	});
})


//-------------------------------------------------------------------
// CONFIGURATION
//-------------------------------------------------------------------

router.get('/:portfolio/configure', login.requireAdmin, async (req, res) => {

	try {
		// Need to get current configuration data to pre-populate the form

		var portfolio = req.params.portfolio;
		var result = await queries.portfolio_config(portfolio);
		var portfolioconfig = result.body;

		//console.log(config.labels);

		var fieldGroups = config.getFieldGroups(portfolioconfig);

		//console.log(fieldGroups);

		res.render('configure', {
			"data": "",
			"sess": req.session,
			"portfolio": portfolio,
			"fieldgroups": fieldGroups
		});
	}
	catch (error) {
		handleError(error);
		res.end();
    }
})

router.post('/:portfolio/configure', login.requireAdmin, async (req, res) => {
	try {
		var portfolio = req.params.portfolio;

		//console.log(req.body);

		await queries.portfolio_config_update(portfolio, req.body);
		res.redirect(`/${portfolio}/configure`);
		res.end();
	}
	catch (error) {
		if (error.response.statusCode == 403) {
			res.render('error_page', {
				title: "Configuration Error",
				message: error.response.statusMessage,
				link: {
					url: `/${portfolio}/configure`,
					text: "Back to configuration"
				}
			});
		}
		else {
			handleError(error);
			res.end();
		}
	}

})



//-------------------------------------------------------------------
// SUMMARY PAGES
//-------------------------------------------------------------------

router.get('/:portfolio', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "category");
		var summary = response.body;
		res.render('summary', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
    }
});


router.get('/:portfolio/priority/', login.requireLogin, async function (req, res) {	
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "priority");
		var summary = response.body;
		res.render('summary', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}

});

router.get('/:portfolio/team/', login.requireLogin, async function (req, res) {	
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "team");
		var summary = response.body;
		res.render('summary', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}
});

router.get('/:portfolio/rag/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "rag");
		var summary = response.body;
		res.render('summary', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}

});

router.get('/:portfolio/status/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "phase");
		var summary = response.body;
		res.render('summary_list', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}
});

router.get('/:portfolio/lead/', login.requireLogin, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "lead");
		var summary = response.body;
		res.render('summary', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}
});

router.get('/:portfolio/new_projects/', login.requireLogin, async function (req, res) {	
	var portfolio = req.params.portfolio;
	try {
		var response = await queries.portfolio_summary(portfolio, "newbyteam");
		var summary = response.body;
		res.render('summary_list', {
			"sess": req.session,
			"portfolio": portfolio,
			"summary": summary
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}
});

router.get('/:portfolio/portfolio-team', login.requireAdmin, (req, res) => {
	var portfolio = req.params.portfolio;
	res.render('team-page', {"sess": req.session, "portfolio":portfolio});
});
		
	
//-------------------------------------------------------------------
// FILTER VIEW
//-------------------------------------------------------------------

router.get('/:portfolio/filter-view', login.requireLogin, async function (req, res) { await filter_view.view(req, res); });
router.post('/:portfolio/filter-view', login.requireLogin, async function (req,res) { await filter_view.getResults(req,res)});

//-------------------------------------------------------------------
// PROJECT VIEW
//-------------------------------------------------------------------

router.get('/:portfolio/Projects/:project_id', login.requireLogin, async function (req, res) { project_view(req, res); });

//-------------------------------------------------------------------
// RENDER FORMS
//-------------------------------------------------------------------
router.get('/:portfolio/add', login.requireLogin, async function (req, res) {
	await update_portfolio.renderAddForm(req, res);
});

router.get('/:portfolio/edit/:project_id', login.requireLogin, async function (req, res) {
	await update_portfolio.renderEditForm(req, res);
});
	
router.get('/portfolio-update/:project_id', login.requireLogin, async function (req, res) {
	await update_portfolio.renderEditForm(req, res);
});
router.get('/:portfolio/update/:project_id', login.requireEditor, async function (req, res) {
	update_portfolio.renderEditForm(req, res);
});

router.get('/:portfolio/delete/:project_id', login.requireAdmin, async function (req, res) {
	await delete_portfolio(req, res);
});


//-------------------------------------------------------------------
// ADD/UPDATE PROJECTS - handle form submissions
//-------------------------------------------------------------------
router.post('/process-project-form', login.requireLogin, async function (req, res) { handle_form(req, res); });
router.post('/:portfolio/update', login.requireLogin, async function (req, res) { update_portfolio.updateProject(req, res); });
router.get('/:portfolio/users/search', login.requireLogin, async function (req, res) { update_portfolio.searchUsers(req, res); });
	
//-------------------------------------------------------------------
// DELETE PROJECTS - handle form submissions
//-------------------------------------------------------------------	
router.post('/:portfolio/delete_project_process', login.requireLogin, async function (req, res) { await handle_delete(req, res)});


//-------------------------------------------------------------------
// Export latest projects as a csv
//-------------------------------------------------------------------	

router.get('/:portfolio/download/csv', login.requireAdmin, async function (req, res) {

	var portfolio = req.params.portfolio;
	
	try {
		var result = await queries.portfolio_export(portfolio);
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'latest_projects-' + Date.now() + '.csv\"');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Pragma', 'no-cache');
		var config = result.body.config;
		var projects = result.body.projects

		var columns = _.chain(config.labels)
			.orderBy("grouporder", "fieldorder")
			.map((value) => ({
				key: value.field,
				header: value.label
			}))
			.value();

		stringify(projects, { header: true, columns: columns })
			.pipe(res);

	}
	catch (error) {
		handleError(error);
		res.end();
	}
})




	


//-------------------------------------------------------------------
// Export router
//-------------------------------------------------------------------

module.exports = router;
