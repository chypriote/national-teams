/**
 * GET /
 * Home page.
 */
exports.index = (req, res) => {
  res.redirect('/teams');
};
