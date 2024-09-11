const express = require("express");
const bodyParser = require("body-parser");
const formData = require("form-data");
const Mailgun = require("mailgun.js");
const path = require("path");
require("dotenv").config();

const server = express();
const serverPort = 3000;
const mailgunDomain = process.env.MAILGUN_DOMAIN;

const mailgunInstance = new Mailgun(formData);
const mailgunClient = mailgunInstance.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, "public")));

server.post("/subscribeAction", (request, response) => {
  const userEmail = request.body.email;

   mailgunClient.messages
      .create(mailgunDomain, {
        from: "Support Team <support@yourdomain.com>",
        to: [userEmail],
        subject: "Welcome to Our Community!",
        text: "Thank you for joining our community! We're excited to have you on board.",
        html: "<h1>Welcome to Our Community!</h1><p>Thank you for joining us. We're excited to have you on board and look forward to your participation!</p>",
      })
    .then((message) => {
      console.log(message);
      response.send("Welcome email sent!");
    })
    .catch((error) => {
      console.log(error);
      response.status(500).send("Error sending email");
    });
});

server.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});