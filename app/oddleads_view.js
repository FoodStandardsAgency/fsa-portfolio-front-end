const queries 	= require('./queries');
const config 	= require('./config');
const _ 		= require('lodash');

function nestedGroupBy(data, keys) {
  var grouped = {};
  data.forEach((item) => {
    _.update(grouped,
      keys.map((k) => item[k]).join('.'),
      (val) => val ? (val.push(item), val) : [item]
    );
  });
  
 return grouped;
}

function odd_view(req, res) {
	
	//console.log('In ODD leads view function')

queries.current_projects()
	.then((projects) => {

		config.odd_leads
		.then((oddleads) => {
			
			var odd_leads_arr = [];
			var i = 0;
			
			for(i; i < oddleads.body.length; i++){
				
				var lead = oddleads.body[i].oddlead;
				var string = lead.concat(',',lead);
				var lead_arr = string.split(",");

				odd_leads_arr.push(lead_arr);	
			}
			
					
			res.render('index', {
				"data": 	nestedGroupBy(projects.body, ['oddlead', 'phase']),
				"counts": _.countBy(projects.body, 'phase'),
				"themes": 	odd_leads_arr,
				"phases":	config.phases,
				"sess": req.session
			});
		})  
	})
	.catch();
}

module.exports = odd_view;