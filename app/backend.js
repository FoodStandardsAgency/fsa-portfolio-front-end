const got = require('got');
const backEndApiBase = `${process.env.BACKEND_PROTOCOL}://${process.env.BACKEND_HOST}/${process.env.BACKEND_API_BASE}`;
const backEndTimeout = process.env.BACKEND_TIMEOUT ?? 90000;
const backEndTimeThreshold = process.env.BACKEND_TIME_THRESHOLD ?? 10000;

const api = got.extend({
	prefixUrl: backEndApiBase,
	headers: { 'APIKey': process.env.BACKEND_API_KEY },
	responseType: 'json',
	timeout: { request: backEndTimeout },
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
		],
		afterResponse: [
			(response, retryWithMergedOptions) => {

				if (response.timings.phases.total > backEndTimeThreshold) {
					console.log(`Request over time threshold for ${response.requestUrl}`);
					console.log(response.timings);
                }
				// No changes otherwise
				return response;
			}
		],
		beforeError: [
			error => {
				if (error.code == 'ETIMEDOUT') {
					const { response } = error;
					if (error.request?.requestUrl) {
						console.log(`Request timed out for ${error.request.requestUrl}`);
					}
					console.log(error.timings);
					if (response && response.body) {
						console.log("--------------------- RESPONSE --------------------------")
						console.log(response);
					}
				}
				return error;
			}
		]
	}
});

module.exports = { api };