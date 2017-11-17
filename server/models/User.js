const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const UserSchema = new Schema({
  username: String,
  password: String,
  name: String,
  role: { type: String, required: true },
  facebookId: String,
  googleId: String,
  game: { type: Schema.Types.ObjectId, ref: 'Game' },
});

UserSchema.methods.comparePassword = function(candidatePassword) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
      if (err) return reject(err);
      resolve(isMatch);
    });
  });
};

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(function(err, salt) {
    if (err) return next(err);

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', UserSchema);
