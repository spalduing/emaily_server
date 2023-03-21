const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
// const passport = require("passport"); // This simpler way of solving the previous initialize error, buy I'll stick with the way I found

require("./models/User");
const passportService = require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const billingRoutes = require("./routes/billingRoutes");
const bodyParser = require("body-parser");
const { mongoURI, cookieKey } = require("./config/keys");

mongoose.connect(mongoURI);
const app = express();
app.set("trust proxy", 1);

app.use(bodyParser.json());
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
billingRoutes(app);
// process.env.[ENV_VARIABLE_NAME] will only work on production meaning that you need a special
// library loader (npm package like dotenv) to load environment variables on a dev environment.
const PORT = process.env.PORT || 5000;

app.listen(PORT);
