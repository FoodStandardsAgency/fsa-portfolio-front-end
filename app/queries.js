const { Pool } = require('pg');
const backend = require('./backend');


// Connection pool
const pool = new Pool()

// Queries
const q = {
	max_id:				'SELECT max(project_id) from latest_projects',
	odd_people: 'select * from odd_people order by g6team, surname',
	
}

// Export promises
module.exports = {
	current_projects: (text, params) => backend.api('Projects/Current'),
	completed_projects: (text, params) => backend.api('Projects/Completed'),
	latest_projects: (text, params) => backend.api('Projects/Latest'),
	max_id:				(text, params) => pool.query(q.max_id),
	oddleads: (text, params) => backend.api('Projects/ODDLeads'),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	new_projects: (text, params) => backend.api('Projects/New'),
}