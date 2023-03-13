const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const mongoose = require("mongoose");

const { googleClientID, googleClientSecret } = require("../config/keys");

const User = mongoose.model("users");

// console.developers.google.com

module.exports = (app) => {
  passport.use(
    new GoogleStrategy(
      {
        clientID: googleClientID,
        clientSecret: googleClientSecret,
        callbackURL: "http://localhost:5000/auth/google/callback",
        userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log("accessToken:", accessToken);
        console.log("refreshToken:", refreshToken);
        console.log("profile:", profile);

        const user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const newUser = await new User({ googleId: profile.id })
            .save()
            .then((user) => done(null, user));
        } else {
          console.log("This user is created already!");
          done(null, user);
        }
      }
    )
  );
  app.use(passport.initialize());
};
