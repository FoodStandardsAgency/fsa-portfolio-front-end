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
	//res.render('error_page', { message: `System error. Please contact support (error code ${error.response.statusCode}).` });
}


function handleUnauthorised(res, action) {
	res.render('error_page', { message: `You are not authorised to view this page.` });
	if(action)
		console.log(`${action} failed: user is not authorised.`)
	else
		console.log('User not authorised.')
	res.end();

}


module.exports = { handleError, handleUnauthorised };