const mongoose = require('mongoose');
const _ = require('lodash');
const countryList = require('country-list')();

const leagueSchema = new mongoose.Schema({
	name: { type: String, unique: true },
	logo: String,

	countries: [],
	teams: [],

	website: String,
	leaguepedia: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
leagueSchema.pre('save', function save(next) {
	const league = this;
	next();
});

leagueSchema.methods.availableCountries = () => {
	const countries = _.filter(countryList.getData(), (country) => ['FR', 'GB', 'DE', 'ES', 'IT', 'PO', 'PL', 'CZ', 'DK'].indexOf(country.code) !== -1);

	return _.union(countries, [
		{code: 'BNL', name: 'Benelux'},
		{code: 'NOR', name: 'Nordic'},
		{code: 'BLK', name: 'Balkans'},
	]);

	return [
		{code: 'tr', name: 'Turquie'},
		{code: 'russia', name: 'LoL Continental League (RUS)', logo: 'lcl'},
		{code: 'spain', name: 'SuperLiga Orange (ESP)', logo: 'esp'},
		{code: 'germany', name: 'ESL Meisterschaft (DE)', logo: 'de'},
		{code: 'united_kingdom', name: 'ESL Premiership (UK)', logo: 'uk'},
		{code: 'portugal', name: 'Moche LPL (POR)', logo: 'por'},
		{code: 'italy', name: 'PG Nationals Predator (ITA)', logo: 'ita'},
		{code: 'poland', name: 'ESL Mistrzostwa Polski (POL)', logo: 'pol'},
		{code: 'nordic', name: 'Nordic Championship (NOR)', logo: 'nor'},
		{code: 'balkan', name: 'Esports Balkan League (BLK)', logo: 'blk'},
		{code: 'cz_slovakia', name: 'Hitpoint Masters (CZK)', logo: 'czs'},
		{code: 'france', name: 'Open Tour (FR)', logo: 'fr'},
		{code: 'denmark', name: 'League Championship Denmark (DK)', logo: 'dk'},
		{code: 'denmark2', name: 'Challenger Series Denmark (DK)', logo: 'dk'},
		{code: 'benelux', name: 'ESL Benelux Championship (BNL)', logo: 'bnl'},
	];
};

const League = mongoose.model('League', leagueSchema);

module.exports = League;
