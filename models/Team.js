const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  region: String,
  logo: String,

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

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
