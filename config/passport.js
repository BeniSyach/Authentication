const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/User");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/oauth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName } = profile;
      const email = emails[0].value;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name: displayName,
            email,
            googleId: id,
            isVerified: true,
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/oauth/facebook/callback",
      profileFields: ["id", "displayName", "emails"],
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName } = profile;
      const email = emails[0].value;
      try {
        let user = await User.findOne({ email });
        if (!user) {
          user = new User({
            name: displayName,
            email,
            facebookId: id,
            isVerified: true,
          });
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => done(err, user));
});
