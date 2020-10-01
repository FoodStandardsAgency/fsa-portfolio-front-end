const queries 	= require('./queries');

function handle_form(req, res) {
	var id = req.body.project_id;
	
	var text = 'delete from projects where project_id = $1';
	var values = [id];
	
	queries.generic_query(text, values)
	.then( (result) => {
		console.log('deleted project')
		console.log(id)
	})
	.catch();

	res.render('thank_you', {
	"id": id,
	"message": "deleted",
	"form": "delete"
	});
	
}

module.exports = handle_form;