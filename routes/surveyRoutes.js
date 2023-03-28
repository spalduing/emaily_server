const mongoose = require("mongoose");

const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const parseRecipients = require("../services/survey");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/email_templates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.findAll();

    res.send(surveys);
  });

  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const recipientArray = parseRecipients(recipients);

    const survey = await new Survey({
      title,
      subject,
      body,
      recipients: recipientArray,
      dateSent: Date.now(),
      _user: req.user.id,
    });

    const mailer = new Mailer(survey, surveyTemplate(survey));

    try {
      const mail = await mailer.send();
      await survey.save();
      req.user.credits -= 1;
      const user = await req.user.save();

      console.log(survey);
      console.log(mail);

      res.send(user);
    } catch (error) {
      res.status(422).send(error);
    }
  });
};
