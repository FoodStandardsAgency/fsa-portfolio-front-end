const queries 	= require('./queries');

function update_portfolio(req,res) {
	
	// Get the project_id from URL
	const project_id = req.params.project_id;
	var sess = req.session;
	
	// Run the query
	queries.load_project(project_id)
	.then((result) => {
		
		// Display start date as Month Year
		var start_date_day =result.body.start_date.slice(0,2);
		var start_date_month =result.body.start_date.slice(3,5);
		var start_date_year =result.body.start_date.slice(6,10);
		
		var actstart_day =result.body.actstart.slice(0,2);
		var actstart_month =result.body.actstart.slice(3,5);
		var actstart_year =result.body.actstart.slice(6,10);
		
		var expendp_day =result.body.expendp.slice(0,2);
		var expendp_month =result.body.expendp.slice(3,5);
		var expendp_year =result.body.expendp.slice(6,10);
		
		var expend_day =result.body.expend.slice(0,2);
		var expend_month =result.body.expend.slice(3,5);
		var expend_year =result.body.expend.slice(6,10);
		
		var hardend_day =result.body.hardend.slice(0,2);
		var hardend_month =result.body.hardend.slice(3,5);
		var hardend_year =result.body.hardend.slice(6,10);
		
		var dates = [start_date_day, start_date_month, start_date_year, actstart_day, actstart_month, actstart_year, expend_day, expend_month, expend_year, hardend_day, hardend_month, hardend_year, expendp_day, expendp_month, expendp_year ]
		
		// handle documents
		if(result.documents != null &&result.body.documents != ''){var docs =result.body.documents.split(",");}	else {var docs = '';}
		
		// handle link
		if(result.link != null &&result.body.link != ''){var links =result.body.link.split(",");} else {var links = '';}
		
		// dates - to see if there already was an update today
		var today = new Date().toString();
		var udate =result.body.timestamp.toString();
		
		var today = today.substr(0,15);
		var udate = udate.substr(0,15);
		
		var dates_for_updates = [today, udate];
					
			res.render('add_project', {
			"title": "Update existing project",
			"button": "Update project",
			"form_type": "ptupdate",
			"data":result.body,
			"docs": docs,
			"link": links,
			"dates": dates,
			"udates": dates_for_updates,
			"sess":sess
			});
		})
	.catch();
}

module.exports = update_portfolio;