var express 			= require('express');
var { check } 		= require('express-validator');
const _ 				= require('lodash');
const multer			= require('multer');
const jwt 				= require('jsonwebtoken');
const xss				= require('xss');
const stringify 		= require('csv-stringify')

// Custom modules
const config 			= require('./config');
var queries 			= require('./queries');

const add_project 		= require('./render_add_project');
const update_portfolio 	= require('./update_portfolio');
const delete_portfolio	= require('./delete_portfolio');
const update_odd 		= require('./update_odd');
const handle_form 		= require('./handle_add_update');
const handle_delete		= require('./handle_delete');
const bulk				= require('./bulk');
const login 			= require('./login');
const filter_view 		= require('./filter_view');
const project_view 		= require('./project_view');
const odd_view			= require('./oddleads_view');

var router 			= express.Router();

// Add timestamps to logs
require('log-timestamp');
console.log("User entry (timestamp 1hr behind)");

// Prep data for summary views
function nestedGroupBy(data, keys) {
  var grouped = {};
  data.forEach((item) => {
    _.update(grouped,
      keys.map((k) => item[k]).join('.'),
      (val) => val ? (val.push(item), val) : [item]
    );
  });
  
 return grouped;
}



//-------------------------------------------------------------------
// LOGIN PAGE
//-------------------------------------------------------------------

router.get ('/login', function (req, res) {res.render("login");});
router.post('/login', [check('user').escape()], function (req, res) { login.login(req, res); });

router.get('/log-out', (req, res) => {
	// Destroy session and log out
	req.session.destroy(function (err) {
		req.logout();
		res.redirect('/login');
	});
});

//-------------------------------------------------------------------
// PORTFOLIO LANDING PAGE
//-------------------------------------------------------------------

router.get('/', login.requireLogin, async (req, res) => {
	
	// run query to pick up all portfolios we have on the platform - and feed through to the template
	// Put expected data structure here. [[url,acronym,name],[...], [...]]
	var portfolios = [['odd', 'ODD','Openness, Data and Digital'], ['serd', 'SERD', 'Science, Evidence and Reseach Directorate'],['abc', 'ABC', 'Portfolio name'], ['test1', 'Test1', 'Portfolio name'],  ['test2', 'Test2', 'Portfolio name'],  ['test3', 'Test3', 'Portfolio name'],  ['test4', 'Test4', 'Portfolio name']]
	
	res.render('landing', {
		"data":portfolios,
		"sess": req.session
	});
})


//-------------------------------------------------------------------
// CONFIGURATION
//-------------------------------------------------------------------

router.get('/:portfolio/configure', login.requireLogin, async (req, res) => {
	
	// Need to get current configuration data to pre-populate the form

	var portfolio = req.params.portfolio;
		
	res.render('configure', {
		"data":"",
		"sess": req.session
	});
})


//-------------------------------------------------------------------
// SUMMARY PAGES
//-------------------------------------------------------------------

router.get('/:portfolio', login.requireLogin, async (req, res) => {
	var portfolio = req.params.portfolio;
	
	queries.current_projects()
	.then((result) => {
		res.render('summary', {
			"data": nestedGroupBy(result.rows, ['category', 'phase']),
			"counts": _.countBy(result.rows, 'phase'),
			"themes": config.categories,
			"phases": config.phases,
			"sess": req.session,
			"portfolio": portfolio
			"sess": req.session
		});
	})
	.catch();
});


router.get('/:portfolio/priority/', login.requireLogin, function (req, res) {	
	queries.current_projects()
	.then((result) => {
		res.render('summary', {
			"data": nestedGroupBy(result.rows, ['pgroup', 'phase']),
			"counts": _.countBy(result.rows, 'phase'),
			"themes": config.priorities,
			"phases":config.phases,
			"sess": req.session,
			"portfolio": portfolio
			"sess": req.session
		});
	});	
});


router.get('/:portfolio/team/', login.requireLogin, function (req, res) {	
	queries.current_projects()
	.then((result) => {
		res.render('summary', {
			"data": nestedGroupBy(result.rows, ['g6team', 'phase']),
			"counts": _.countBy(result.rows, 'phase'),
			"themes": config.teams,
			"phases":config.phases,
			"sess": req.session,
			"portfolio": portfolio
			"sess": req.session
		});
	});	
});

router.get('/:portfolio/rag/', login.requireLogin, function (req, res) {
	queries.current_projects()
	.then((result) => {
		  res.render('summary', {
			"data": 	nestedGroupBy(result.rows, ['rag', 'phase']),
			"counts": 	_.countBy(result.rows, 'phase'),
			"themes": 	config.rags,
			"phases":	config.phases,
			"sess": req.session,
			"portfolio": portfolio
			"sess": req.session
		});
	});	
});

