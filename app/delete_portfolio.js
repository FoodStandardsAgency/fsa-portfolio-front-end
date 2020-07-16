const queries 	= require('./queries');

function delete_portfolio(req, res) {
	// Get the project_id from URL
	const project_id = req.params.project_id;
	var sess = req.session;
	
	//Pull data from the DB to pre-populate the form
	var text = 'SELECT project_id, project_name from latest_projects where project_id = $1';
	var	values = [project_id];

	//Run the query to prepopulate form (asynch)
	queries.generic_query(text, values)
	.then ((result) => {
		
			res.render('delete_project', {
			"data": result.rows[0],
			"sess": sess
			});
	})
	.catch();
}

module.exports = delete_portfolio;