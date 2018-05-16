const Team = require('../models/Team');
const Player = require('../models/Player');
const League = require('../models/League');
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

/**
 * GET /teams
 * Teams page.
 */
exports.getTeams = (req, res, next) => {
  let team = new Team;
  Team.find({}).sort({name: 1}).exec((err, teams) => {
    if (err) return next(err);

    res.render('teams/teams', {
      title: 'Equipes',
      teams: teams,
      regions: team.availableRegions(),
      regionInfos: team.regionInfos
    });
  });
};

/**
 * GET /teams/:id
 * Team page.
 */
exports.getTeam = (req, res) => {
  const teamId = req.params.id;
  let player = new Player;
  if (!teamId) res.redirect(index);

  Team.findOne({_id:teamId}, function (err, team) {
    res.render('teams/team', {
      title: team.name,
      team: team,
      countryCode: player.countryCodes
    });
  });
};

/**
 * GET /teams/new
 * Post team page.
 */
exports.postTeam = (req, res) => {
	let team = new Team;

	League.find({}).sort({name: 1}).exec((err, leagues) => {
		if (err) return next(err);

		res.render('teams/post', {
			title: 'Ajouter une équipe',
			regions: team.availableRegions(),
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
  // req.assert('region', 'Region cannot be blank').notEmpty();

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
    logo: req.file.filename,
    leagueId: req.body.region,
  });

  Team.findOne({name: req.body.name}, (err, existingTeam) => {
    if (err) return next(err);
    if (existingTeam) {
      req.flash('errors', { msg: 'A team with that name already exists.' });
      return res.redirect('/teams/new');
    }
  });

	team.save((err, team) => {
		if (err) return next(err);
		League.update({_id:req.body.region}, {$push: {'teams': team}}, (err) => {
			if (err) return next(err);

			req.flash('success', { msg: 'Team was successfully added.' });
			return res.redirect('/teams/new');
		});
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

exports.getTeamsForRegion = (req, res) => {
  const region = req.params.region;
  Team.find({region: region}, (err, teams) => {
    res.setHeader('Content-Type', 'application/json');
    return res.send(JSON.stringify(teams));
  });
};
