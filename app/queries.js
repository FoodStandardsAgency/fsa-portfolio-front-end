const backend = require('./backend');

// Queries
const q = {
	max_id:				'SELECT max(project_id) from latest_projects',
	odd_people: 'select * from odd_people order by g6team, surname',

	portfolio_project_query_url: (portfolio) => `Portfolios/${portfolio}/projects`,
	portfolio_projects_url: (portfolio, filter) => `Projects?portfolio=${portfolio}&filter=${filter}`, // Not currently working
	portfolio_config_url: (portfolio) => `PortfolioConfiguration?portfolio=${portfolio}`,
	newproject_config_url: (portfolio) => `Projects/${portfolio}/newproject`,
	project_url: (projectId) => `Projects/${projectId}`,
	project_edit_url: (projectId) => `Projects/${projectId}/edit`,
	project_update_url: `Projects`
	
}

// Export promises
module.exports = {
	// API calls requiring access token
	portfolio_index: (req) => backend.api('Portfolios', { context: { token: req.cookies.access_token } }),
	portfolio_summary: (portfolio, type, req) => backend.api(`Portfolios/${portfolio}/summary`, { searchParams: { type: type }, context: { token: req.cookies.access_token } }),
	portfolio_projectType_summary: (portfolio, type, projectType, req) => backend.api(`Portfolios/${portfolio}/summary`, { searchParams: { type: type, projectType: projectType }, context: { token: req.cookies.access_token } }),
	portfolio_user_summary: (portfolio, type, user, req) => backend.api(`Portfolios/${portfolio}/summary`, { searchParams: { type: type, user: user, includeKeyData: true }, context: { token: req.cookies.access_token } }),
	portfolio_export: (portfolio, req) => backend.api(`Portfolios/${portfolio}/export`, { context: { token: req.cookies.access_token }}),
	portfolio_filter_options: (portfolio, req) => backend.api(`Portfolios/${portfolio}/filteroptions`, { context: { token: req.cookies.access_token } }),
	portfolio_filtered_projects: (portfolio, req) => backend.api.post(q.portfolio_project_query_url(portfolio), { json: req.body, context: { token: req.cookies.access_token }}),
	portfolio_config: (portfolio, req) => backend.api(q.portfolio_config_url(portfolio), { context: { token: req.cookies.access_token }}),
	portfolio_config_update: (portfolio, req) => backend.api.patch(q.portfolio_config_url(portfolio), { json: req.body, context: { token: req.cookies.access_token }}),
	portfolio_upload_csv: (portfolio, form, req) => backend.api.post(`Portfolios/${portfolio}/import`, { body: form, context: { token: req.cookies.access_token } }),

	user_identity: (req) => backend.api(`Users/identity`, { context: { token: req.cookies.access_token }}),
	users_search: (portfolio, term, addnone, req) => backend.api("Users/search", { searchParams: { portfolio: portfolio, term: term, addnone: addnone }, context: { token: req.cookies.access_token } }),
	search_projectid: (portfolio, term, addnone, req) => backend.api("Projects/search", { searchParams: { portfolio: portfolio, term: term, addnone: addnone }, context: { token: req.cookies.access_token } }),
	users_list_suppliers: (req) => backend.api("Users/suppliers", { context: { token: req.cookies.access_token }}),
	users_add_supplier: (portfolio, userName, passwordHash, req) => backend.api.post("Users/addsupplier", { json: { portfolio: portfolio, userName: userName, passwordHash: passwordHash }, context: { token: req.cookies.access_token }}),

	current_projects: (portfolio, req) => backend.api(q.portfolio_projects_url(portfolio, 'current'), { context: { token: req.cookies.access_token }}),
	completed_projects: (portfolio, req) => backend.api(q.portfolio_projects_url(portfolio, 'complete'), { context: { token: req.cookies.access_token }}),
	load_project: (projectId, searchParams, req) => backend.api(q.project_url(projectId), { searchParams: searchParams, context: { token: req.cookies.access_token }}),
	load_project_foredit: (projectId, req) => backend.api(q.project_edit_url(projectId), { searchParams: { includeLastUpdate: true }, context: { token: req.cookies.access_token }}),
	delete_project: (projectId, req) => backend.api.delete(q.project_url(projectId), { context: { token: req.cookies.access_token }}),
	newproject_config: (portfolio, req) => backend.api(q.newproject_config_url(portfolio), { context: { token: req.cookies.access_token }}),
	project_update: (req) => backend.api.post(q.project_update_url, { json: req.body, context: { token: req.cookies.access_token }}),

	// API calls relying on API key
	portfolio_archive: (portfolio) => backend.api(`Portfolios/${portfolio}/archive`),

	// For cleanup
	oddleads: (text, params) => backend.api('Projects/Legacy/ODDLeads'),
	generic_query: 		(text, params) => pool.query(text, params),
	unmatched_leads: (text, params) => backend.api('Projects/Legacy/UnmatchedODDLeads'),
	odd_people:			(text, params) => pool.query(q.odd_people),
	update_label: (portfolio, field, label, included) => backend.api.post('PortfolioConfiguration/Label', { json: { portfolio: portfolio, field: field, label: label, included: included }})

}