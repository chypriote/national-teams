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
    {value: 'germany', name: 'Allemagne', code: 'de'},
    {value: 'armenia', name: 'Arménie', code: 'am'},
    {value: 'austria', name: 'Autriche', code: 'at'},
    {value: 'belgium', name: 'Belgique', code: 'be'},
    {value: 'belarus', name: 'Biélorussie', code: 'by'},
    {value: 'bulgaria', name: 'Bulgarie', code: 'bg'},
    {value: 'korea', name: 'Corée', code: 'kr'},
    {value: 'croatia', name: 'Croatie', code: 'hr'},
    {value: 'danemark', name: 'Danemark', code: 'dk'},
    {value: 'spain', name: 'Espagne', code: 'es'},
    {value: 'estonia', name: 'Estonie', code: 'ee'},
    {value: 'finland', name: 'Finlande', code: 'fi'},
    {value: 'france', name: 'France', code: 'fr'},
    {value: 'greece', name: 'Grèce', code: 'gr'},
    {value: 'hungary', name: 'Hongrie', code: 'hu'},
    {value: 'israel', name: 'Israel', code: 'il'},
    {value: 'italia', name: 'Italie', code: 'it'},
    {value: 'latvia', name: 'Lettonie', code: 'lv'},
    {value: 'lithuania', name: 'Lituanie', code: 'lt'},
    {value: 'moldova', name: 'Moldavie', code: 'md'},
    {value: 'norway', name: 'Norvège', code: 'no'},
    {value: 'netherlands', name: 'Pays-Bas', code: 'nl'},
    {value: 'poland', name: 'Pologne', code: 'pl'},
    {value: 'portugal', name: 'Portugal', code: 'pt'},
    {value: 'czech', name: 'République Tchèque', code: 'cz'},
    {value: 'romania', name: 'Roumanie', code: 'ro'},
    {value: 'russia', name: 'Russie', code: 'ru'},
    {value: 'united_kingdom', name: 'Royaume Uni', code: 'gb'},
    {value: 'serbia', name: 'Serbie', code: 'rs'},
    {value: 'slovenia', name: 'Slovenie', code: 'sk'},
    {value: 'sweden', name: 'Suède', code: 'se'},
    {value: 'switzerland', name: 'Suisse', code: 'ch'},
    {value: 'turkey', name: 'Turquie', code: 'tr'},
    {value: 'ukraine', name: 'Ukraine', code: 'ua'},
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
