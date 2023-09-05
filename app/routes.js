var express = require('express');
var { check } 		= require('express-validator');
const _ 				= require('lodash');
const multer			= require('multer');
const formidable		= require('formidable');
const fs				= require('fs'); 
const FormData			= require('form-data');

const jwt 				= require('jsonwebtoken');
const xss				= require('xss');
const stringify			= require('csv-stringify')

// Custom modules
const errors			= require('./error');
const handleError		= errors.handleError;
const config 			= require('./config');
var queries 			= require('./queries');

const update_portfolio 	= require('./update_portfolio');
const delete_portfolio	= require('./delete_portfolio');
const update_odd 		= require('./update_odd');
const handle_form 		= require('./handle_add_update');
const handle_delete		= require('./handle_delete');
const login 			= require('./login');
const filter_view 		= require('./filter_view');
const project_view		= require('./project_view');
const { concat, forEach } = require('lodash');

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

router.get('/log-out', (req, res) => { login.logout(req, res); });


//-------------------------------------------------------------------
// PORTFOLIO LANDING PAGE
//-------------------------------------------------------------------

router.get('/', login.requireLogin, async (req, res) => {
	try {
		var result = await queries.portfolio_index(req);
		var portfolios = result.body;
		res.render('landing', {
			"data": portfolios
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
});


//-------------------------------------------------------------------
// CONFIGURATION
//-------------------------------------------------------------------

router.get('/:portfolio/configure', login.requireAdmin, async (req, res) => {

	try {
		// Need to get current configuration data to pre-populate the form

		var portfolio = req.params.portfolio;
		var result = await queries.portfolio_config(portfolio, req);
		var portfolioconfig = result.body;

		var fieldGroups = config.getFieldGroups(portfolioconfig);

		console.log(fieldGroups);

		res.render('configure', {
			"data": "",
			"portfolio": portfolio,
			"fieldgroups": fieldGroups
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
    }
})

router.post('/:portfolio/configure', login.requireAdmin, async (req, res) => {
	try {
		var portfolio = req.params.portfolio;

		//console.log(req.body);

		await queries.portfolio_config_update(portfolio, req);
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
			if (!handleError(error, res)) res.end();
		}
	}

})
		
	
//-------------------------------------------------------------------
// FILTER VIEW
//-------------------------------------------------------------------

router.get('/:portfolio/filter-view', login.requireLogin, async function (req, res) { await filter_view.view(req, res); });
router.post('/:portfolio/filter-view', login.requireLogin, async function (req,res) { await filter_view.getResults(req,res)});

//-------------------------------------------------------------------
// PROJECT VIEW
//-------------------------------------------------------------------

router.get('/:portfolio/projects/static', login.requireLogin, function(req, res){res.render('project_static.html')});
router.get('/:portfolio/projects/:project_id', login.requireLogin, async function (req, res) {project_view(req, res);});


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
	await update_portfolio.renderEditForm(req, res);
});

router.get('/:portfolio/delete/:project_id', login.requireAdmin, async function (req, res) {
	await delete_portfolio(req, res);
});


//-------------------------------------------------------------------
// ADD/UPDATE PROJECTS - handle form submissions
//-------------------------------------------------------------------
router.post('/process-project-form', login.requireLogin, async function (req, res) { handle_form(req, res); });
router.post('/:portfolio/update', login.requireLogin, async function (req, res) { update_portfolio.updateProject(req, res); });
router.get('/:portfolio/search/users', login.requireLogin, async function (req, res) { update_portfolio.searchUsers(req, res); });
router.get('/:portfolio/search/projects', login.requireLogin, async function (req, res) { update_portfolio.searchProjectId(req, res); });
	
//-------------------------------------------------------------------
// DELETE PROJECTS - handle form submissions
//-------------------------------------------------------------------	
router.post('/:portfolio/delete_project_process', login.requireLogin, async function (req, res) { await handle_delete(req, res) });


//-------------------------------------------------------------------
// Import/Export latest projects as a csv
//-------------------------------------------------------------------	

router.get('/:portfolio/download/csv', login.requireAdmin, async function (req, res) {

	var portfolio = req.params.portfolio;

	try {
		var result = await queries.portfolio_export(portfolio, req);
		res.setHeader('Content-Type', 'text/csv');
		res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'latest_projects-' + Date.now() + '.csv\"');
		res.setHeader('Cache-Control', 'no-cache');
		res.setHeader('Pragma', 'no-cache');
		var config = result.body.config;
		var projects = result.body.projects

		// Set up individual key:value columns for Forecasts
		var values;
		var tempCols = [];
		var forecastColumns = [];
		for (var i = 1; i <= 6; i++) {
			forecastColumns.push({ label: 'Forecast Label '.concat(i), field: 'forecastlabel'.concat(i), fieldgroup: 'budget', fsaonly: 'true' });
			forecastColumns.push({ label: 'Forecast Value '.concat(i), field: 'forecastvalue'.concat(i), fieldgroup: 'budget', fsaonly: 'true' });
		}
		// Remove the existing flat forecast column from the collecton of columns.
		var columnsPartition = _.partition(config.labels, ['field', 'forecasts']);

		// Add the Forecast columns to the collection of columns.
		var columns = _.concat(columnsPartition[1], forecastColumns);

		columns = _.chain(columns)
			.orderBy("grouporder", "fieldorder")
			.map((value) => ({
				key: value.field,
				header: value.label
			}))
			.value();

		// TODO: Tidy up this logic and abstract into a utility function to unroll arbitrary list fields.
		// Unspool the forecasts for a project and break them out into individual keyed fields.
		_.forEach(projects, function (key, value, projects) {
			values = _.split(projects[value]['forecasts'], '|');
			if (values.length > 1) {
				for (var i = 0; i < values.length; i++) {
					tempCols = _.toPath(values[i]);
					label = "forecastlabel".concat(i+1);
					field = "forecastvalue".concat(i+1);
					projects[value][label] = tempCols[0];
					projects[value][field] = tempCols[1];
				}
			}
		});

		stringify(projects, { header: true, columns: columns, bom: true })
			.pipe(res);

	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
})

router.get('/:portfolio/upload/csv', login.requireSuperuser, async function (req, res) {
	try {
		var portfolio = req.params.portfolio;
		res.render('import_projects', {
			portfolio: portfolio
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
})

router.post('/:portfolio/upload/csv', login.requireSuperuser, async function (req, res) {
	var portfolio = req.params.portfolio;
	try {
		var form = formidable({ multiples: false });
		const formFile = new FormData();
		var files = await new Promise(function (resolve, reject) {
			form.parse(req, function (err, fields, files) {
				formFile.append(files.csv_file.name, fs.createReadStream(files.csv_file.path));
				resolve(files);
			});
		});
		await queries.portfolio_upload_csv(portfolio, formFile, req);
		var msg = `Successfully uploaded ${files.csv_file.name}`;
		console.log(msg);
		res.render('import_projects', {
			portfolio: portfolio,
			msg: msg
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
})

//-------------------------------------------------------------------
// Export router
//-------------------------------------------------------------------

module.exports = router;
