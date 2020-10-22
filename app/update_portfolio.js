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
			var result = await queries.load_project_foredit(project_id, { includeConfig: true });
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

module.exports = {
	edit: edit,
	add: add
};