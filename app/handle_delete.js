const queries = require('./queries');
const errors = require('./error');
const handleError = errors.handleError;

async function handle_form(req, res) {
	var id = req.body.project_id;
	var portfolio = req.params.portfolio;

	try {
		var response = await queries.delete_project(id);
		if (response.statusCode == 200) {
			console.log(`Deleted project ${id}`);
			res.render('thank_you', {
				"portfolio": portfolio,
				"id": id,
				"message": "deleted",
				"form": "delete"
			});
		}
		else {
			res.render('error_page', { message: `Delete failed for project ${id}. Please contact support quoting the project id and error code ${response.statusCode}.` });
        }
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

module.exports = handle_form;