const crypto	= require('crypto');
const tokens = require('./tokens');
const graph = require('./graph');
const backend = require('./backend');
const errors = require('./error');
var queries = require('./queries');

const handleError = errors.handleError;


// Redirect not logged in users to the login page
function requireLogin(req, res, next) {
	if (req.cookies.identity === undefined) {
		(async () => {
			var result = await loginADUser(req, res);
			if (!result) {
				console.log("login undefined - redirecting");
				tokens.logout(req, res);
				res.redirect('/login');
				res.end();
			}
			else {
			// No need to call next here because got redirected further down.
			}
		})();
	} else {
		next();
	}
};

function hasRole(req, role) {
	var portfolio = req.params.portfolio;
	return req.cookies.identity.roles.includes(`${portfolio}.${role}`);
}

function requireAdmin(req, res, next) {
	requireLogin(req, res, () => {
		if (hasRole(req, 'admin') || hasRole(req, 'superuser') ) {
			next();
		}
		else {
			res.render('error_page', { message: 'You are not authorised to view this page' });
		}
	});
}
function requireEditor(req, res, next) {
	requireLogin(req, res, () => {
		if (hasRole(req, 'admin') || hasRole(req, 'editor') || hasRole(req, 'lead')) {
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
			var result = await backend.api.post('Token', {
				form: {
					username: user,
					password: prov_hash,
					grant_type: 'password'
				}
			});

			if (result.statusCode == 200) {
				var tokenbody = result.body;
				await tokens.setBearerToken(req, res, tokenbody);

				// TODO: call again using token to get the user details (access group etc)
				result = await backend.api.post('Users/legacy', {
					json: {
						userName: user,
						passwordHash: prov_hash
					},
					context: { token: tokenbody.access_token }
				});
				var body = result.body;

				if (result.statusCode == 200) {

					if (body && body.userName && body.accessGroup) {
						res.redirect('/');
						res.end();
					}
					else {
						console.log('Login failed: user not found.')
						tokens.logout(req, res);
						res.redirect('/login');
						res.end();
					}
				}
				else {
					errors.handleUnauthorised(res);
					tokens.logout(req, res);
				}
			}
			else {
				errors.handleUnauthorised(res);
				tokens.logout(req, res);
			}

		}
		catch (error) {
			console.log(`Login failed: received error from API - ${error.message}`)
			handleError(error);
			tokens.logout(req, res);
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
				await loginUser(req, res, userName, accessToken);
				return true; 
			}
		}
		return false;
	}
}

async function loginUser(req, res, loginUser, accessToken) {
	try {

		var result = await backend.api.post('Token', {
			form: {
				username: loginUser,
				password: '',
				grant_type: 'password'
			},
			context: {
				accessToken: accessToken
            }
		});

		if (result.statusCode == 200) {
			var tokenbody = result.body;
			await tokens.setBearerToken(req, res, tokenbody);
			res.redirect('/');
			res.end();
		}
		else {
			tokens.logout(req, res);
			errors.handleUnauthorised(res);
		}
	}
	catch (error) {
		console.log('couldnt log in')
		console.log(error.response.body);
		tokens.logout(req, res);
		res.redirect('/login');
		res.end();
	}
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

function logout(req, res) {
	// Destroy session and log out
	tokens.logout(req, res);
	req.logout();
	res.redirect('/login');
}


module.exports = { hasRole, requireLogin, requireAdmin, requireEditor, login, logout };