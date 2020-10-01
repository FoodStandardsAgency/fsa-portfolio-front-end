const crypto	= require('crypto');
const queries 	= require('./queries');

function add_supplier(req, res) {
	// Get form data
	const user = req.body.user_supp;
	const password = req.body.password_supp;

	// Calculate hash
	const hash = crypto.createHash('sha256').update(password).digest('hex').toUpperCase();
	
	// Check if proposed usearname is already in the db, and return an error if sort
	
	var sql = 'select * from users where username = $1';
	var sqlvals = [user];
	
	queries.generic_query(sql, sqlvals)
	.then((result) => {
		
		if (result.rowCount > 0){var msg = '0';}	
		else {
			var msg = '1';
			
			// Insert query - to create the account
			var text = 'INSERT into users (username, pass_hash, access_group) VALUES ($1, $2, $3)';
			var values = [user, hash, 4];

			queries.generic_query(text, values).then().catch();
		}
		
		var url = 'suppliers/add-supplier?msg='.concat(msg);
		console.log(url);
		
		// Redirect
		setTimeout(function () {
			res.redirect(url);
		}, 3000); 
	})
	.catch();

}

function render_add_supplier(req,res){
	
		var sess = req.session;
		var text = 'SELECT * from users where access_group = $1';
		var values = [4];
		
		var msg = req.query.msg;
		
		if(msg == '0'){var message = '<br /><span style="color:red">Error: This username is already in use</span>';}
		else if (msg == '1'){var message = '<br /><span style="color:green">Supplier account created successfully</span>';}
		else {var message = '';}

		queries.generic_query(text, values)
		.then((result)=>{

			if(result.rowCount > 0){
				
				var supps = []; for (i = 0; i < result.rowCount; i++){supps.push(result.rows[i].username);}
				
				res.render("add_supplier", {
					"cnt": result.rowCount,
					"supps": supps,
					"sess": sess,
					"msg": message
				});
			}
			else {res.render("add_supplier", {"msg": message});}
		})
		.catch();
	
}

module.exports = {add_supplier, render_add_supplier};
