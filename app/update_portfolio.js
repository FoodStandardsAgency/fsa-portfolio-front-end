const queries = require('./queries');
const _ = require('lodash');
const errors = require('./error');
const handleError = errors.handleError;
const login = require('./login');

async function renderEditForm(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var project_id = req.params.project_id;
		var result = await queries.load_project_foredit(project_id, req);
		var project = result.body.project;
		var config = result.body.config;
		var options = result.body.options;

		options.rels = { ajaxurl: `/${portfolio}/search/projectid` };
		options.dependencies = { ajaxurl: `/${portfolio}/search/projectid` };

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
			"project": project,
			"options": options,
			"portfolio": portfolio,
			"fieldgroups": fieldGroups
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function renderAddForm(req, res) {
	try {
		var isAdmin = login.hasRole(req, 'admin') || login.hasRole(req, 'superuser');
		if (isAdmin) {
			var portfolio = req.params.portfolio;
			var result = await queries.newproject_config(portfolio, req);
			var project = result.body.project;
			var config1 = result.body.config;
			var options = result.body.options;

			options.rels = { ajaxurl: `/${portfolio}/search/projectid` };
			options.dependencies = { ajaxurl: `/${portfolio}/search/projectid` };

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
				"project": project,
				"options": options,
				"portfolio": portfolio,
				"fieldgroups": fieldGroups
			});

		}
		else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function updateProject(req, res) {
	try {
		var portfolio = req.params.portfolio;
		//console.log(req.body);
		await queries.project_update(req);
		res.redirect(`/${portfolio}/Projects/${req.body.project_id}`);
		res.end();
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function searchUsers(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var term = req.query.q;
		var addnone = req.query.addnone;

		var response = await queries.users_search(portfolio, term, addnone, req);

		var result = response.body.searchresults.map(function (u) { return { value: u.userPrincipalName, text: u.displayName }; });

		var json = JSON.stringify(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(json);
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

async function searchProjectId(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var term = req.query.q;
		var addnone = req.query.addnone;

		var response = await queries.search_projectid(portfolio, term, addnone, req);

		var result = response.body;

		var json = JSON.stringify(result);
		res.setHeader('Content-Type', 'application/json');
		res.end(json);
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
	}
}

module.exports = {
	renderEditForm: renderEditForm,
	renderAddForm: renderAddForm,
	updateProject: updateProject,
	searchUsers: searchUsers,
	searchProjectId: searchProjectId
};