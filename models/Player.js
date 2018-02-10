const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  country: String,
  picture: String,
  position: String,

  twitter: String,
}, { timestamps: true });

/**
 * Password hash middleware.
 */
playerSchema.pre('save', function save(next) {
  const user = this;
  next();
});

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
