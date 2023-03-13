const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { googleClientID, googleClientSecret } = require("../config/keys");

// console.developers.google.com
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: "http://localhost:5000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("accessToken:", accessToken);
      console.log("refreshToken:", refreshToken);
      console.log("profile:", profile);
    }
  )
);
