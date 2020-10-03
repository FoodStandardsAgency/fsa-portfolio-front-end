const queries 	= require('./queries');
const xss = require('xss');
const backend = require('./backend');

async function handle_form(req, res) {
	try {
		await handle_add_update(req, res);
	}
	catch (error) {
		console.log(`Login failed: received error from API - ${error.message}`)
		console.log(error.stack)
		res.end();
    }
}

async function handle_add_update(req, res) {

	const project_id = xss(req.body.project_id);

	// Dates
	var start_date_day = xss(req.body.start_date_day)
	var start_date_month = xss(req.body.start_date_month)
	var start_date_year = xss(req.body.start_date_year)

	var actstart_day = xss(req.body.actstart_day)
	var actstart_month = xss(req.body.actstart_month)
	var actstart_year = xss(req.body.actstart_year)

	var expendp_day = xss(req.body.expendp_day)
	var expendp_month = xss(req.body.expendp_month)
	var expendp_year = xss(req.body.expendp_year)

	var expend_day = xss(req.body.expend_day)
	var expend_month = xss(req.body.expend_month)
	var expend_year = xss(req.body.expend_year)

	var hardend_day = xss(req.body.hardend_day)
	var hardend_month = xss(req.body.hardend_month)
	var hardend_year = xss(req.body.hardend_year)

	// Get the latest update
	var update = xss(req.body.update)
	var new_update = xss(req.body.new_update)
	if (new_update != '' && new_update != undefined) { var update = new_update; }

	const docs_name1 = xss(req.body.docs_name1)
	const docs_name2 = xss(req.body.docs_name2)
	const docs_name3 = xss(req.body.docs_name3)
	const docs_name4 = xss(req.body.docs_name4)

	const docs_link1 = xss(req.body.docs_link1)
	const docs_link2 = xss(req.body.docs_link2)
	const docs_link3 = xss(req.body.docs_link3)
	const docs_link4 = xss(req.body.docs_link4)

	var link_name = xss(req.body.link_name)
	var link_address = xss(req.body.link_address)

	// Combine links and docs names
	if (docs_name1 != '' || docs_name2 != '' || docs_name3 != '' || docs_name4 != '') {
		var str = docs_name1.concat(',', docs_link1, ',', docs_name2, ',', docs_link2, ',', docs_name3, ',', docs_link3, ',', docs_name4, ',', docs_link4);
		var documents = str.split(',');

		// Remove empty elements from the array
		var documents = documents.filter(elem => elem.length > 0);

		// Convert back to string
		var documents = documents.toString();
	}
	else { var documents = ''; }

	// Combine link to project channel (name & link)
	if (link_address != '') {
		if (link_name == '') { link_name = 'Link' }
		var link = link_name.concat(',', link_address);
	}

	// Calculate priority group
	const priority = xss(req.body.priority)
	var pgroup = '';
	if (parseInt(priority, 10) >= 15) { var pgroup = 'high'; }
	else if (parseInt(priority, 10) >= 8) { var pgroup = "medium"; }
	else { var pgroup = "low"; }

	// Handle empty proportion fields
	var p_comp = xss(req.body.p_comp);
	if (p_comp == "") { p_comp = 0 };

	// Validate dates

	var currentdate = new Date();
	var today_day = currentdate.getDate();
	var today_month = currentdate.getMonth() + 1;
	var today_year = currentdate.getFullYear();

	// Month & day must be 2-digit format; year already in in 4-digit format
	if (start_date_month.length == 1) { start_date_month = '0'.concat(start_date_month) }
	if (actstart_month.length == 1) { actstart_month = '0'.concat(actstart_month) }
	if (expendp_month.length == 1) { expendp_month = '0'.concat(expendp_month) }
	if (expend_month.length == 1) { expend_month = '0'.concat(expend_month) }
	if (hardend_month.length == 1) { hardend_month = '0'.concat(hardend_month) }

	if (start_date_day.length == 1) { start_date_day = '0'.concat(start_date_day) }
	if (actstart_day.length == 1) { actstart_day = '0'.concat(actstart_day) }
	if (expendp_day.length == 1) { expendp_day = '0'.concat(expendp_day) }
	if (expend_day.length == 1) { expend_day = '0'.concat(expend_day) }
	if (hardend_day.length == 1) { hardend_day = '0'.concat(hardend_day) }

	// Replace missingg values with zeros
	if (start_date_day == '' || start_date_day == undefined) { start_date_day = '00'; }
	if (start_date_month == '' || start_date_month == undefined) { start_date_month = '00'; }
	if (start_date_year == '' || start_date_year == undefined) { start_date_year = '0000'; }

	if (actstart_day == '' || actstart_day == undefined) { actstart_day = '00'; }
	if (actstart_month == '' || actstart_month == undefined) { actstart_month = '00'; }
	if (actstart_year == '' || actstart_year == undefined) { actstart_year = '0000'; }

	if (expendp_day == '' || expendp_day == undefined) { expendp_day = '00'; }
	if (expendp_month == '' || expendp_month == undefined) { expendp_month = '00'; }
	if (expendp_year == '' || expendp_year == undefined) { expendp_year = '0000'; }

	if (expend_day == '' || expend_day == undefined) { expend_day = '00'; }
	if (expend_month == '' || expend_month == undefined) { expend_month = '00'; }
	if (expend_year == '' || expend_year == undefined) { expend_year = '0000'; }

	if (hardend_day == '' || hardend_day == undefined) { hardend_day = '00'; }
	if (hardend_month == '' || hardend_month == undefined) { hardend_month = '00'; }
	if (hardend_year == '' || hardend_year == undefined) { hardend_year = '0000'; }

	// If day, month or year are not 0000, then all others must be populated
	if (start_date_day != '00' || start_date_month != '00' || start_date_year != '0000') {
		if (start_date_day == '00') { start_date_day = today_day; }
		if (start_date_month == '00') { start_date_month = today_month; }
		if (start_date_year == '0000') { start_date_year = today_year; }
	}

	if (actstart_day != '00' || actstart_month != '00' || actstart_year != '0000') {
		if (actstart_day == '00') { actstart_day = today_day; }
		if (actstart_month == '00') { actstart_month = today_month; }
		if (actstart_year == '0000') { actstart_year = today_year; }
	}

	if (expendp_day != '00' || expendp_month != '00' || expendp_year != '0000') {
		if (expendp_day == '00') { expendp_day = today_day; }
		if (expendp_month == '00') { expendp_month = today_month; }
		if (expendp_year == '0000') { expendp_year = today_year; }
	}

	if (expend_day != '00' || expend_month != '00' || expend_year != '0000') {
		if (expend_day == '00') { expend_day = today_day; }
		if (expend_month == '00') { expend_month = today_month; }
		if (expend_year == '0000') { expend_year = today_year; }
	}

	if (hardend_day != '00' || hardend_month != '00' || hardend_year != '0000') {
		if (hardend_day == '00') { hardend_day = today_day; }
		if (hardend_month == '00') { hardend_month = today_month; }
		if (hardend_year == '0000') { hardend_year = today_year; }
	}

	// Maximum days for months - 31 is already a maximum, so no need to check for that
	var month_30 = ['04', '06', '09', '11']
	var feb_days = ['29', '30', '31']

	if (month_30.includes(start_date_month) && start_date_day == '31') { start_date_day = '30' }
	if (month_30.includes(actstart_month) && actstart_day == '31') { actstart_day = '30' }
	if (month_30.includes(expendp_month) && expendp_day == '31') { expendp_day = '30' }
	if (month_30.includes(expend_month) && expend_day == '31') { expend_day = '30' }
	if (month_30.includes(hardend_month) && hardend_day == '31') { hardend_day = '30' }

	if (start_date_month == '02' && feb_days.includes(start_date_day)) { start_date_day = '28' }
	if (actstart_month == '02' && feb_days.includes(actstart_day)) { actstart_day = '28' }
	if (expendp_month == '02' && feb_days.includes(expendp_day)) { expendp_day = '28' }
	if (expend_month == '02' && feb_days.includes(expend_day)) { expend_day = '28' }
	if (hardend_month == '02' && feb_days.includes(hardend_day)) { hardend_day = '28' }


	var update = {
		// About the project
		project_id: project_id,
		project_name: xss(req.body.project_name),
		short_desc: xss(req.body.project_desc),
		rels: xss(req.body.rels),
	
		phase: xss(req.body.phase),
		category : xss(req.body.category),
		subcat : xss(req.body.subcat),
		rag : xss(req.body.rag),
		onhold: xss(req.body.onhold),

		update: update,
		oddlead: xss(req.body.oddlead),
		oddlead_email: xss(req.body.oddlead_email).toLowerCase(),
		servicelead: xss(req.body.servicelead),
		servicelead_email: xss(req.body.servicelead_email),
		team: xss(req.body.team),
		priority_main: priority,
		funded: xss(req.body.funded),
		confidence: xss(req.body.confidence),
		priorities: xss(req.body.priorities),
		benefits: xss(req.body.benefits),
		criticality: xss(req.body.criticality),


		budget: xss(req.body.budget),
		spent: xss(req.body.spent),
		project_size: xss(req.body.project_size),
		oddlead_role: xss(req.body.oddlead_role),
	
		dependencies: xss(req.body.deps),
		budgettype: xss(req.body.budgettype),
		direct: xss(req.body.direct),

		documents: documents,
		link: link,
		pgroup: pgroup,
		p_comp: p_comp,
		

		// Generate dates
		start_date: ''.concat(start_date_day, '/', start_date_month, '/', start_date_year),
		actstart: ''.concat(actstart_day, '/', actstart_month, '/', actstart_year),
		expendp: ''.concat(expendp_day, '/', expendp_month, '/', expendp_year),
		expend: ''.concat(expend_day, '/', expend_month, '/', expend_year),
		hardend: ''.concat(hardend_day, '/', hardend_month, '/', hardend_year)


	};


	const form_type = xss(req.body.form_type)
	
	
	// Run insert query
	const { body } = await backend.api.post('Projects', {
		json: update
	});

	
	//var insert_query = 'INSERT INTO projects(project_id, project_name, start_date, short_desc, phase, category, subcat, rag, update, oddlead, oddlead_email, servicelead, servicelead_email, priority_main, funded, confidence, priorities, benefits, criticality, budget, spent, documents, link, pgroup, rels, team, onhold, expend, hardend, actstart, dependencies, project_size, oddlead_role, budgettype, direct, expendp, p_comp) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37)';
	//var values = [project_id, project_name, start_date, short_desc, phase, category, subcat, rag, update, oddlead, oddlead_email, servicelead, servicelead_email, priority, funded, confidence, priorities, benefits, criticality, budget, spent, documents, link, pgroup, rels, team, onhold, expend, hardend, actstart, deps, project_size, oddlead_role, budgettype, direct, expendp, p_comp];
	
	//console.log(insert_query)
	//console.log(values)
		
	//queries.generic_query(insert_query, values)
	//.then(console.log("INSERT query run - project update or addition"))
	//.catch(e => console.error(e.stack))
	
	// Redirect to the project page
	var url = '/projects/'.concat(project_id);
	if (form_type == 'ptadd'){
		// Wait for 3 seconds before redirecting - as it needs to create the page before redirecting. Without delay, it redirects to the homepage.
		setTimeout(function () {
			res.redirect(url)
		}, 3000); 
	}	
	else {res.redirect(url)}
	
	//res.send('It is not possible to update the portfolio at this time due to ongoing migration work.')
}

module.exports = handle_form;
