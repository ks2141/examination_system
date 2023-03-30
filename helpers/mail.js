const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
require("dotenv").config();

const transport = nodemailer.createTransport({
  // host: "smtp.ethereal.email",
  // port: 587,
  // secure: false,
  service: "gmail",
  auth: {
    user: process.env.E_USER,
    pass: process.env.E_PASS,
  },
});

exports.MailTemplates = {
  CONFIRM: "confirm.ejs",
  RESULT: "result.ejs",
};

exports.renderTemplate = async (templateName, user, data) => {
  return await ejs.renderFile(
    path.join(__dirname, "..", `/email/${templateName}`),
    { user, data },
    { async: true }
  );
};

exports.sendMail = async (user, subject, emailBody) => {
  return transport.sendMail({
    from: process.env.E_USER,
    to: user.email,
    subject: subject,
    html: emailBody,
  });
};