router.get('/:portfolio/oddlead/', login.requireLogin, function (req, res) {odd_view(req, res);});

router.get('/:portfolio/status/', login.requireLogin, function (req, res) {

router.get('/oddlead/', login.requireLogin, function (req, res) {odd_view(req, res);});

router.get('/status/', login.requireLogin, function (req, res) {
	queries.current_projects()
	.then((result) => {
		res.render('phaseview', {
			"data": 	nestedGroupBy(result.rows, ['phase']),
			"counts": 	_.countBy(result.rows, 'phase'),
			"phases":	config.phases,
			"sess": req.session,
			"portfolio": portfolio
		});
	})
	.catch();	
});

router.get('/:portfolio/new_projects/', login.requireLogin, function (req, res) {	
	queries.new_projects()
	.then((result) => {
		res.render('summary', {
			"data": nestedGroupBy(result.rows, ['g6team', 'phase']),
			"counts": _.countBy(result.rows, 'phase'),
			"themes": config.teams,
			"phases":config.phases,
			"sess": req.session,
			"portfolio": portfolio
			"sess": req.session
		});
	});	
});

router.get('/:portfolio/archived', login.requireLogin, function (req, res) {
	queries.completed_projects()
	.then((result) => {
		res.render('completed', {
			"user": req.session.user,
			"data": result.rows,
			"counts": _.countBy(result.rows, 'phase'),
			"sess":req.session,
			"portfolio": portfolio
			"sess":req.session
		});
	})
	.catch();	
});

router.get('/:portfolio/completed', login.requireLogin, function (req, res){res.redirect('/archived');});

router.get('/:portfolio/portfolio-team', login.requireLogin, (req, res) => {
	if(req.session.user == 'portfolio') {res.render('team-page', {"sess": req.session});}
	else {res.render('error_page', {message: 'You are not authorised to view this page'});}
});
		
	
//-------------------------------------------------------------------
// FILTER VIEW
//-------------------------------------------------------------------

router.get ('/filter-view', login.requireLogin, function (req,res) {res.render('filter_view', {"sess": req.session});});
router.post('/filter-view', login.requireLogin, function (req,res) {filter_view(req,res)});

//-------------------------------------------------------------------
// PROJECT VIEW
//-------------------------------------------------------------------

router.get('/projects/:project_id', login.requireLogin, function (req, res) {project_view(req, res);});

//-------------------------------------------------------------------
// RENDER FORMS
//-------------------------------------------------------------------
router.get('/portfolio-add', login.requireLogin, function (req, res) {
	if(req.session.user == 'portfolio') {add_project(req,res);}
	else {res.render('error_page', {message: 'You are not authorised to view this page'});}
});
		
router.get('/portfolio-update/:project_id', login.requireLogin, function (req, res) {
	if(req.session.user == 'portfolio'){update_portfolio(req, res);}
	else {res.render('error_page', {message: 'You are not authorised to view this page'});}
});

router.get('/portfolio-delete/:project_id', login.requireLogin, function (req, res) {
	if(req.session.user == 'portfolio'){delete_portfolio(req, res);}
	else {res.render('error_page', {message: 'You are not authorised to view this page'})};
});

router.get('/odd-update/:project_id', login.requireLogin, (req, res) => {
	if(req.session.user == 'portfolio' || req.session.user == 'odd' || req.session.user == 'team_leaders'){update_odd(req, res);}
	else {res.render('error_page', {message: 'You are not authorised to view this page'});}
});

//-------------------------------------------------------------------

// ADD/UPDATE PROJECTS - handle form submissions
//-------------------------------------------------------------------
router.post('/process-project-form', login.requireLogin, function (req, res) { handle_form(req, res); });
	
//-------------------------------------------------------------------
// DELETE PROJECTS - handle form submissions
//-------------------------------------------------------------------	
router.post('/delete_project_process', login.requireLogin, function (req, res) {handle_delete(req, res)});

//-------------------------------------------------------------------
// Export latest projects as a csv
//-------------------------------------------------------------------	

router.get('/download/csv', login.requireLogin, function(req,res){

	if(req.session.user == 'portfolio') {
		queries.latest_projects()
		.then( (result) => {
						
			for (i = 0; i < result.rows.length; i++){
			/*Project size*/
			if(result.rows[i].project_size == 's') {result.rows[i].project_size = 'Small'}
			else if(result.rows[i].project_size == 'm') {result.rows[i].project_size = 'Medium'}
			else if(result.rows[i].project_size == 'l') {result.rows[i].project_size = 'Large'}
			else if(result.rows[i].project_size == 'x') {result.rows[i].project_size = 'Extra Large'}
			else {result.rows[i].project_size = 'Not set'}
			
			/*Phase*/
			if(result.rows[i].phase == 'backlog') 	{result.rows[i].phase = 'Backlog'}
			else if(result.rows[i].phase == 'discovery') {result.rows[i].phase = 'Discovery'}
			else if(result.rows[i].phase == 'alpha') 	{result.rows[i].phase = 'Alpha'}
			else if(result.rows[i].phase == 'beta') 		{result.rows[i].phase = 'Beta'}
			else if(result.rows[i].phase == 'live') 		{result.rows[i].phase = 'Live'}
			else if(result.rows[i].phase == 'completed') {result.rows[i].phase = 'Completed'}
			else {result.rows[i].phase = 'Not set'}
			
			/*Category*/
			if(result.rows[i].category == 'cap') 	{result.rows[i].category = 'Developing our digital capability'}
			else if(result.rows[i].category == 'data')	{result.rows[i].category = 'Data driven FSA'}
			else if(result.rows[i].category == 'sm') 	{result.rows[i].category = 'IT Service management'}
			else if(result.rows[i].category == 'ser') 	{result.rows[i].category = 'Digital services development and support'}
			else if(result.rows[i].category == 'it') 	{result.rows[i].category = 'Evergreen IT'}
			else if(result.rows[i].category == 'res') 	{result.rows[i].category = 'Protecting data and business resilience'}
			else {result.rows[i].category = 'Not set'}
				
			/*Budget*/
			if(result.rows[i].budgettype == 'admin') 	{result.rows[i].budgettype = 'Admin'}
			else if(result.rows[i].budgettype == 'progr') 	{result.rows[i].budgettype = 'Programme'}
			else if(result.rows[i].budgettype == 'capit') 	{result.rows[i].budgettype = 'Capital'}
			else {result.rows[i].budgettype = 'Not set'}
			
			/*Directorate*/
			if(result.rows[i].direct == 'ODD') 	{result.rows[i].direct = 'Openness Data & Digital'}
			else if(result.rows[i].direct == 'COMMS') 	{result.rows[i].direct = 'Communications'}
			else if(result.rows[i].direct == 'IR') 	{result.rows[i].direct = 'Incidents & Resilience'}
			else if(result.rows[i].direct == 'FO') 	{result.rows[i].direct = 'Field Operations'}
			else if(result.rows[i].direct == 'FP') 	{result.rows[i].direct = 'Finance & Performance'}
			else if(result.rows[i].direct == 'FSP') 	{result.rows[i].direct = 'Food Safety Policy'}
			else if(result.rows[i].direct == 'FSA') 	{result.rows[i].direct = 'FSA Wide'}
			else if(result.rows[i].direct == 'NFCU') 	{result.rows[i].direct = 'National Food Crime Unit'}
			else if(result.rows[i].direct == 'NI') 	{result.rows[i].direct = 'Northern Ireland'}
			else if(result.rows[i].direct == 'PEOP') 	{result.rows[i].direct = 'People'}
			else if(result.rows[i].direct == 'RC') 	{result.rows[i].direct = 'Regulatory Compliance'}
			else if(result.rows[i].direct == 'SERD') 	{result.rows[i].direct = 'Science Evidence & Research'}
			else if(result.rows[i].direct == 'SLG') 	{result.rows[i].direct = 'Strategy Legal & Governance'}
			else if(result.rows[i].direct == 'WAL') 	{result.rows[i].direct = 'Wales'}
			else {result.rows[i].direct = 'Not set'}	
			
			/*RAG*/
			if(result.rows[i].rag == 'gre') {result.rows[i].rag = 'Green'}
			else if(result.rows[i].rag == 'nor') {result.rows[i].rag = 'Not set'}
			else if(result.rows[i].rag == 'amb') {result.rows[i].rag = 'Amber'}
			else if(result.rows[i].rag == 'red') {result.rows[i].rag = 'Red'}
			else {result.rows[i].rag = 'Not set'}
			}

		  res.setHeader('Content-Type', 'text/csv');
		  res.setHeader('Content-Disposition', 'attachment; filename=\"' + 'latest_projects-' + Date.now() + '.csv\"');
		  res.setHeader('Cache-Control', 'no-cache');
		  res.setHeader('Pragma', 'no-cache');

		  stringify(result.rows, { header: true })
			.pipe(res);

		})
		.catch();
	}
	else {res.render('error_page', {message: 'You are not authorised to view this page'});}
})




	


//-------------------------------------------------------------------
// Export router
//-------------------------------------------------------------------

module.exports = router;
