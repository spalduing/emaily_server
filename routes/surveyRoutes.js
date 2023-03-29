const _ = require("lodash");
const mongoose = require("mongoose");
const Path = require("path-parser");
const { URL } = require("url");
// const chain = require("lodash/chain");
// const map = require("lodash/map");
// const compact = require("lodash/compact");
// const uniqBy = require("lodash/uniqBy");

const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const parseRecipients = require("../services/survey");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/email_templates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = (app) => {
  // GET
  app.get("/api/surveys", requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id }).select({
      recipients: false,
    });

    res.send(surveys);
  });

  // GET
  app.get("/api/surveys/:surveyId/:choice", requireLogin, async (req, res) => {
    res.send("Thanks for voting!");
  });

  // POST
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

      res.send(user);
    } catch (error) {
      res.status(422).send(error);
    }
  });

  // POST
  app.post("/api/surveys/webhooks", async (req, res) => {
    const path = new Path("/api/surveys/:surveyId/:choice"); // Be careful with the api URI
    const clickEvents = req.body.filter((event) => event.event === "click");

    const events = _.chain(clickEvents)
      .map(({ email, url }) => {
        const match = path.test(new URL(url).pathname);

        if (match) {
          return { email, ...match };
        }
      })
      .compact()
      .uniqBy("email", "surveyId")
      // since we're making an async request to mongo, would be normal to put async await
      // but since this endpoint is receiving stuff from Sendgrid, this service doesn't care
      // and it's not expecting for us to responds anything, so it doesn't matter if we send an
      // immediate response  while the mongo request gets processed.
      // .each(async ({ surveyId, email, choice }) => {
      .each((event) => {
        const { surveyId, email, choice } = event;

        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email, responded: false }, // be careful with the $ decorators
            },
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date(),
          }
        ).exec();
      })
      .value();

    res.send({});
  });
};
