const got = require('got');
const backEndApiBase = `${process.env.BACKEND_PROTOCOL}://${process.env.BACKEND_HOST}/${process.env.BACKEND_API_BASE}`;
const api = got.extend({
	prefixUrl: backEndApiBase,
	headers: { 'APIKey': process.env.BACKEND_API_KEY },
	responseType: 'json'
});

module.exports = { api };