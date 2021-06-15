const queries = require('./queries');
const errors = require('./error');
const handleError = errors.handleError;
const config = require('./config');
const moment	= require('moment');




async function view(req, res) {
	try {
		var portfolio = req.params.portfolio;
		var result = await queries.portfolio_filter_options(portfolio, req);
		var portfolioconfig = result.body.config;
		var options = result.body.options;
		var fieldGroups = config.getFieldGroups(portfolioconfig);

		res.render('filter_view', {
			"portfolio": portfolio,
			"options": options,
			"fieldgroups": fieldGroups,
			"form_values": {}
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
    }
}




async function getResults(req, res) {
	try {
		var portfolio = req.params.portfolio;
		//console.log(req.body);

		var queryResult = await queries.portfolio_filtered_projects(portfolio, req);
		var optionsResult = await queries.portfolio_filter_options(portfolio, req);
		var portfolioconfig = optionsResult.body.config;
		var options = optionsResult.body.options;
		var fieldGroups = config.getFieldGroups(portfolioconfig);

		res.render('filter_view', {
			"stage": 'results',
			"portfolio": portfolio,
			"options": options,
			"fieldgroups": fieldGroups,
			"data": queryResult.body,
			"form_values": req.body
		});
	}
	catch (error) {
		if (!handleError(error, res)) res.end();
    }
};

module.exports = {
	view: view,
	getResults: getResults
};