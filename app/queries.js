const { Pool } = require('pg');
const backend = require('./backend');


// Connection pool
const pool = new Pool()

// Queries
const q = {
	max_id:				'SELECT max(project_id) from latest_projects',

	power_bi_date_flag: 'SELECT * from powerbi_input_date_flag_v',
	power_bi_projects_days: 'SELECT * from powerbi_projects_days_v',
	power_bi_phase: 'SELECT * from powerbi_phase_prev',
	
	odd_people: 'select * from odd_people order by g6team, surname',
	
}

// Export promises
module.exports = {
	current_projects: (portfolio) => backend.api(`Projects/Current/${portfolio}`),
	completed_projects: (text, params) => backend.api('Projects/Completed'),
	latest_projects: (text, params) => backend.api('Projects/Latest'),
	max_id:				(text, params) => pool.query(q.max_id),
	oddleads: (text, params) => backend.api('Projects/ODDLeads'),
	powerbi_projects_days: (text, params) => pool.query(q.power_bi_projects_days),
	powerbi_date_flag: 	(text, params) => pool.query(q.power_bi_date_flag),
	powerbi_phase: 		(text, params) => pool.query(q.power_bi_phase),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	new_projects: (text, params) => backend.api('Projects/New'),
}