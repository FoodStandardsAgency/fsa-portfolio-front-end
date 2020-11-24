function handleError(error) {
	console.log('***************************');
	if (error.message) console.log(error.message);
	if (error.stack) console.log(error.stack);
	if (error.response) {
		console.log('Response from server:');
		console.log(error.response.url);
		console.log(error.response.body.ExceptionMessage);
		console.log(error.response.body);
	}
	console.log('***************************');
	res.render('error_page', { message: `System error. Please contact support (error code ${response.statusCode}).` });

}


module.exports = handleError;