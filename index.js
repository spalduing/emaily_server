const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport"); // This simpler way of solving the previous initialize error, buy I'll stick with the way I found

require("./models/User");
const passportService = require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const { mongoURI, cookieKey } = require("./config/keys");

mongoose.connect(mongoURI);
const app = express();
app.set("trust proxy", 1);
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  })
);

// app.use(passport.initialize()); // This simpler way of solving the previous initialize error, buy I'll stick with the way I found
// app.use(passport.session()); // This simpler way of solving the previous initialize error, buy I'll stick with the way I found
passportService(app);

// require("./routes/authRoutes")(app)  // alternative way to import and use authRoutes in a single line
authRoutes(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
