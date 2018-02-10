const Team = require('../models/Team');

/**
 * GET /teams
 * Teams page.
 */
exports.getTeams = (req, res) => {
  Team.find({}, function (err, teams) {
    if (err) return next(err);

    res.render('teams/teams', {
      title: 'Teams',
      teams: teams
    });
  });
};

/**
 * GET /teams/:id
 * Team page.
 */
exports.getTeam = (req, res) => {
  const teamId = req.params.id;
  
  if (!teamId) res.redirect(index);

  Team.findOne({_id:teamId}, function (err, team) {
    res.render('teams/team', {
      title: team.name,
      team: team
    });
  });
};

/**
 * GET /teams/new
 * Post team page.
 */
exports.postTeam = (req, res) => {
  res.render('teams/post', {
    title: 'Ajouter une équipe'
  });
};

/**
 * POST /team
 * Team create.
 */
exports.post = (req, res) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('region', 'Region cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/teams/new');
  }

  const team = new Team({
    name: req.body.name,
    region: req.body.region,
    logo: req.file.filename
  });

  Team.findOne({name: req.body.name}, (err, existingTeam) => {
    if (err) return next(err);
    if (existingTeam) {
      req.flash('errors', { msg: 'A team with that name already exists.' });
      return res.redirect('/teams/new');
    }

    team.save((err, team) => {
      if (err) return next(err);
      res.redirect('/teams/' + team._id);
    });
  });
};