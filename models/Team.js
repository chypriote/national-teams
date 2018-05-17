const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  logo: String,

  league: {
  	type: mongoose.Schema.Types.ObjectId,
    ref: 'League',
    require: true,
  },
  players: [],
}, { timestamps: true });

teamSchema.pre('save', function save(next) {
  const team = this;
  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
