const League = require('../models/League');
const Player = require('../models/Player');

/**
 * GET /leagues
 * Leagues page.
 */
exports.getLeagues = (req, res, next) => {
	let league = new League;
	League.find({}).sort({name: 1}).exec((err, leagues) => {
		if (err) return next(err);

		res.render('leagues/leagues', {
			title: 'Leagues',
			leagues: leagues
		});
	});
};

/**
 * GET /leagues/:id
 * League page.
 */
exports.getLeague = (req, res) => {
	const leagueId = req.params.id;
	let player = new Player;
	if (!leagueId) res.redirect(index);

	League.findOne({_id:leagueId}, function (err, league) {
		res.render('leagues/league', {
			title: league.name,
			league: league,
			countryCode: player.countryCodes
		});
	});
};

/**
 * GET /leagues/new
 * Post team page.
 */
exports.postLeague = (req, res) => {
	let league = new League;
	res.render('leagues/post', {
		title: 'Ajouter une league',
		countries: league.availableCountries(),
	});
};

/**
 * POST /api/leagues
 * League create.
 */
exports.post = (req, res, next) => {
	req.assert('name', 'Name cannot be blank').notEmpty();

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
		country: req.body.country,
		logo: req.file.filename
	});

	League.findOne({name: req.body.name}, (err, existingLeague) => {
		if (err) return next(err);
		if (existingLeague) {
			req.flash('errors', { msg: 'A league with that name already exists.' });
			return res.redirect('/leagues/new');
		}

		league.save((err, team) => {
			if (err) return next(err);
			res.redirect('/leagues/' + team._id);
		});
	});
};

/**
 * DELETE /api/leagues/:id
 * League delete.
 */
exports.deleteLeague = (req, res, next) => {
	const leagueId = req.params.id;
	if (!leagueId) res.redirect(index);

	League.remove({_id:leagueId}, function (err) {
		if (err) return next(err);
		req.flash('errors', { msg: 'The league was successfully deleted.' });
		res.send(204);
	});
};
