const mongoose = require('mongoose');
const _ = require('lodash');

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  region: String,
  logo: String,

  players: [],

  facebook: String,
  twitter: String,
  website: String,
  lolesport: String,
  esl: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
teamSchema.pre('save', function save(next) {
  const team = this;
  next();
});

teamSchema.methods.availableRegions = () => {
  return [
    {value: 'france', name: 'Open Tour (FR)', logo: 'fr'},
    {value: 'germany', name: 'ESL Meisterschaft (DE)', logo: 'de'},
    {value: 'united_kingdom', name: 'ESL Premiership (UK)', logo: 'uk'},
    {value: 'spain', name: 'SuperLiga Orange (ESP)', logo: 'esp'},
    {value: 'portugal', name: 'Moche LPL (POR)', logo: 'por'},
    {value: 'italy', name: 'PG Nationals Predator (ITA)', logo: 'ita'},
    {value: 'poland', name: 'ESL Mistrzostwa Polski (POL)', logo: 'pol'},
    {value: 'nordic', name: 'Nordic Championship (NOR)', logo: 'nor'},
    {value: 'cz_slovakia', name: 'Hitpoint Masters (CZK)', logo: 'czs'},
    {value: 'balkan', name: 'Esports Balkan League (BLK)', logo: 'blk'},
  ];
};

teamSchema.methods.regionInfos = (value) => {
  return _.find(teamSchema.methods.availableRegions(), (region) => {
    return region.value === value;
  });
};

teamSchema.methods.regionName = function (region) {
  switch (region) {
    case 'france':
      return 'Open Tour (FR)';
    case 'germany':
      return 'ESL Meisterschaft';
    case 'united_kingdom':
      return 'ESL Premiership';
    case 'spain':
      return 'SuperLiga Orange';
    case 'portugal':
      return 'Moche LPL';
    case 'italy':
      return 'PG Nationals Predator';
    case 'poland':
      return 'ESL Mistrzostwa Polski';
    case 'nordic':
      return 'Nordic Championship';
    case 'cz_slovakia':
      return 'Hitpoint Masters';
    case 'balkan':
      return 'Esports Balkan League';
    default:
      return;
  }
};

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
