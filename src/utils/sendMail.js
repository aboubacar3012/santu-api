const nodemailer = require("nodemailer");

const sendMail = async ({ to, subject, text, html }) => {
  console.log("sendMail", to, subject, text, html);
  // pour créer un password gmail : rechercher directement dans les paramètres google "key app" et créer un mot de passe spécifique pour l'app
  const options = {
    service: "gmail",
    host: "smtp.gmail.com",
    port:465,
    secure: true,
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  };

  const transporter = nodemailer.createTransport(options);

  const mailOptions = {
    from: process.env.MAIL,
    to,
    subject,
    text,
    html,
  };

  // Envoyer l'e-mail
  await transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("E-mail envoyé: " + info.response);
    }
  });
};

module.exports = { sendMail };