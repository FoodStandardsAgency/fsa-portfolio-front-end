const queries 	= require('./queries');
const config 	= require('./config');

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

async function project_view(req, res) {
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	try {
		var projectDTO = await queries.load_project(project_id);
		var project = projectDTO.body.project;
		if (project) {
			if (project.documents != null && project.documents != '') { var docs = project.documents.split(","); }
			else { var docs = ''; }

			if (project.link != null && project.link != '') { var links = project.link.split(","); } else { var links = ''; }

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

			/* Project dates */
			if (project.start_date != null && project.start_date != '00/00/0000') {
				var isd = true;
				var isd_month = months[parseInt(project.start_date.slice(3, 5)) - 1];
				var isd_year = project.start_date.slice(6, 10);
			}
			else { var isd_month = ''; var isd_year = ''; }

			if (project.actstart != null && project.actstart != '00/00/0000') {
				var asd = true;
				var asd_day = project.actstart.slice(0, 2);
				var asd_month = months[parseInt(project.actstart.slice(3, 5)) - 1];
				var asd_year = project.actstart.slice(6, 10);
			} else { var asd_month = ''; var asd_year = ''; }

			if (project.expendp != null && project.expendp != '00/00/0000') {
				var eedp = true;
				var eedp_day = project.expendp.slice(0, 2);
				var eedp_month = months[parseInt(project.expendp.slice(3, 5)) - 1];
				var eedp_year = project.expendp.slice(6, 10);
			}
			else { var eed_month = ''; var eed_year = ''; }

			if (project.expend != null && project.expend != '00/00/0000') {
				var eed = true;
				var eed_month = months[parseInt(project.expend.slice(3, 5)) - 1];
				var eed_year = project.expend.slice(6, 10);
			}
			else { var eed_month = ''; var eed_year = ''; }

			if (project.hardend != null && project.hardend != '00/00/0000') {
				var aed = true;
				var aed_day = project.hardend.slice(0, 2);
				var aed_month = months[parseInt(project.hardend.slice(3, 5)) - 1];
				var aed_year = project.hardend.slice(6, 10);
			}
			else { var aed_month = ''; var aed_year = ''; }

			var dates = [isd_month, isd_year, asd_day, asd_month, asd_year, eed_month, eed_year, aed_day, aed_month, aed_year, isd, asd, eed, aed, eedp, eedp_day, eedp_month, eedp_year];

			/*Budget type*/
			if (project.budgettype == 'none' || project.budgettype == undefined) { var budgettype = 'Not set' }
			else if (project.budgettype == 'admin') { var budgettype = 'Admin' }
			else if (project.budgettype == 'progr') { var budgettype = 'Programme' }
			else { var budgettype = 'Capital' }

			var comp_date = project.first_completed;
			if (!comp_date) { comp_date = ''; }
			else { comp_date = String(comp_date.rows[0].min_timestamp); comp_date = comp_date.split(' '); }

			var rels = await queries.load_related(project_id);
			var deps = await queries.load_dependant(project_id);

			var updates = await queries.load_updates(project_id);

			var labels = projectDTO.body.config.labels.reduce(function (map, obj) {
				map[obj.field] = obj.label || obj.fieldtitle;
				return map;
			}, {});

			res.render('project', {
				"user": user,
				"group": group,
				"data": project,
				"labels": labels,
				"docs": docs,
				"phases": config.phases,
				"updates": updates.body,
				"upd_cnt": updates.body.length,
				"rels": rels.body,
				"rels_cnt": rels.body.length,
				"deps": deps.body,
				"deps_cnt": deps.body.length,
				"budgettype": budgettype,
				"budget": currencyFormat(project.budget),
				"spent": currencyFormat(project.spent),
				"dates": dates,
				"comp": comp_date,
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
		e => console.error(e.stack);
	}
}

module.exports = project_view;