const queries 	= require('./queries');

// Order for views
const categories_map = [
['data', 'Data driven FSA'],
['cap', 'Developing our digital capability'],
['ser', 'Digital services development and support'],
['it', 'Evergreen IT'],
['res', 'Protecting data and business resilience'],
['sm', 'IT Service improvements']
]

const phases_map = [
['backlog', 'Backlog'],
['discovery','Discovery'],
['alpha','Alpha'],
['beta','Beta'],
['live','Live'],
];

const priorities_order =[
['high','High'],
['medium', 'Medium'],
['low', 'Low']
];

const rag_map = [
['red', 'Red'],
['amb', 'Amber'],
['gre', 'Green'],
['nor', 'No rag']
];

const teams_map = [
['Data', 'Data'],
['Digital', 'Digital'],
['KIM', 'KIM'],
['IT', 'IT'],
['', 'Not assigned'],
];

// ODD leads - load from the database
queries.oddleads();

// Exports
exports.categories = categories_map;
exports.phases = phases_map;
exports.priorities = priorities_order;
exports.rags = rag_map;
exports.teams = teams_map;
exports.odd_leads = queries.oddleads();