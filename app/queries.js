const { Pool } = require('pg');

// Connection pool
const pool = new Pool()

// Queries
const q = {
	current_projects: 	'SELECT * from latest_projects where phase != $1 order by priority_main desc, project_name',
	completed_projects: 'SELECT * from latest_projects where phase = $1 order by timestamp desc',
	max_id:				'SELECT max(project_id) from latest_projects',
	oddleads:			'SELECT distinct oddlead from latest_projects where phase != $1 order by oddlead',

	power_bi_date_flag: 'SELECT * from powerbi_input_date_flag_v',
	power_bi_projects_days: 'SELECT * from powerbi_projects_days_v',
	power_bi_phase: 'SELECT * from powerbi_phase_prev',
	
	unmatched_leads: 'select distinct oddlead, oddlead_email from latest_projects where g6team is null and oddlead != $1 order by oddlead_email',
	odd_people: 'select * from odd_people order by g6team, surname',
	
	latest_projects:	'SELECT timestamp, project_id, project_name, project_size, short_desc, onhold, phase, category, direct, rag, oddlead, oddlead_email, oddlead_role, pgroup, priority_main, funded, confidence, priorities, benefits, criticality, budgettype, budget, spent, documents, link, team, rels, dependencies, start_date, actstart, expendp, expend, hardend, p_comp from latest_projects order by timestamp desc',
	
	new_projects:		'SELECT * from latest_projects where phase != $1 and min_time > now() - (interval \'14 days\')'
}

// Export promises
module.exports = {
	current_projects: 	(text, params) => pool.query(q.current_projects, ['completed']),
	completed_projects: (text, params) => pool.query(q.completed_projects, ['completed']),
	latest_projects: 	(text, params) => pool.query(q.latest_projects),
	max_id:				(text, params) => pool.query(q.max_id),
	oddleads:			(text, params) => pool.query(q.oddleads, ['completed']),
	powerbi_projects_days: (text, params) => pool.query(q.power_bi_projects_days),
	powerbi_date_flag: 	(text, params) => pool.query(q.power_bi_date_flag),
	powerbi_phase: 		(text, params) => pool.query(q.power_bi_phase),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads:	(text, params) => pool.query(q.unmatched_leads, ['']),
	odd_people:			(text, params) => pool.query(q.odd_people),
	new_projects:		(text, params) => pool.query(q.new_projects, ['completed']),
}