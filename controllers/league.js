const League = require('../models/League');
const countryList = require('country-list')();

/**
 * GET /leagues
 * Leagues page.
 */
exports.getLeagues = (req, res, next) => {
  League.find({}).sort({ name: 1 }).exec((err, leagues) => {
    if (err) return next(err);

    res.render('leagues/leagues', {
      title: 'Leagues',
      leagues,
    });
  });
};

/**
 * GET /leagues/:id
 * League page.
 */
exports.getLeague = (req, res, next) => {
  const leagueId = req.params.id;
  if (!leagueId) res.redirect('index');

  League.findOne({ _id: leagueId }).exec((err, league) => {
    if (err) return next(err);

    res.render('leagues/league', {
      title: league.name,
      league,
      teams: league.teams,
      countryCode: countryList.getCode,
    });
  });
};

/**
 * GET /leagues/new
 * Post team page.
 */
exports.postLeague = (req, res) => {
  const league = new League();
  res.render('leagues/post', {
    title: 'Add a league',
    countries: league.availableCountries(),
  });
};

/**
 * POST /api/leagues
 * League create.
 */
exports.post = (req, res, next) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('countries', 'Countries cannot be empty').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/leagues/new');
  }
  if (req.file === undefined) {
    req.flash('errors', { msg: 'Logo cannot be empty.' });
    return res.redirect('/leagues/new');
  }

  const league = new League({
    name: req.body.name,
    countries: req.body.countries,
    logo: req.file.filename,
    leaguepedia: req.body.leaguepedia,
    website: req.body.website,
  });

  league.save((err, team) => {
    if (err) {
      if (err.code && err.code === 11000) {
        req.flash('errors', { msg: 'League name already exists.' });
        return res.redirect('/leagues/new');
      }

      return next(err);
    }

    return res.redirect(`/leagues/${team._id}`);
  });
};

/**
 * DELETE /api/leagues/:id
 * League delete.
 */
exports.deleteLeague = (req, res, next) => {
  const leagueId = req.params.id;
  if (!leagueId) res.redirect('index');

  League.remove({ _id: leagueId }, (err) => {
    if (err) return next(err);
    req.flash('errors', { msg: 'The league was successfully deleted.' });
    res.send(204);
  });
};

/**
 * GET /leagues/:id/teams
 * League teams.
 */
exports.getTeamsForLeague = (req, res) => {
  const league = req.params.id;
  League.findOne({ _id: league }, (err, league) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(league.teams));
  });
};
