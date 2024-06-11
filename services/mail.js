import nodemailer from "nodemailer";
import "dotenv/config";

const port = process.env.PORT || 8000;

const transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

const sendMail = async (emailData) => {
  try {
    await transport.sendMail({ from: process.env.MAIL_SENDER, ...emailData });
    return true;
  } catch (error) {
    return false;
  }
};

const registerTemplate = ({ email, verificationToken }) => {
  const link = `http://localhost:${port}/users/verify/${verificationToken}`;

  return {
    to: email,
    subject: "Confirm email for Contacts App",
    html: `<h2>Welcome to the Contacts App</h2><p>To confirm your email please click on the <a href=${link}>link</a></p>`,
    text: `Welcome to the Contacts App
          To confirm your email please open the link ${link}`,
  };
};

export default { sendMail, registerTemplate };
