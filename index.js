const express = require("express");
const mongoose = require("mongoose");

require("./models/User");
const passport = require("./services/passport");
const authRoutes = require("./routes/authRoutes");
const { mongoURI } = require("./config/keys");

mongoose.connect(mongoURI);
const app = express();
app.set("trust proxy", 1);
passport(app);
authRoutes(app);
// require("./routes/authRoutes")(app)  // alternative way to import and use authRoutes in a single line

const PORT = process.env.PORT || 5000;
app.listen(PORT);
