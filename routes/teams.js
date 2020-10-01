var express = require('express');
var queries = require('./../app/queries');
var login = require('./../app/login');
var router = express.Router();

router.get('/unmatched', login.requireLogin, function (req, res) {
	if (req.session.user == 'portfolio') {
		queries.unmatched_leads()
			.then((result) => {
				res.render('odd_people_unmatched', {
					"data": result.rows,
					"count": result.rowCount,
					"sess": req.session,
				})
			})
			.catch();
	}
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
});

router.get('/view', login.requireLogin, function (req, res) {
	if (req.session.user == 'portfolio') {
		queries.odd_people()
			.then((result) => {

				if (result.rowCount > 0) {
					res.render('odd_people_all', {
						"data": nestedGroupBy(result.rows, ['g6team']),
						"count": result.rowCount,
						"teams": config.teams,
						"sess": req.session,
					})
				}
				else { res.redirect('/') }
			})
			.catch();
	}
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
})

router.get('/add', login.requireLogin, function (req, res) {
	if (req.session.user == 'portfolio') { res.render('add_odd_person', { "msg": "Add", "action": "/odd_people/add-odd" }) }
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
});

router.get('/update/:id', login.requireLogin, function (req, res) {
	if (req.session.user == 'portfolio') {
		var text = 'select * from odd_people where id = $1'
		var values = [req.params.id]

		queries.generic_query(text, values)
			.then((result) => {

				if (result.rowCount == 1) {
					res.render('add_odd_person', { "data": result.rows[0], "msg": "Update", "action": "/odd_people/edit-odd" })
				}

				else res.render('add_odd_person', { "msg": "Add" })
			})
			.catch();
	}
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
})

router.get('/delete/:id', login.requireLogin, function (req, res) {
	if (req.session.user == 'portfolio') {
		var text = 'select * from odd_people where id = $1';
		var values = [req.params.id]

		queries.generic_query(text, values)
			.then((result) => {

				if (result.rowCount = 1) {
					res.render('odd_people_delete_conf', { "data": result.rows[0] })
				}
				else res.redirect('/');
			})
			.catch()
	}
	else { res.render('error_page', { message: 'You are not authorised to view this page' }); }
})

router.post('/add-odd', login.requireLogin, function (req, res) {
	var surname = xss(req.body.surname)
	var firstname = xss(req.body.firstname)
	var email = xss(req.body.email)
	var g6team = xss(req.body.g6team)

	var values = [surname, firstname, email, g6team];
	var text = 'insert into odd_people (surname, firstname, email, g6team) values ($1, $2, $3, $4)';

	queries.generic_query(text, values).then();

	setTimeout(function () { res.redirect('/odd_people/view') }, 1000);

});

router.post('/edit-odd', login.requireLogin, function (req, res) {
	var surname = xss(req.body.surname)
	var firstname = xss(req.body.firstname)
	var email = xss(req.body.email)
	var g6team = xss(req.body.g6team)
	var recordid = xss(req.body.recordid)

	var values = [surname, firstname, email, g6team, recordid];
	var text = 'UPDATE odd_people set surname=$1, firstname=$2, email=$3, g6team=$4 where id = $5';

	queries.generic_query(text, values).then(console.log("update query run"));

	setTimeout(function () { res.redirect('/odd_people/view') }, 1000);

})

router.post('/delete-odd', login.requireLogin, function (req, res) {
	var text = 'delete from odd_people where id = $1'
	var values = [req.body.recordid]

	queries.generic_query(text, values).then();

	setTimeout(function () { res.redirect('/odd_people/view') }, 1000);

})

module.exports = router;