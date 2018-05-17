const Team = require('../models/Team');
const Player = require('../models/Player');
const League = require('../models/League');
const countryList = require('country-list')();

/**
 * GET /teams
 * Teams page.
 */
exports.getTeams = (req, res, next) => {
  const getTeams = Team.find({}).sort({name: 1}).populate('league').exec();
  const getLeagues = League.find({teams: {$not: {$size: 0}}}).sort({name: 1}).exec();

  Promise.all([getTeams, getLeagues])
    .then(results => {

      res.render('teams/teams', {
        title: 'Teams',
				teams: results[0],
        leagues: results[1],
      });
    })
    .catch(err => next(err));
};

/**
 * GET /teams/:id
 * Team page.
 */
exports.getTeam = (req, res, next) => {
  const teamId = req.params.id;
  if (!teamId) res.redirect(index);

  Team.findOne({_id:teamId}, function (err, team) {
  	if (err) return next(err);

    return res.render('teams/team', {
      title: team.name,
      team: team,
	    codeFromCountry: new Player().countryCodes,
    });
  }).populate('league');
};

/**
 * GET /teams/new
 * Post team page.
 */
exports.postTeam = (req, res) => {
	League.find({}).sort({name: 1}).exec((err, leagues) => {
		if (err) return next(err);

		if (!leagues.length) {
			req.flash('info', {msg: 'You must create a league first'});
			return res.redirect('/leagues/new');
		}

		return res.render('teams/post', {
			title: 'Add a team',
			leagues: leagues,
		});
	});
};

/**
 * POST /api/teams
 * Team create.
 */
exports.post = (req, res, next) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('league', 'League cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/teams/new');
  }
  if (req.file === undefined) {
    req.flash('errors', { msg: 'Logo cannot be empty.' });
    return res.redirect('/teams/new');
  }

  const team = new Team({
    name: req.body.name,
    logo: req.file.filename
  });

	League.findOne({_id: req.body.league}, (err, league) => {
		if (err) return next(err);
		team.league = league;

		let save = team.save();
		let update = League.update({_id:req.body.league}, {$push: {teams: team}});
		Promise.all([save, update])
			.then(() => {
				req.flash('success', { msg: `Team ${team.name} was successfully added.` });
				return res.redirect('/teams/new');
			})
			.catch(err => next(err));
	});

};

/**
 * DELETE /api/teams/:id
 * Team delete.
 */
exports.deleteTeam = (req, res, next) => {
  const teamId = req.params.id;
  if (!teamId) res.redirect(index);

  Team.remove({_id:teamId}, function (err) {
    if (err) return next(err);
    req.flash('errors', { msg: 'The team was successfully deleted.' });
    res.send(204);
  });
};
