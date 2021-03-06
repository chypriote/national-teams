/**
 * Module dependencies.
 */
const express = require('express');
const compression = require('compression');
const session = require('express-session');
const bodyParser = require('body-parser');
const logger = require('morgan');
const chalk = require('chalk');
const errorHandler = require('errorhandler');
const lusca = require('lusca');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo')(session);
const flash = require('express-flash');
const path = require('path');
const mongoose = require('mongoose');
const passport = require('passport');
const expressValidator = require('express-validator');
const multer = require('multer');

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env.example' });

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  if (req.method !== 'GET') {
    next();
  } else {
    lusca.csrf()(req, res, next);
  }
});
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
      req.path !== '/login' &&
      req.path !== '/signup' &&
      !req.path.match(/^\/auth/) &&
      !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
      req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
app.use('/assets', express.static(path.join(__dirname, 'uploads'), { maxAge: 31557600000 }));

require('./routing')(app);

/**
 * Front routes
 */
const teamLogoStorage = multer.diskStorage({ destination: path.join(__dirname, 'uploads/teams'), filename(req, file, cb) { cb(null, file.originalname); } });
const leagueLogoStorage = multer.diskStorage({ destination: path.join(__dirname, 'uploads/leagues'), filename(req, file, cb) { cb(null, file.originalname); } });

const teamController = require('./controllers/team');

app.get('/', teamController.getTeams);
app.get('/teams', teamController.getTeams);
app.get('/teams/new', teamController.postTeam);
app.get('/teams/:id', teamController.getTeam);
app.post('/api/teams', multer({ storage: teamLogoStorage }).single('logo'), teamController.post);
app.delete('/api/teams/:id', teamController.deleteTeam);

const playerController = require('./controllers/player');

app.get('/players/new', playerController.postPlayer);
app.post('/api/players', playerController.post);

const leagueController = require('./controllers/league');

app.get('/leagues', leagueController.getLeagues);
app.get('/leagues/new', leagueController.postLeague);
app.get('/leagues/:id', leagueController.getLeague);
app.get('/api/leagues/:id/teams', leagueController.getTeamsForLeague);
app.post('/api/leagues', multer({ storage: leagueLogoStorage }).single('logo'), leagueController.post);
app.delete('/api/leagues/:id', leagueController.deleteLeague);

/**
 * Error Handler.
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'));
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
