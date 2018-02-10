/**
 * GET /teams
 * Teams page.
 */
exports.getTeams = (req, res) => {
  res.render('teams/teams', {
    title: 'Teams'
  });
};

/**
 * GET /teams/:id
 * Team page.
 */
exports.getTeam = (req, res) => {
  const teamId = req.params.id;
  
  if (!teamId) res.redirect(index);

  res.render('teams/team', {
    title: 'Team',
    id: teamId
  });
};

/**
 * GET /team/new
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

  req.flash('success', { msg: 'Team has been posted successfully!' });
  res.redirect('/teams');
};