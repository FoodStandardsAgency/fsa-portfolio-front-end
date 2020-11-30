const got = require('got');
const backEndApiBase = `${process.env.BACKEND_PROTOCOL}://${process.env.BACKEND_HOST}/${process.env.BACKEND_API_BASE}`;
const api = got.extend({
	prefixUrl: backEndApiBase,
	headers: { 'APIKey': process.env.BACKEND_API_KEY },
	responseType: 'json',
	hooks: {
		beforeRequest: [
			options => {
				if (options.context) {
					if (options.context.accessToken) {
						options.headers.Authorization = `AccessToken ${options.context.accessToken}`;
					}
					else if (options.context.token) {
						options.headers.Authorization = `Bearer ${options.context.token}`;
					}
				}
            }
		]
	}
});

module.exports = { api };