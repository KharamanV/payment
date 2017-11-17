const config = require('config');
const router = require('express').Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const {
  Strategy: JwtStrategy,
  ExtractJwt,
} = require('passport-jwt');

passport.use(new LocalStrategy((username, password, done) => (
  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

      return user.comparePassword(password)
        .then(isMatch => isMatch ? done(null, user) : done(null, false, { message: 'Incorrect password.' }))
    })
    .catch(done)
)));

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: config.secrets.jwt,
};

passport.use(new JwtStrategy(opts, (payload, done) => (
  User.findOne({ _id: payload.sub })
    .then(user => done(null, user || false))
    .catch(done)
)));

passport.use(new FacebookStrategy(
  {
    clientID: '124528738191489',
    clientSecret: 'c368dbf94483e868904b309480dcd3ac',
    callbackURL: `http://${config.baseUrl}/api/auth/facebook/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ facebookId: profile.id })
      .then((user) => {
        if (!user) {
          const user = new User({
            facebookId: profile.id,
            name: profile.displayName,
            role: 'player',
          });

          return user.save()
            .then(user => done(null, user));
        }

        return done(null, user);
      })
      .catch(done);
  },
));

passport.use(new GoogleStrategy(
  {
    clientID: '732865366871-dp8jog2htk1bgaqte6heb986lk91mhdb.apps.googleusercontent.com',
    clientSecret: 'tq5TgpcKemwtVP3upOcjOpuY',
    callbackURL: `http://${config.baseUrl}/api/auth/google/callback`,
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({ googleId: profile.id })
      .then((user) => {
        if (!user) {
          const user = new User({
            googleId: profile.id,
            name: profile.displayName,
            role: 'player',
          });

          return user.save()
            .then(user => done(null, user));
        }

        return done(null, user);
      })
      .catch(done);
  },
));

passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser((id, done) => (
  User.findById(id)
    .then(user => done(null, user))
    .catch(done)
));

router.post('/', passport.authenticate('local'), (req, res) => res.json({
  token: jwt.sign({ sub: req.user.id }, config.secrets.jwt),
}));

router.get('/facebook', passport.authenticate('facebook'));
router.get(
  '/facebook/callback',
  passport.authenticate('facebook'),
  (req, res) => {
    const token = jwt.sign({ sub: req.user.id }, config.secrets.jwt);
    return res.redirect(`/?token=${token}`);
  },
);

router.get('/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    const token = jwt.sign({ sub: req.user.id }, config.secrets.jwt);
    return res.redirect(`/?token=${token}`);
  },
);

router.get('/', passport.authenticate('jwt'), (req, res) => {
  User.findById(req.user.id)
    .then(user => res.sendStatus(user ? 200 : 401))
    .catch(console.error);
});

router.get('/name', passport.authenticate('jwt'), (req, res) => {
  User.findById(req.user.id)
    .then(user => {
      if (user) res.json({ name: user.name });
      else res.sendStatus(401);
    })
    .catch(err => console.log(err));
});

router.post('/register', (req, res) => {
  User.findOne({ username: req.body.username })
    .then(user => {
      if (!user) {
        let newUser = new User({
          username: req.body.username,
          password: req.body.password,
          role: 'player',
          name: req.body.name,
          _id: mongoose.Types.ObjectId(),
        });

        newUser.save((err) => {
          if (err) return console.log("didn't save user");
          return res.json({ token: jwt.sign({ sub: newUser.id }, config.secrets.jwt) });
        });
      } else {
        res.sendStatus(409);
      }
    })
    .catch(console.error)
});

module.exports = {
  auth: router,
  security: () => passport.authenticate('jwt', { session: false }),
};
