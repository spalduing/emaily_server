const express = require("express");

require("./services/passport");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.set("trust proxy", 1);
authRoutes(app);
// require("./routes/authRoutes")(app)  // alternative way to import and use authRoutes in a single line

const PORT = process.env.PORT || 5000;
app.listen(PORT);
