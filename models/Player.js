const mongoose = require('mongoose');
const _ = require('lodash');

const playerSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  country: String,
  picture: String,
  role: String,

  teamId: String,

  twitter: String,
}, { timestamps: true });

playerSchema.methods.availableRoles = () => {
  return [
    {value: 'top', name: 'Top'},
    {value: 'jungle', name: 'Jungle'},
    {value: 'mid', name: 'Mid'},
    {value: 'adc', name: 'AD Carry'},
    {value: 'support', name: 'Support'},
  ];
};

playerSchema.methods.availableCountries = () => {
  return [
    {value: 'france', name: 'France', code: 'fr'},
    {value: 'germany', name: 'Allemagne', code: 'de'},
    {value: 'united_kingdom', name: 'Royaume Uni', code: 'gb'},
    {value: 'danemark', name: 'Danemark', code: 'dn'},
    {value: 'spain', name: 'Espagne', code: 'sp'},
    {value: 'serbia', name: 'Serbie', code: 'rs'},
    {value: 'poland', name: 'Pologne', code: 'pl'},
    {value: 'portugal', name: 'Portugal', code: 'pt'},
    {value: 'estonia', name: 'Estonie', code: 'ee'},
    {value: 'netherlands', name: 'Pays-Bas', code: 'nl'},
    {value: 'israel', name: 'Israel', code: 'il'},
    {value: 'sweden', name: 'Suède', code: 'sw'},
    {value: 'hungary', name: 'Hongrie', code: 'hu'},
    {value: 'ukraine', name: 'Ukraine', code: 'ua'},
    {value: 'czech', name: 'République Tchèque', code: 'cz'},
    {value: 'greece', name: 'Grèce', code: 'gr'},
    {value: 'norway', name: 'Norvège', code: 'no'},
    {value: 'slovenia', name: 'Slovenie', code: 'sk'},
    {value: 'belgium', name: 'Belgique', code: 'be'},
    {value: 'romania', name: 'Roumanie', code: 'ro'},
    {value: 'finland', name: 'Finlande', code: 'fi'},
    {value: 'switzerland', name: 'Suisse', code: 'ch'},
    {value: 'austria', name: 'Autriche', code: 'at'},
    {value: 'lithuania', name: 'Lituanie', code: 'lt'},
  ];
};

playerSchema.methods.countryCodes = (region) => {
  let country = _.find(playerSchema.methods.availableCountries(), (country) => {
    return country.value === region;
  });

  return country.code;
};

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
