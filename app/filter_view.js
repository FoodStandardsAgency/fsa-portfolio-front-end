const queries 	= require('./queries');
const moment	= require('moment');

function filter_view (req, res){
	
	// Get values from the form
	var project_name 	= req.body.project_name
	var onhold 			= req.body.onhold
	var phase 			= req.body.phase
	var rag 			= req.body.rag
	var pgroup 			= req.body.pgroup
	var category 		= req.body.category
	var g6team 			= req.body.g6team
	var oddlead 		= req.body.oddlead
	var team 			= req.body.team
	var update_date		= req.body.update_date
	var no_updates		= req.body.no_updates
	var past_start		= req.body.past_start
	var missed_dead		= req.body.missed_dead
	var direct			= req.body.direct
	
	if(update_date == undefined) 	{update_date = '';}
	if(no_updates == undefined) 	{no_updates = 'none';}
    if(g6team == undefined) 		{g6team = 'odd';}
	
	var form_values = [project_name, phase, rag, pgroup, category, g6team, oddlead, team, onhold, update_date, no_updates, past_start, missed_dead, direct]
 
	// Build query 
	var text = 'SELECT project_id, project_name, priority_main from latest_project_with_update_date where ';
	var values = [];
	var i = 0;
	
	if(update_date != '') 	{var upt_dt 	= moment(update_date, "YYYY/MM/DD");}
		
	if(project_name != '') 	{ 
		var project_name1 = '% '.concat(project_name, ' %');
		var project_name2 = '% '.concat(project_name, ''); 
		var project_name3 = ''.concat(project_name, ' %'); 
		var project_name4 = ''.concat(project_name, ''); 		
		var i = i+4; 
		var text = text.concat('(project_name ILIKE $1 or project_name ILIKE $2 or project_name ILIKE $3 or project_name ILIKE $4 or project_id ILIKE $4) and  '); 
		values.push(project_name1, project_name2, project_name3, project_name4);
	}
	if(phase != 'none' && phase != 'nback' && phase != 'dab')  	{ var i = i+1; var text = text.concat('phase = $',i,' and  '); values.push(phase);}
	if(phase == 'nback')  	{ var text = text.concat('phase != \'backlog\' and  ');}
	if(phase == 'dab')  	{ var text = text.concat('phase in (\'discovery\', \'alpha\', \'beta\') and  ');}
	if(rag != 'none')  		{ var i = i+1; var text = text.concat('rag = $',i,' and  '); values.push(rag);}
	if(pgroup != 'none')  	{ var i = i+1; var text = text.concat('pgroup = $',i,' and  '); values.push(pgroup);}
	if(category != 'none')  { var i = i+1; var text = text.concat('category = $',i,' and  '); values.push(category);}
	if(g6team != 'none' & g6team != 'odd' & g6team != 'null')  	{ var i = i+1; var text = text.concat('g6team = $',i,' and  ');values.push(g6team);}
	if(g6team == 'null' )  	{ var text = text.concat('g6team is null and  ');}
	if(oddlead != '')  		{ var oddlead = '%'.concat(oddlead, '%'); var i = i+1; var text = text.concat('oddlead ILIKE $',i,' and  '); values.push(oddlead);}
	if(team != '')  		{ var team = '%'.concat(team, '%'); var i = i+1; var text = text.concat('(team ILIKE $',i,' or oddlead ILIKE $',i,')  and  '); values.push(team);}
	if(onhold != 'none')  	{ var i = i+1; var text = text.concat('onhold = $',i,' and  '); values.push(onhold);}
	if(update_date != '')	{ var i = i+2; var text = text.concat('(latest_update < $',i-1,' and latest_update is not null ) and update != $',i,' and  '); values.push(upt_dt); values.push('')}
	if(no_updates == 'y')  { 
	
		if(update_date != ''){
			var text = text.substring(0, text.length - 6);
			var i = i+1; var text = text.concat(' or (latest_update is null or update = $',i,') and  '); values.push('');
		}
		else {
			var i = i+1; var text = text.concat('(latest_update is null or update = $',i,') and  '); values.push('');
			}
	}
	if(past_start != 'none')  {var text = text.concat('phase = \'backlog\' and now() > to_date(start_date, \'DD/MM/YYYY\') and start_date != \'00/00/0000\' and  ');}
	if(missed_dead != 'none') {var text = text.concat('phase not in(\'live\',\'completed\') and ( (now() > to_date(expend, \'DD/MM/YYYY\') and expend != \'00/00/0000\') or (now() > to_date(hardend, \'DD/MM/YYYY\') and hardend != \'00/00/0000\') ) and  ');}
	if(direct != 'NONE')  	  {var i = i+1; var text = text.concat('direct = $',i,' and  '); values.push(direct);}

	var text = text.substring(0, text.length - 6);
	
	if(update_date != ''){var text = text.concat(' order by latest_update ASC, priority_main desc, project_name');}
	else {{var text = text.concat(' order by priority_main desc, project_name');}}
	
	console.log(text);
	console.log(values);

	queries.generic_query(text,values)
	.then((result) => 
		res.render('filter_view',{
			"stage": 'results',
			"data": result.rows,
			"project_cnt": result.rowCount,
			"form_values": form_values,
			"sess": req.session
		})
	)
	.catch(e => console.error(e.stack));
};

module.exports = filter_view;