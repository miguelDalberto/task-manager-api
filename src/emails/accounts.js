const apiKey = process.env.MAILGUN_API_KEY
const domain = process.env.DOMAIN;

const mailgun = require("mailgun-js");
const mg = mailgun({apiKey, domain});

const sendWelcomeEmail = (email, name) => {
  const data = {
    from: 'Task Manager App <me@samples.mailgun.org>',
    to: email,
    subject: 'Thanks for joining in!',
    text: `Welcome, ${name}!`
  };
  mg.messages().send(data, (err, body) => {
    if(err)return console.error(err);
  });
}

const sendCancelationEmail = (email, name) => {
  const data = {
    from: 'Task Manager App <me@samples.mailgun.org>',
    to: email,
    subject: 'Goodbye!',
    text: `Goodbye, ${name}! Is there anything that we could have done to have kept you on board?`
  }
  mg.messages().send(data, (err, body) => {
    if(err)return console.error(err);
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail
}