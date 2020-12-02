const queries 	= require('./queries');

async function delete_portfolio(req, res) {
	var portfolio = req.params.portfolio;
	var project_id = req.params.project_id;

	try {
		var projectDTO = await queries.load_project(project_id, { includeConfig: true }, req);
		var project = projectDTO.body.project;
		if (project) {

			/*Budget type*/
			if (project.budgettype == undefined) { var budgettype = 'Not set' }

			var labels = projectDTO.body.config.labels.reduce(function (map, obj) {
				map[obj.field] = obj.label || obj.fieldtitle;
				return map;
			}, {});
			res.render('delete_project', {
				"portfolio": portfolio,
				"data": project,
				"labels": labels
			});

		} 


	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

module.exports = delete_portfolio;