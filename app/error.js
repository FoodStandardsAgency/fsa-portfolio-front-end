function handleError(error, res) {
	if (res && error.response) {
		if (error.message) console.log(error.message);
		if (error.response.statusCode == 403) {
			handleUnauthorised(res);
			return true;
		}
		else if (error.response.statusCode == 400) {
			handleBadRequest(res, error.message);
			return true;
		}

	}
	else {

		console.log('***************************');
		var message = "Unknown error."
		var statusCode = "";
		if (error.message) {
			message = error.message;
			console.log(error.message);
		}
		if (error.stack) {
			console.log(error.stack);
		}
		if (error.response) {
			statusCode = ` (error code ${error.response.statusCode})`;
			console.log('Response from server:');
			console.log(error.response.url);
			console.log(error.response.body.ExceptionMessage);
			console.log(error.response.body);
		}
		console.log('***************************');
		res.render('error_page', { message: `System error. Please contact support${statusCode}.` });
		return false;
	}
}


function handleUnauthorised(res, action) {
	res.render('error_page', { message: `You are not authorised to view this page.` });
	if(action)
		console.log(`${action} failed: user is not authorised.`)
	else
		console.log('User not authorised.')
}

function handleBadRequest(res, message) {
	message = message.replace("Response code 400", "");
	res.render('error_page', { message: `There was a problem in the data ${message}` });
}


module.exports = { handleError, handleUnauthorised, handleBadRequest };