const crypto	= require('crypto');
const tokens = require('./tokens');
const graph = require('./graph');
const backend = require('./backend');
const errors = require('./error');
var queries = require('./queries');

const handleError = errors.handleError;


// Redirect not logged in users to the login page
function requireLogin(req, res, next) {
	//console.log("Login");
	//console.log(req.session.user);
	//console.log(req.session.group);

	if (req.cookies.identity == undefined || req.session.login == undefined) {
		(async () => {
			var result = await loginADUser(req, res);
			if (!result) {
				console.log("login undefined - redirecting");
				req.session.destroy();
				res.redirect('/login');
				res.end();
			}
			else {
				next();
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
		if (hasRole(req, 'admin')) {
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
				else {
					req.session.destroy;
					errors.handleUnauthorised(res);
				}
			}
			else {
				req.session.destroy;
				errors.handleUnauthorised(res);
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

			var response = await backend.api.post('Users/LegacyADUsers', {
				json: {
					userName: loginUser
				},
				context: { token: tokenbody.access_token }
			});
			var body = response.body;

			req.session.user = body.userName;
			req.session.group = body.accessGroup;
			req.session.login = 'yes';

			res.redirect('/');
			res.end();
		}
		else {
			req.session.destroy;
			errors.handleUnauthorised(res);
		}
	}
	catch (error) {
		console.log('couldnt log in')
		console.log(error.response.body);
		req.session.destroy;
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
	req.session.destroy(function (err) {
		req.logout();
		res.redirect('/login');
	});
}


module.exports = { requireLogin, requireAdmin, requireEditor, login, logout };