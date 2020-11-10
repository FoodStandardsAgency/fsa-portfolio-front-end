const queries 	= require('./queries');
const config = require('./config');
const handleError = require('./error');

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

async function project_view(req, res) {
	var portfolio = req.params.portfolio;
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	try {
		var projectDTO = await queries.load_project(project_id, { includeConfig: true, includeHistory: true });
		var project = projectDTO.body.project;
		if (project) {
			//console.log(project);

			if (project.link != null && project.link.link != '') { var links = project.link.link.split(","); } else { var links = ''; }


			if (project.budget != null && project.budget != '') { var budget = project.budget.split(","); }
			else { var budget = 0; }

			if (project.spent != null && project.spent != '') { var spent = project.spent.split(","); }
			else { var spent = 0; }

			/*Budget type*/
			if (project.budgettype == 'none' || project.budgettype == undefined) { var budgettype = 'Not set' }
			else if (project.budgettype == 'admin') { var budgettype = 'Admin' }
			else if (project.budgettype == 'progr') { var budgettype = 'Programme' }
			else { var budgettype = 'Capital' }


			var labels = projectDTO.body.config.labels.reduce(function (map, obj) {
				map[obj.field] = obj.label || obj.fieldtitle;
				return map;
			}, {});

			res.render('project', {
				"portfolio": portfolio,
				"user": user,
				"group": group,
				"data": project,
				"labels": labels,
				"phases": config.phases,
				"budgettype": budgettype,
				"budget": currencyFormat(project.budget),
				"spent": currencyFormat(project.spent),
				"link": links,
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