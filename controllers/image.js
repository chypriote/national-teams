
exports.getTeamLogo = (req, res) => {
  const file = req.params.file;

  if (!teamId) res.redirect(index);

  res.render('teams/team', {
    title: 'Team',
    id: teamId
  });
};