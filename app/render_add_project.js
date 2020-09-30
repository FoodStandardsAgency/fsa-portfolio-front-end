const queries 	= require('./queries');

function add_project(req,res) {
var sess = req.session;
// Find next available projet id
	queries.max_id()
	.then((result) => {
		var id = result.rows[0].max || 'ODD0000000';
		var dt = new Date();
		
		// Data from the id
		var year 	= id.slice(3,5);
		var month 	= id.slice(5,7);
		var cnt 	= id.slice(7,10);
		
		//Current year
		var year_dt = new Date().getFullYear() - 2000;
		var month_dt= new Date().getMonth() + 1;

		// Work out the ID
		if (parseInt(year) == parseInt(year_dt)){
			
			// Same year & month
			if(parseInt(month) == parseInt(month_dt)){
				// Increment counter
				var cnt_inc = parseInt(cnt) + 1;
				var cnt_inc = cnt_inc.toString();
										
				// Add leading zeros as needed
				if(cnt_inc.length == 1) {var cnt_next = '00'.concat(cnt_inc);}
				else if (cnt_inc.length == 2) {var cnt_next = '0'.concat(cnt_inc);}
				else {var cnt_next = cnt_inc;}
								
				// Build id
				var id_next = 'ODD'.concat(year,month,cnt_next);
			}
			
			// Same year, different month
			else { 
				var month_dt = month_dt.toString();
				
				if(month_dt.length == 1) 	{var id_next = 'ODD'.concat(year_dt,'0',month_dt,'001');}
				else 						{var id_next = 'ODD'.concat(year_dt,month_dt,'001');}
			
			}
		}
			// Different year, different month
		else {
				var month_dt = month_dt.toString();
										
				if(month_dt.length == 1) 	{var id_next = 'ODD'.concat(year_dt,'0',month_dt,'001');}
				else 						{var id_next = 'ODD'.concat(year_dt,month_dt,'001');}
			
				
		}

		res.render('add_project', {
		"next_id": id_next,
		"title":"Add new project",
		"button": "Add project",
		"form_type": "ptadd",
		"sess":sess
		});
	});

}

module.exports = add_project;