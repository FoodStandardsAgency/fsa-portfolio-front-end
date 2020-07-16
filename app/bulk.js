const queries 	= require('./queries');

const fs 				= require('fs'); 
const multer			= require('multer');
const csv 				= require('fast-csv'); 
const upload 			= multer({ dest: 'tmp/csv/' });

function bulk(req, res, table) {

	var counter = [];
	
	csv.fromPath(req.file.path)
	
    .on("data", function (data) {
	
	// Test if this row should be inserted
	
	if(data[24] == 'x') {
		
	// Run insert query to insert each row into the database
	var text = 'INSERT INTO '.concat(table,'(project_id, project_name, start_date, short_desc, phase, category, subcat, rag, update, oddlead, oddlead_email, servicelead, servicelead_email, priority_main, funded, confidence, priorities, benefits, criticality, budget, spent, documents, link, pgroup, toupdate, rels, team, onhold, expend, hardend, actstart) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31)');
	const values = data;
	
	counter.push('row');
	
	queries.generic_query(text, values)
	.then(console.log("Insert run"))
	.catch();
	
	}
    })
	
    .on("end", function () {
	  //Remove the temp file
      fs.unlinkSync(req.file.path);   
	  rows = counter.length;
	       	  
	  // Redirect to confirmation page
		res.render('upload-conf', {
		"form": "test",
		"rows": rows,
		})
    });

}

module.exports = bulk;