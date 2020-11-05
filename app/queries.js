const { Pool } = require('pg');
const backend = require('./backend');


// Connection pool
const pool = new Pool()

// Queries
const q = {
	max_id:				'SELECT max(project_id) from latest_projects',
	odd_people: 'select * from odd_people order by g6team, surname',

	portfolio_project_query_url: (portfolio) => `Portfolios/${portfolio}/projects`,
	portfolio_projects_url: (portfolio, filter) => `Projects?portfolio=${portfolio}&filter=${filter}`, // Not currently working
	portfolio_config_url: (portfolio) => `PortfolioConfiguration/${portfolio}`,
	newproject_config_url: (portfolio) => `Projects/${portfolio}/newproject`,
	project_url: (projectId) => `Projects/${projectId}`,
	project_edit_url: (projectId) => `Projects/${projectId}/edit`,
	project_update_url: `Projects`
	
}

// Export promises
module.exports = {
	// Actions
	portfolio_index: () => backend.api('Portfolios'),
	portfolio_summary: (portfolio, type) => backend.api(`Portfolios/${portfolio}/summary`, { searchParams: { type: type } }),
	portfolio_filter_options: (portfolio) => backend.api(`Portfolios/${portfolio}/filteroptions`),
	portfolio_filtered_projects: (portfolio, data) => backend.api.post(q.portfolio_project_query_url(portfolio), { json: data }),
	portfolio_config: (portfolio) => backend.api(q.portfolio_config_url(portfolio)),
	portfolio_config_update: (portfolio, data) => backend.api.patch(q.portfolio_config_url(portfolio), { json: data }),

	users_search: (portfolio, term) => backend.api("Users/search", { searchParams: { portfolio: portfolio, term: term }}),

	current_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'current')),
	completed_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'complete')),
	latest_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'latest')),
	new_projects: (portfolio) => backend.api(q.portfolio_projects_url(portfolio, 'new')),
	load_project: (projectId, searchParams) => backend.api(q.project_url(projectId), { searchParams: searchParams }),
	load_project_foredit: (projectId) => backend.api(q.project_edit_url(projectId), { searchParams: { includeLastUpdate: true } }),
	max_id: (portfolio) => backend.api(`PortfolioConfiguration/MaxId?portfolio=${portfolio}`),

	oddleads: (text, params) => backend.api('Projects/Legacy/ODDLeads'),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/Legacy/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	update_label: (portfolio, field, label, included) => backend.api.post('PortfolioConfiguration/Label', { json: { portfolio: portfolio, field: field, label: label, included: included } }),
	newproject_config: (portfolio) => backend.api(q.newproject_config_url(portfolio)),
	project_update: (data) => backend.api.post(q.project_update_url, { json: data })

}