const Player = require('../models/Player');
const Team = require('../models/Team');
const League = require('../models/League');

exports.postPlayer = (req, res, next) => {
  const player = new Player();

  League.find({ teams: { $not:  { $size: 0 } } }).sort({ name: 1 }).exec((err, leagues) => {
    if (err) return next(err);

    if (leagues.length === 0) {
      req.flash('info', { msg: 'You must create a league and add teams first' });
      return res.redirect('/leagues/new');
    }

    res.render('players/post', {
      title: 'Add a player',
      roles: player.availableRoles(),
      leagues,
      countries: player.availableCountries(),
    });
  });
};

exports.post = (req, res, next) => {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('country', 'Country cannot be blank').notEmpty();
  req.assert('role', 'Position cannot be blank').notEmpty();
  req.assert('team', 'Team cannot be blank').notEmpty();

  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/players/new');
  }

  const player = new Player({
    name: req.body.name,
    country: req.body.country,
    picture: req.body.picture,
    role: req.body.role,
  });

  Team.findOne({ _id: req.body.team }, (err, team) => {
    if (err) return next(err);
    player.team = team;

    const save = player.save();
    const update = Team.update({ _id: req.body.team }, { $push:  { players: player } });
    Promise.all([save, update])
      .then(() => {
        req.flash('success', { msg: `Player ${player.name} was successfully added.` });
        return res.redirect('/players/new');
      })
      .catch(err => next(err));
  });
};
