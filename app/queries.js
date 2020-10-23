const { Pool } = require('pg');
const backend = require('./backend');


// Connection pool
const pool = new Pool()

// Queries
const q = {
	max_id:				'SELECT max(project_id) from latest_projects',
	odd_people: 'select * from odd_people order by g6team, surname',

	portfolio_projects_url: (portfolio, filter) => `Projects?portfolio=${portfolio}&filter=${filter}`,
	portfolio_config_url: (portfolio) => `PortfolioConfiguration/${portfolio}`,
	newproject_config_url: (portfolio) => `Projects/${portfolio}/newproject`,
	project_url: (projectId) => `Projects/${projectId}`,
	project_edit_url: (projectId) => `Projects/${projectId}?includeOptions=true`,
	project_update_url: `Projects`
	
}

// Export promises
module.exports = {
	// Actions
	portfolio_index: () => backend.api('Portfolios'),
	portfolio_summary: (portfolio) => backend.api(`Portfolios/${portfolio}/summary`),
	current_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'current')),
	completed_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'complete')),
	latest_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'latest')),
	new_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'new')),
	load_project: (projectId, searchParams) => backend.api(q.project_url(projectId), { searchParams: searchParams }),
	load_project_foredit: (projectId, searchParams) => backend.api(q.project_edit_url(projectId), { searchParams: searchParams }),
	load_updates: (projectId) => backend.api(`${q.project_url(projectId)}/updates`),
	load_related: (projectId) => backend.api(`${q.project_url(projectId)}/related`),
	load_dependant: (projectId) => backend.api(`${q.project_url(projectId)}/dependant`),
	max_id: (portfolio) => backend.api(`PortfolioConfiguration/MaxId?portfolio=${portfolio}`),
	oddleads: (text, params) => backend.api('Projects/Legacy/ODDLeads'),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/Legacy/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	update_label: (portfolio, field, label, included) => backend.api.post('PortfolioConfiguration/Label', { json: { portfolio: portfolio, field: field, label: label, included: included } }),
	portfolio_config: (portfolio) => backend.api(q.portfolio_config_url(portfolio)),
	portfolio_config_update: (portfolio, data) => backend.api.patch(q.portfolio_config_url(portfolio), { json: data }),
	newproject_config: (portfolio) => backend.api(q.newproject_config_url(portfolio)),
	project_update: (data) => backend.api.post(q.project_update_url, { json: data })

}