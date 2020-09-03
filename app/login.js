const crypto	= require('crypto');
const queries = require('./queries');
const tokens = require('./tokens');
const graph = require('./graph');

// Redirect not logged in users to the login page
function requireLogin(req, res, next) {
	console.log("Login");
	console.log(req.session.user);
	console.log(req.session.group);
	if (req.session.login == undefined) {
		loginADUser(req, res).then(result => {
			if (!result) {
				console.log("login undefined - redirecting");
				req.session.destroy();
				res.redirect('/login');
				res.end();
			}
			else {
				next();
			}
		});
	} else {
		next();
	}
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

async function loginADUser(req, res) {
	if (req.isAuthenticated()) {
		// Get the access token
		var accessToken = await tokens.getAccessToken(req);
		var user = await graph.getUserDetails(accessToken);
		if (user) {
			const groups = await graph.getUserGroups(accessToken);
			if (groups) {
				var userName = translateUserGroup(user, groups.value);
				loginUser(req, res, userName).then((result) => { return true; });
			}
		}
		return false;
	}
}

function loginUser(req, res, loginUser) {
	// Define queries
	var text = 'SELECT username, access_group from users where username = $1';
	var values = [loginUser];

	// Check if the usernames match
	queries.generic_query(text, values)
		.then((result) => {

			if (result.rowCount == 1) {
				req.session.user = result.rows[0].username;
				req.session.group = result.rows[0].access_group;
				req.session.login = 'yes';
				res.redirect('/');
				res.end();
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


function translateUserGroup(user, groups) {
	var u = user.userPrincipalName;
	var found = false;

	for (var i = 0; !found && i < groups.length; i++) {
		const gid = groups[i].id;
		switch (gid) {
			case process.env.GROUPID_FSA_PORTFOLIO_PORTFOLIO:
				u = "portfolio";
				found = true;
				break;
			case process.env.GROUPID_FSA_PORTFOLIO_ODD:
				u = "odd";
				found = true;
				break;
		}
	}
	return u;
}


module.exports = { requireLogin, login, loginADUser };