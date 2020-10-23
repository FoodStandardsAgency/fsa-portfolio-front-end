const queries 	= require('./queries');
const config 	= require('./config');

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

async function project_view(req, res) {
	var portfolio = req.params.portfolio;
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	try {
		var projectDTO = await queries.load_project(project_id, { includeConfig: true, includeHistory: true });
		var project = projectDTO.body.project;
		if (project) {
			//console.log(project);
			if (project.documents != null && project.documents != '') { var docs = project.documents.split(","); }
			else { var docs = ''; }

			if (project.link != null && project.link.link != '') { var links = project.link.link.split(","); } else { var links = ''; }

			if (project.rels != '' && project.rels != undefined) {
				var rels = project.rels
				var rels = rels.replace(/[^A-Za-z0-9,]/g, '');
				var rels = rels.split(',').join('\',\'');
				var rels = '\''.concat(rels);
				var rels = rels.concat('\'');
			}
			else { var rels = ''; }

			if (project.dependencies != '' && project.dependencies != undefined) {
				var deps = project.dependencies
				var deps = deps.replace(/[^A-Za-z0-9,]/g, '');
				var deps = deps.split(',').join('\',\'');
				var deps = '\''.concat(deps);
				var deps = deps.concat('\'');
			}
			else { var deps = ''; }

			if (project.budget != null && project.budget != '') { var budget = project.budget.split(","); }
			else { var budget = 0; }

			if (project.spent != null && project.spent != '') { var spent = project.spent.split(","); }
			else { var spent = 0; }

			/*Budget type*/
			if (project.budgettype == 'none' || project.budgettype == undefined) { var budgettype = 'Not set' }
			else if (project.budgettype == 'admin') { var budgettype = 'Admin' }
			else if (project.budgettype == 'progr') { var budgettype = 'Programme' }
			else { var budgettype = 'Capital' }

			var rels = await queries.load_related(project_id);
			var deps = await queries.load_dependant(project_id);

			var labels = projectDTO.body.config.labels.reduce(function (map, obj) {
				map[obj.field] = obj.label || obj.fieldtitle;
				return map;
			}, {});

			//console.log(labels);


			res.render('project', {
				"portfolio": portfolio,
				"user": user,
				"group": group,
				"data": project,
				"labels": labels,
				"docs": docs,
				"phases": config.phases,
				"rels": rels.body,
				"rels_cnt": rels.body.length,
				"deps": deps.body,
				"deps_cnt": deps.body.length,
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
	catch (e) {
		if(e.message) console.log(e.message);
		if(e.stack) console.log(e.stack);
	}
}

module.exports = project_view;