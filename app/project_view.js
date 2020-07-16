const queries 	= require('./queries');
const config 	= require('./config');

function currencyFormat(num) { return '£' + num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}

function project_view(req, res) {
	var sess = req.session;
	var user = req.session.user;
	var group = req.session.group;
	var project_id = req.params.project_id;
	
	var selected_project = 'SELECT * from latest_projects where project_id = $1';
	var project_updates = 'SELECT * from updates where project_id = $1 and update != $2 order by timestamp desc';
	
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	
	queries.generic_query(selected_project, [project_id])
	.then((project) => {
		
		if(project.rowCount == 1) {
		
		if(project.rows[0].documents != null && project.rows[0].documents != ''){var docs = project.rows[0].documents.split(",");}	
		else {var docs = '';}
		
		if(project.rows[0].link != null && project.rows[0].link != ''){var links = project.rows[0].link.split(",");} else {var links = '';}
			
		if(project.rows[0].rels != '' && project.rows[0].rels != undefined){
			var rels = project.rows[0].rels
			var rels = rels.replace(/[^A-Za-z0-9,]/g,'');
			var rels = rels.split(',').join('\',\'');
			var rels = '\''.concat(rels);
			var rels = rels.concat('\'');
		} 
		else {var rels = '';}
		
		if(project.rows[0].dependencies != '' && project.rows[0].dependencies != undefined){
			var deps = project.rows[0].dependencies
			var deps = deps.replace(/[^A-Za-z0-9,]/g,'');
			var deps = deps.split(',').join('\',\'');
			var deps = '\''.concat(deps);
			var deps = deps.concat('\'');
		} 
		else {var deps = '';}
				
		if(project.rows[0].budget 	 != null && project.rows[0].budget 	  != ''){var budget = project.rows[0].budget.split(","); }	
		else {var budget = 0;}
		
		if(project.rows[0].spent 	 != null && project.rows[0].spent 	  != ''){var spent = project.rows[0].spent.split(","); }	
		else {var spent = 0;}
		
		/* Project dates */
		if(project.rows[0].start_date != null && project.rows[0].start_date != '00/00/0000'){
			var isd = true;
			var isd_month = months[parseInt(project.rows[0].start_date.slice(3,5))-1]; 
			var isd_year = project.rows[0].start_date.slice(6,10);} 
		else {var isd_month = ''; var isd_year = '';}
		
		if(project.rows[0].actstart != null && project.rows[0].actstart != '00/00/0000'){
			var asd = true;
			var asd_day = project.rows[0].actstart.slice(0,2);
			var asd_month = months[parseInt(project.rows[0].actstart.slice(3,5))-1];   
			var asd_year = project.rows[0].actstart.slice(6,10);
		} else   {var asd_month = ''; var asd_year = '';}
		
		if(project.rows[0].expendp != null && project.rows[0].expendp != '00/00/0000'){
			var eedp = true;
			var eedp_day = project.rows[0].expendp.slice(0,2);
			var eedp_month = months[parseInt(project.rows[0].expendp.slice(3,5))-1]; 	   
			var eedp_year = project.rows[0].expendp.slice(6,10);} 	
		else   {var eed_month = ''; var eed_year = '';}
		
		if(project.rows[0].expend != null && project.rows[0].expend != '00/00/0000'){
			var eed = true;
			var eed_month = months[parseInt(project.rows[0].expend.slice(3,5))-1]; 	   
			var eed_year = project.rows[0].expend.slice(6,10);} 	
		else   {var eed_month = ''; var eed_year = '';}
		
		if(project.rows[0].hardend != null && project.rows[0].hardend != '00/00/0000'){
			var aed = true;
			var aed_day = project.rows[0].hardend.slice(0,2);	
			var aed_month = months[parseInt(project.rows[0].hardend.slice(3,5))-1];    
			var aed_year = project.rows[0].hardend.slice(6,10);} 	
		else   {var aed_month = ''; var aed_year = '';}
		
		var dates = [isd_month, isd_year, asd_day, asd_month, asd_year, eed_month, eed_year, aed_day, aed_month, aed_year, isd, asd, eed, aed, eedp, eedp_day, eedp_month, eedp_year];
		
		/*Budget type*/
		if(project.rows[0].budgettype == 'none' || project.rows[0].budgettype == undefined){var budgettype = 'Not set'}
		else if(project.rows[0].budgettype == 'admin' ){var budgettype = 'Admin'}
		else if(project.rows[0].budgettype == 'progr' ){var budgettype = 'Programme'}
		else {var budgettype = 'Capital'}
			
		queries.generic_query('select min_timestamp from completed_time where project_id = $1', [project_id])
		.then((comp_date)=>{
			
			if(comp_date.rowCount != '1'){comp_date = '';} 
			else {comp_date = String(comp_date.rows[0].min_timestamp); comp_date = comp_date.split(' ');}
			
			if(rels != ''){	var rels_query = 'select project_id, project_name from latest_projects where project_id in ('.concat(rels,')');}
			else {var rels_query = 'select project_id, project_name from latest_projects where project_id = \'test\'';}
			
			if(deps != ''){	var deps_query = 'select project_id, project_name from latest_projects where project_id in ('.concat(deps,')');}
			else {var deps_query = 'select project_id, project_name from latest_projects where project_id = \'test\'';}
			
			//console.log(rels_query);
			queries.generic_query(rels_query)
			.then((rels) =>{
				
				queries.generic_query(deps_query)
				.then((deps) =>{

					queries.generic_query(project_updates, [project_id, ''])
					.then((updates) => {
						
						//console.log(updates);
					
						res.render('project', {
							"user": user,
							"group": group,
							"data": project.rows[0],
							"docs": docs,
							"phases": config.phases,
							"updates": updates.rows,
							"upd_cnt": updates.rowCount,
							"rels": rels.rows,
							"rels_cnt": rels.rowCount,
							"deps": deps.rows,
							"deps_cnt": deps.rowCount,
							"budgettype": budgettype,
							"budget": currencyFormat(project.rows[0].budget),
							"spent": currencyFormat(project.rows[0].spent),
							"dates": dates,
							"comp": comp_date,
							"link": links,
							"sess": sess
						});
					});
				});
			}).catch(e => console.error(e.stack))
		})
		.catch(e => console.error(e.stack));
		
		} // if project.rowCount == 1
		
		// Show homepage
		else {
			res.redirect('/');
			res.end();
		}
	})
	.catch(e => console.error(e.stack));
}

module.exports = project_view;