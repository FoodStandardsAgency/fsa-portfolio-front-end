const queries = require('./queries');
const _ = require('lodash');
const handleError = require('./error');

async function renderEditForm(req, res) {
	try {
		var isAdmin = (req.session.user === 'portfolio');
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

		//console.log(config.labels);

		res.render('add-edit-project', {
			"title": "Edit project",
			"user": req.session.user, // need access-level to determine whether user can add projects
			"isAdmin": isAdmin,
			"project": project,
			"options": options,
			"sess": req.session,
			"portfolio": portfolio,
			"fieldgroups": fieldGroups
		});
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

async function renderAddForm(req, res) {
	try {
		if (req.session.user == 'portfolio') {

			var isAdmin = (req.session.user === 'portfolio');
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

async function updateProject(req, res) {
	try {
		var portfolio = req.params.portfolio;
		console.log(req.body);
		await queries.project_update(req.body);
		res.redirect(`/${portfolio}/Projects/${req.body.project_id}`);
		res.end();
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

async function searchUsers(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var term = req.query.q;
		var addnone = req.query.addnone;

		console.log(req.query);
		var response = await queries.users_search(portfolio, term, addnone);

		var result = response.body.searchresults.map(function (u) { return { value: u.userPrincipalName, text: u.displayName }; });

		var json = JSON.stringify(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(json);
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

module.exports = {
	renderEditForm: renderEditForm,
	renderAddForm: renderAddForm,
	updateProject: updateProject,
	searchUsers: searchUsers
};