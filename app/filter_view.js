const queries = require('./queries');
const errors = require('./error');
const handleError = errors.handleError;
const config = require('./config');
const moment	= require('moment');




async function view(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var result = await queries.portfolio_filter_options(portfolio);
		var portfolioconfig = result.body.config;
		var options = result.body.options;
		var fieldGroups = config.getFieldGroups(portfolioconfig);

		res.render('filter_view', {
			"sess": req.session,
			"portfolio": portfolio,
			"options": options,
			"fieldgroups": fieldGroups,
			"form_values": {}
		});
	}
	catch (error) {
		handleError(error);
    }
}




async function getResults(req, res) {
	try {
		var portfolio = req.params.portfolio;
		console.log(req.body);

		var queryResult = await queries.portfolio_filtered_projects(portfolio, req.body);
		var optionsResult = await queries.portfolio_filter_options(portfolio);
		var portfolioconfig = optionsResult.body.config;
		var options = optionsResult.body.options;
		var fieldGroups = config.getFieldGroups(portfolioconfig);

		var label_priority_main = portfolioconfig.labels.find(l => l.field == 'priority_main').label;

		res.render('filter_view', {
			"stage": 'results',
			"sess": req.session,
			"portfolio": portfolio,
			"options": options,
			"fieldgroups": fieldGroups,
			"label_priority_main": label_priority_main,
			"data": queryResult.body,
			"form_values": req.body
		});
	}
	catch (error) {
		handleError(error);
    }
};

module.exports = {
	view: view,
	getResults: getResults
};