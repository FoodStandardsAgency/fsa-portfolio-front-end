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
	current_projects: (portfolio) => backend.api(`Projects?portfolio=${portfolio}&filter=current`),
	completed_projects: (text, params) => backend.api(`Projects?portfolio=${portfolio}&filter=complete`),
	latest_projects: (text, params) => backend.api(`Projects?portfolio=${portfolio}&filter=latest`),
	max_id: (portfolio) => backend.api(`PortfolioConfiguration/MaxId?portfolio=${portfolio}`),
	oddleads: (text, params) => backend.api('Projects/Legacy/ODDLeads'),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/Legacy/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	new_projects: (text, params) => backend.api(`Projects?portfolio=${portfolio}&filter=new`),
	load_project: (projectId) => backend.api(`Projects/${projectId}`),
	load_updates: (projectId) => backend.api(`Projects/${projectId}/updates`),
	load_related: (projectId) => backend.api(`Projects/${projectId}/related`),
	load_dependant: (projectId) => backend.api(`Projects/${projectId}/dependant`),
	update_label: (portfolio, field, label, included) => backend.api.post('PortfolioConfiguration/Label', { json: { portfolio: portfolio, field: field, label: label, included: included } }),
	portfolio_config: (portfolio) => backend.api(`PortfolioConfiguration?portfolio=${portfolio}`)

}