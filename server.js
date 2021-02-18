require('dotenv').config();
const path 		= require('path');
const express 	= require('express');
var cookieParser = require('cookie-parser')
const session = require('express-session');
//const session	= require('client-sessions');
const flash = require('connect-flash');
const nunjucks = require('nunjucks');
const dateFilter = require('nunjucks-date-filter');

const queries 	= require('./app/queries');
var CronJob = require('cron').CronJob;

const passport = require('passport');
const odd_authenticate = require('./app/authentication');

const morgan = require('morgan');
const favicon = require('serve-favicon');

const app = express();

const port = process.env.PORT || 3100;
const dev	= true;

console.log("Starting Portolio V0.1.5");
if (process.env.NODE_ENV == 'development') {
	console.log("NODE_ENV == 'development'");
}

app.use(express.urlencoded({ extended: true, parameterLimit: 2000 }));
app.use(cookieParser())
app.use(session({
  cookieName: 'session',
  secret: process.env.COOKIE_SECRET,
  duration: 180 * 60 * 1000, // 180 min
  activeDuration: 180 * 60 * 1000, // 180 min
  maxAge: 8*60*60*1000, // 8 hour
  httpOnly: true,
  secure: true,
  ephemeral: true
}));

// Flash middleware
app.use(flash());

// Views & Nunjucks
app.set('view engine', 'html');
var njenv = nunjucks.configure(__dirname + '/app/views', {
	autoescape: true,
	trimBlocks: true,
	lstripBlocks: true,
	watch: true,
	express: app
});
app.set('engine', njenv);

// Set up local vars for template layout
app.use(function (req, res, next) {
	// Read any flashed errors and save
	// in the response locals
	res.locals.error = req.flash('error_msg');

	// Check for simple error string and
	// convert to layout's expected format
	var errs = req.flash('error');
	for (var i in errs) {
		res.locals.error.push({ message: 'An error occurred', debug: errs[i] });
	}

	// Inject identity into view engine
	var engine = res.app.get('engine');
	var identity = req.cookies.identity;
	engine.addGlobal('identity', identity);

	var isLoggedIn = () => identity;

	var hasSuperuserRole = (portfolio) => identity && identity.roles.includes(`${portfolio}.superuser`);
	var hasAdminRole = (portfolio) => identity && (identity.roles.includes(`${portfolio}.admin`) || identity.roles.includes(`${portfolio}.superuser`));
	var hasLeadRole = (portfolio) => identity && identity.roles.includes(`${portfolio}.lead`);
	var hasEditorRole = (portfolio) => identity && (hasAdminRole(portfolio) || hasLeadRole(portfolio) || identity.roles.includes(`${portfolio}.editor`));

	var hasSupplierClaim = () => identity && identity.accessGroup === 'supplier';
	var hasBudgetClaim = () => identity && ['fsa', 'editor', 'admin', 'superuser'].includes(identity.accessGroup);

	engine.addGlobal('isLoggedIn', isLoggedIn);

	engine.addGlobal('hasSuperuserRole', hasSuperuserRole);
	engine.addGlobal('hasAdminRole', hasAdminRole);
	engine.addGlobal('hasEditorRole', hasEditorRole);
	engine.addGlobal('hasLeadRole', hasLeadRole);

	engine.addGlobal('hasSupplierClaim', hasSupplierClaim);
	engine.addGlobal('hasBudgetClaim', hasBudgetClaim);

	engine.addGlobal('currency', x => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "));

	next();
});



function getProjectDateFormat(flag) {
	var format = "DD MMM YY";
	if (flag === "day") format = "DD MMM YY";
	else if (flag === "month") format = "MMM YYYY";
	else if (flag === "year") format = "YYYY";
	return format;
}
njenv.addGlobal("getProjectDateFormat", getProjectDateFormat);
dateFilter.setDefaultFormat('DD MMM YYYY');
dateFilter.install(njenv, 'date');

app.use(morgan('dev'));

if (dev) {
  var chokidar = require('chokidar');
  chokidar.watch('./app', {ignoreInitial: true}).on('all', (event, path) => {
    console.log("Clearing /app/ module cache from server");
    Object.keys(require.cache).forEach(function(id) {
      if (/[\/\\]app[\/\\]/.test(id)) delete require.cache[id];
    });
  });
}

// Middleware to serve static assets
[
  '/app/img',
  '/app/styles'
].forEach((folder) => {
  app.use('/public', express.static(path.join(__dirname, folder)));
});

// send assetPath to all views
app.use(function (req, res, next) {
  res.locals.asset_path = "/public/";
  next();
});

// Cron job to mark old completed projects as archived
// Only run on production server

if (process.env.CRON) {
	const job = new CronJob(process.env.CRON, async () => {
		try {
			var response = await queries.portfolio_archive('odd');
			var summary = response.body;
			console.log(`Auto archiving - rows affected: ${summary.projectIds.length}`);
		}
		catch (error) {
			console.log("CRON Archving Job failed...");
			handleError(error);
        }
	});
	job.start();
	console.log("CRON Archving Job started.");
}

// Initialize passport
console.log("Initialising passport");
app.use(passport.initialize());
app.use(passport.session());
app.use(function (req, res, next) {
	// Set the authenticated user in the
	// template locals
	if (req.user) {
		res.locals.user = req.user.profile;
	}
	next();
});

odd_authenticate.configurePassport();


// Router
var router = require('./app/routes.js');
var authrouter = require('./routes/auth.js');
var suppliersrouter = require('./routes/suppliers.js');
const { handleError } = require('./app/error');



app.use("/", router);
app.use("/auth", authrouter);
app.use("/", suppliersrouter);

//-------------------------------------------------------------------
// Error handling
//-------------------------------------------------------------------

/*Handle 404s*/
app.use(function (req, res, next) {
  res.status(404).render('error_page', {"message":"Requested page does not exist."})
})

app.use(function (req, res, next) {
  res.status(500).render('error_page', {"message":"Something went wrong."})
})


// start the app
app.listen(port, () => {
  console.log('Listening on port ' + port);
});

