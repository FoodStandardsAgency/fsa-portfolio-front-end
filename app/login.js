const crypto	= require('crypto');
const queries 	= require('./queries');

// Redirect not logged in users to the login page
function requireLogin(req, res, next) {
	console.log("Login");
	console.log(req.session.user);
	console.log(req.session.group);
	if (req.session.login == undefined) {
		console.log("login undefined - redirecting");
		req.session.destroy();
		res.redirect('/login');
	} else { next(); }
};

function login(req, res) {
	// Get form data
	const user = req.body.user;
	const password = req.body.password;

	// Calculate hash
	const prov_hash = crypto.createHash('sha256').update(password).digest('hex').toUpperCase();
	
	//console.log('In login function')
	//console.log(user)
	//console.log(password)
		
	// Define queries
	var text = 'SELECT username, pass_hash, access_group from users where username = $1';
	var values = [user];

	// Check if the usernames match
	queries.generic_query(text, values)
	.then((result) => {

	//console.log(result)
		if(result.rowCount == 1){
			if(result.rows[0].pass_hash == prov_hash){
				req.session.user = result.rows[0].username;
				req.session.group = result.rows[0].access_group;
				req.session.login = 'yes';
				
				//console.log(prov_hash)
				//console.log(result.rows[0].pass_hash)

				res.redirect('/');
				res.end();
				}
			else {
				req.session.destroy;
				//console.log('couldnt log in')
				res.redirect('/login');
				res.end();
			}
		}
		else {
			//console.log('no result')
			req.session.destroy;
			res.redirect('/login');
			res.end();
		}
	}
	)
	.catch();
}

module.exports = { requireLogin, login };