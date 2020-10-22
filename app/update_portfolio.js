const queries = require('./queries');
const _ = require('lodash');


function handleError(error) {
	console.log('***************************');
	console.log(error.message);
	if (error.stack) console.log(error.stack);
	if (error.response) {
		console.log('Response from server:');
		console.log(error.response.url);
		console.log(error.response.body.ExceptionMessage);
		console.log(error.response.body);
	}
	console.log('***************************');
}


async function edit(req, res) {
	try {
		if (req.session.user == 'portfolio') {

			var portfolio = req.params.portfolio;
			var project_id = req.params.project_id;
			var result = await queries.load_project_foredit(project_id);
			var project = result.body.project;
			var config = result.body.config;
			var options = result.body.options;

			var fieldGroups = _.chain(config.labels)
				.orderBy("grouporder", "fieldorder")
				.groupBy("fieldgroup")
				.map((value, key) => ({
					"fieldgroup": key,
					labels: value,
					display: (_.findIndex(value, { included: true }) >= 0)
				}))
				.value();

			//console.log(fieldGroups);

			res.render('add-edit-project', {
				"title": "Edit project",
				"user": req.session.user, // need access-level to determine whether user can add projects
				"project": project,
				"options": options,
				"sess": req.session,
				"portfolio": portfolio,
				"fieldgroups": fieldGroups
			});

		}
		else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}
async function add(req, res) {
	try {
		if (req.session.user == 'portfolio') {

			var portfolio = req.params.portfolio;
			var result = await queries.newproject_config(portfolio);
			var project = result.body.project;
			var config1 = result.body.config;
			var options = result.body.options;

			var fieldGroups = _.chain(config1.labels)
				.orderBy("grouporder", "fieldorder")
				.groupBy("fieldgroup")
				.map((value, key) => ({
					"fieldgroup": key,
					labels: value,
					display: (_.findIndex(value, { included: true }) >= 0)
				}))
				.value();

			//console.log(fieldGroups);

			res.render('add-edit-project', {
				"title": "Add project",
				"user": req.session.user, // need access-level to determine whether user can add projects
				"project": project,
				"options": options,
				"sess": req.session,
				"portfolio": portfolio,
				"fieldgroups": fieldGroups
			});

		}
		else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}


async function update_portfolio_bak(req, res) {

	// Get the project_id from URL
	const project_id = req.params.project_id;
	var sess = req.session;

	// Run the query
	try {

		var result = await queries.load_project(project_id);

		// Display start date as Month Year
		var start_date_day = result.body.start_date.slice(0, 2);
		var start_date_month = result.body.start_date.slice(3, 5);
		var start_date_year = result.body.start_date.slice(6, 10);

		var actstart_day = result.body.actstart.slice(0, 2);
		var actstart_month = result.body.actstart.slice(3, 5);
		var actstart_year = result.body.actstart.slice(6, 10);

		var expendp_day = result.body.expendp.slice(0, 2);
		var expendp_month = result.body.expendp.slice(3, 5);
		var expendp_year = result.body.expendp.slice(6, 10);

		var expend_day = result.body.expend.slice(0, 2);
		var expend_month = result.body.expend.slice(3, 5);
		var expend_year = result.body.expend.slice(6, 10);

		var hardend_day = result.body.hardend.slice(0, 2);
		var hardend_month = result.body.hardend.slice(3, 5);
		var hardend_year = result.body.hardend.slice(6, 10);

		var dates = [start_date_day, start_date_month, start_date_year, actstart_day, actstart_month, actstart_year, expend_day, expend_month, expend_year, hardend_day, hardend_month, hardend_year, expendp_day, expendp_month, expendp_year]

		// handle documents
		if (result.documents != null && result.body.documents != '') { var docs = result.body.documents.split(","); } else { var docs = ''; }

		// handle link
		if (result.link != null && result.body.link != '') { var links = result.body.link.split(","); } else { var links = ''; }

		// dates - to see if there already was an update today
		var today = new Date().toString();
		var udate = result.body.timestamp.toString();

		var today = today.substr(0, 15);
		var udate = udate.substr(0, 15);

		var dates_for_updates = [today, udate];

		res.render('add_project', {
			"title": "Update existing project",
			"button": "Update project",
			"form_type": "ptupdate",
			"data": result.body,
			"docs": docs,
			"link": links,
			"dates": dates,
			"udates": dates_for_updates,
			"sess": sess
		});
	}
	catch (error) {
		console.log(`Login failed: received error from API - ${error.message}`)
		res.end();
    }

}

module.exports = {
	edit: edit,
	add: add
};