const nodeMailer = require("nodemailer");
require("dotenv").config();

const mailSender = async (email, title, body) => {
  try {
    
    const transporter = nodeMailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    try {
      const info = await transporter.sendMail({
        from: "abtyagi15.developer@gmail.com",
        to: `${email}`,
        subject: `${title}`,
        html: `${body}`,
      });
      return info;
    } catch (error) {
      console.log("Error in the info", error);
    }
  } catch (err) {
    console.log("This is mail sender error message", err.message);
  }
};

module.exports = mailSender;
