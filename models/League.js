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

leagueSchema.pre('save', function save(next) {
	const league = this;
	next();
});

leagueSchema.methods.availableCountries = () => {
	return _.filter(countryList.getData(), (country) => [
		'FR', 'GB', 'DE', 'ES', 'IT', 'PT',
		'PL', 'DK', 'TR', 'RU',
		'CZ', 'SI', //Hitpoint
		'RS', 'GR', 'SK', 'RO', 'HR', 'RS', 'HU', 'BG', //Balkans
		'SE', 'NO', 'FI', //Nordic
		'BE', 'NL', 'LU', //Benelux
	].indexOf(country.code) !== -1);
};

const League = mongoose.model('League', leagueSchema);

module.exports = League;
