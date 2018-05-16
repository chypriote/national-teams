const Player = require('../models/Player');
const Team = require('../models/Team');

exports.postPlayer = (req, res) => {
  const player = new Player;
  const team = new Team;
  res.render('players/post', {
    title: 'Ajouter un joueur',
    roles: player.availableRoles(),
    regions: team.availableRegions(),
    countries: player.availableCountries(),
  });
};

exports.post = (req, res) => {
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
    teamId: req.body.team,
  });

  Player.findOne({name: req.body.name}, (err, existingPlayer) => {
    if (err) return next(err);
    if (existingPlayer) {
      req.flash('errors', { msg: 'A player with that name already exists.' });
      return res.redirect('/players/new');
    }

    player.save((err, player) => {
      if (err) return next(err);
      Team.update({_id: req.body.team}, {$push: {'players': player}}, (err) => {
        if (err) return next(err);

        req.flash('success', { msg: 'Player was successfully added.' });
        return res.redirect('/players/new');
      });
    });
  });
};
