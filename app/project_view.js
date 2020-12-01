const queries 	= require('./queries');
const config = require('./config');
const errors = require('./error');
const handleError = errors.handleError;

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

async function project_view(req, res) {
	var portfolio = req.params.portfolio;
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	try {
		var projectDTO = await queries.load_project(project_id, { includeConfig: true, includeHistory: true }, req);
		var project = projectDTO.body.project;
		if (project) {

			/*Budget type*/
			if (project.budgettype == undefined) { var budgettype = 'Not set' }

			var labels = projectDTO.body.config.labels.reduce(function (map, obj) {
				map[obj.field] = obj.label || obj.fieldtitle;
				return map;
			}, {});
			
			console.log(project);

			// TODO: test suppliers can't access budget (key has changed from number 4 to 'supplier')
			res.render('project_new', {
				"portfolio": portfolio,
				"user": user,
				"group": group,
				"data": project,
				"labels": labels,
				"phases": config.phases,
				"budgettype": budgettype,
				"budget": currencyFormat(project.budget),
				"spent": currencyFormat(project.spent),
				"sess": sess
			});
		} 

		// Show homepage
		else {
			console.log(`API didn't return a project for project_id=${project_id}`)
			res.redirect('/');
			res.end();
		}
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

module.exports = project_view;