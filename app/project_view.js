const queries 	= require('./queries');
const config 	= require('./config');

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

async function project_view(req, res) {
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	var selected_project = 'SELECT * from latest_projects where project_id = $1';
	var project_updates = 'SELECT * from updates where project_id = $1 and update != $2 order by timestamp desc';
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

	try {
		var project = await queries.load_project(project_id);
		if (project.body) {

			if (project.body.documents != null && project.body.documents != '') { var docs = project.body.documents.split(","); }
			else { var docs = ''; }

			if (project.body.link != null && project.body.link != '') { var links = project.body.link.split(","); } else { var links = ''; }

			if (project.body.rels != '' && project.body.rels != undefined) {
				var rels = project.body.rels
				var rels = rels.replace(/[^A-Za-z0-9,]/g, '');
				var rels = rels.split(',').join('\',\'');
				var rels = '\''.concat(rels);
				var rels = rels.concat('\'');
			}
			else { var rels = ''; }

			if (project.body.dependencies != '' && project.body.dependencies != undefined) {
				var deps = project.body.dependencies
				var deps = deps.replace(/[^A-Za-z0-9,]/g, '');
				var deps = deps.split(',').join('\',\'');
				var deps = '\''.concat(deps);
				var deps = deps.concat('\'');
			}
			else { var deps = ''; }

			if (project.body.budget != null && project.body.budget != '') { var budget = project.body.budget.split(","); }
			else { var budget = 0; }

			if (project.body.spent != null && project.body.spent != '') { var spent = project.body.spent.split(","); }
			else { var spent = 0; }

			/* Project dates */
			if (project.body.start_date != null && project.body.start_date != '00/00/0000') {
				var isd = true;
				var isd_month = months[parseInt(project.body.start_date.slice(3, 5)) - 1];
				var isd_year = project.body.start_date.slice(6, 10);
			}
			else { var isd_month = ''; var isd_year = ''; }

			if (project.body.actstart != null && project.body.actstart != '00/00/0000') {
				var asd = true;
				var asd_day = project.body.actstart.slice(0, 2);
				var asd_month = months[parseInt(project.body.actstart.slice(3, 5)) - 1];
				var asd_year = project.body.actstart.slice(6, 10);
			} else { var asd_month = ''; var asd_year = ''; }

			if (project.body.expendp != null && project.body.expendp != '00/00/0000') {
				var eedp = true;
				var eedp_day = project.body.expendp.slice(0, 2);
				var eedp_month = months[parseInt(project.body.expendp.slice(3, 5)) - 1];
				var eedp_year = project.body.expendp.slice(6, 10);
			}
			else { var eed_month = ''; var eed_year = ''; }

			if (project.body.expend != null && project.body.expend != '00/00/0000') {
				var eed = true;
				var eed_month = months[parseInt(project.body.expend.slice(3, 5)) - 1];
				var eed_year = project.body.expend.slice(6, 10);
			}
			else { var eed_month = ''; var eed_year = ''; }

			if (project.body.hardend != null && project.body.hardend != '00/00/0000') {
				var aed = true;
				var aed_day = project.body.hardend.slice(0, 2);
				var aed_month = months[parseInt(project.body.hardend.slice(3, 5)) - 1];
				var aed_year = project.body.hardend.slice(6, 10);
			}
			else { var aed_month = ''; var aed_year = ''; }

			var dates = [isd_month, isd_year, asd_day, asd_month, asd_year, eed_month, eed_year, aed_day, aed_month, aed_year, isd, asd, eed, aed, eedp, eedp_day, eedp_month, eedp_year];

			/*Budget type*/
			if (project.body.budgettype == 'none' || project.body.budgettype == undefined) { var budgettype = 'Not set' }
			else if (project.body.budgettype == 'admin') { var budgettype = 'Admin' }
			else if (project.body.budgettype == 'progr') { var budgettype = 'Programme' }
			else { var budgettype = 'Capital' }

			var comp_date = project.body.first_completed;
			if (!comp_date) { comp_date = ''; }
			else { comp_date = String(comp_date.rows[0].min_timestamp); comp_date = comp_date.split(' '); }

			var rels = await queries.load_related(project_id);
			var deps = await queries.load_dependant(project_id);

			var updates = await queries.load_updates(project_id);


			res.render('project', {
				"user": user,
				"group": group,
				"data": project.body,
				"docs": docs,
				"phases": config.phases,
				"updates": updates.rows,
				"upd_cnt": updates.rowCount,
				"rels": rels.body,
				"rels_cnt": rels.body.length,
				"deps": deps.body,
				"deps_cnt": deps.body.length,
				"budgettype": budgettype,
				"budget": currencyFormat(project.body.budget),
				"spent": currencyFormat(project.body.spent),
				"dates": dates,
				"comp": comp_date,
				"link": links,
				"sess": sess
			});
		} 

		// Show homepage
		else {
			res.redirect('/');
			res.end();
		}
	}
	catch (e) {
		e => console.error(e.stack);
	}
}

module.exports = project_view;