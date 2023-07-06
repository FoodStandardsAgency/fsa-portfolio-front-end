const queries 	= require('./queries');

function update_odd(req, res) {
	// Get the project_id from URL
	const project_id = req.params.project_id;
	
	//Pull data from the DB to pre-populate the form
	var text = 'SELECT project_id, project_name, start_date, short_desc, phase, category, subcat, rag, update, oddlead, oddlead_email, servicelead, servicelead_email, priority_main, funded, confidence, priorities, benefits, criticality, budget, spent, documents, link, forecasts, amount, rels, team, onhold, expend, hardend, actstart, dependencies, timestamp, project_size, oddlead_role, budgettype, direct, expendp, p_comp from latest_projects where project_id = $1';
	var	values = [project_id];

	//Run the query to prepopulate form (asynch)
	queries.generic_query(text, values)
	.then ((result) => {
		
		// Display dates
		var start_date_day = result.rows[0].start_date.slice(0,2);
		var start_date_month = result.rows[0].start_date.slice(3,5);
		var start_date_year = result.rows[0].start_date.slice(6,10);
		
		var actstart_day = result.rows[0].actstart.slice(0,2);
		var actstart_month = result.rows[0].actstart.slice(3,5);
		var actstart_year = result.rows[0].actstart.slice(6,10);
		
		var expendp_day = result.rows[0].expendp.slice(0,2);
		var expendp_month = result.rows[0].expendp.slice(3,5);
		var expendp_year = result.rows[0].expendp.slice(6,10);
		
		var expend_day = result.rows[0].expend.slice(0,2);
		var expend_month = result.rows[0].expend.slice(3,5);
		var expend_year = result.rows[0].expend.slice(6,10);
		
		var hardend_day = result.rows[0].hardend.slice(0,2);
		var hardend_month = result.rows[0].hardend.slice(3,5);
		var hardend_year = result.rows[0].hardend.slice(6,10);
		
		var dates = [start_date_day, start_date_month, start_date_year, actstart_day, actstart_month, actstart_year, expend_day, expend_month, expend_year, hardend_day, hardend_month, hardend_year, expendp_day, expendp_month, expendp_year ]
				
		// Unpick documents and links
		if(result.rows[0].documents != null && result.rows[0].documents != ''){var docs = result.rows[0].documents.split(",");}	else {var docs = '';}
		
		// handle link
		if(result.rows[0].link != null && result.rows[0].link != ''){var links = result.rows[0].link.split(",");} else {var links = '';}

		// Unpick forecasts and values
		if (result.rows[0].forecasts != null && result.rows[0].forecasts != '') { var forecasts = result.rows[0].forecasts.split(","); } else { var forecasts = ''; }

		// handle forecast value
		if (result.rows[0].amount != null && result.rows[0].amount != '') { var amounts = result.rows[0].amount.split(","); } else { var amounts = ''; }

		// dates - to see if there already was an update today
		var today = new Date().toString();
		var udate = result.rows[0].timestamp.toString();
		
		var today = today.substr(0,15);
		var udate = udate.substr(0,15);
		
		var dates_for_updates = [today, udate];
		
			res.render('update_project', {
			"data": result.rows[0],
			"docs": docs,
			"dates": dates,
			"link": links,
			"udates": dates_for_updates
			});
	})
	.catch();
}

module.exports = update_odd;