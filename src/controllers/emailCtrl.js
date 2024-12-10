const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendEmail = asyncHandler(async (data, req, res) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.MAIL_ID,
      pass: Process.env.MAIL_PASS,
    },
  });
  let info = await transporter.sendMail({
    from: "developer's Corner",
    to: data.to,
    subject: data.subject,
    text: data.text,
    html: data.hmtl,
  });
  console.log("Message Send: ", info.messageId);
  console.log("privie Url: ", nodemailer.getTestMessageUrl(info));
});

module.exports = sendEmail;
