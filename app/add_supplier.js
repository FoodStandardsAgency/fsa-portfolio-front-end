const crypto	= require('crypto');
const queries = require('./queries');
const errors = require('./error');
const handleError = errors.handleError;


async function add_supplier(req, res) {
	try {
		// Get form data
		const user = req.body.user_supp;
		const password = req.body.password_supp;
		var portfolio = req.params.portfolio;

		// Calculate hash
		const hash = crypto.createHash('sha256').update(password).digest('hex').toUpperCase();

		// Check if proposed usearname is already in the db, and return an error if sort
		var response = await queries.users_add_supplier(user, hash, req);
		if (response.body.result == 'Ok')
			var msg = '1'; // Success
		else if (response.body.result == 'Duplicate')
			var msg = '0'; // Duplicate user
		else {
			// What to do here?
		}

		var url = `/${portfolio}/add-supplier?msg=${msg}`;
		console.log(url);

		// Redirect
		setTimeout(function () {
			res.redirect(url);
		}, 3000);
	}
	catch (error) {
		handleError(error);
		res.end();
	}
}

async function render_add_supplier(req,res){
	try {
		var portfolio = req.params.portfolio;
		var response = await queries.users_list_suppliers(req);

		var msg = req.query.msg;
		if (msg == '0') { var message = '<br /><span style="color:red">Error: This username is already in use</span>'; }
		else if (msg == '1') { var message = '<br /><span style="color:green">Supplier account created successfully</span>'; }
		else { var message = ''; }

		res.render("add_supplier", {
			"portfolio": portfolio,
			"cnt": response.body.suppliers.length,
			"supps": response.body.suppliers,
			"msg": message
		});
    }
	catch (error) {
		handleError(error);
		res.end();
	}
}

module.exports = {add_supplier, render_add_supplier};
