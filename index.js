const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const { googleClientID, googleClientSecret } = require("./config/keys");

const app = express();
// console.developers.google.com
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientID,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/callback",
    },
    (accessToken) => {
      console.log(accessToken);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
