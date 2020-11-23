const crypto	= require('crypto');
const tokens = require('./tokens');
const graph = require('./graph');
const backend = require('./backend');
const handleError = require('./error');


// Redirect not logged in users to the login page
function requireLogin(req, res, next) {
	//console.log("Login");
	//console.log(req.session.user);
	//console.log(req.session.group);
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

function requireAdmin(req, res, next) {
	requireLogin(req, res, () => {
		if (req.session.user == 'portfolio') {
			next();
		}
		else {
			res.render('error_page', { message: 'You are not authorised to view this page' });
		}

	});
}
function requireEditor(req, res, next) {
	requireLogin(req, res, () => {
		if (req.session.user == 'portfolio' || req.session.user == 'odd' || req.session.user == 'team_leaders') {
			next();
		}
		else {
			res.render('error_page', { message: 'You are not authorised to view this page' });
		}

	});
}


function login(req, res) {
	// Get form data
	const user = req.body.user;
	const password = req.body.password;

	// Calculate hash
	const prov_hash = crypto.createHash('sha256').update(password).digest('hex').toUpperCase();

	(async () => {
		try {
			const { body } = await backend.api.post('Users/legacy', {
				json: {
					userName: user,
					passwordHash: prov_hash
				}
			});

			if (body && body.userName && body.accessGroup) {
				req.session.user = body.userName;
				req.session.group = body.accessGroup;
				req.session.login = 'yes';

				res.redirect('/');
				res.end();
			}
			else {
				console.log('Login failed: user not found.')
				req.session.destroy;
				res.redirect('/login');
				res.end();
            }
		}
		catch (error) {
			console.log(`Login failed: received error from API - ${error.message}`)
			handleError(error);
			req.session.destroy;
			res.redirect('/login');
			res.end();
        }
	})();


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

	(async () => {
		try {
			const { body } = await backend.api.post('Users/LegacyADUsers', {
				json: {
					userName: loginUser
				}
			});

			req.session.user = body.userName;
			req.session.group = body.accessGroup;
			req.session.login = 'yes';

			res.redirect('/');
			res.end();
		}
		catch (error) {
			console.log('couldnt log in')
			console.log(error.response.body);
			req.session.destroy;
			res.redirect('/login');
			res.end();
		}
	})();

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


module.exports = { requireLogin, requireAdmin, requireEditor, login, loginADUser };