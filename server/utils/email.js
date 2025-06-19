const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service: 'gmail',
    auth : {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});
async function sendReminderEmail(student) {
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: student.email,
    subject: 'Stay Active on Codeforces!',
    text: `Hello ${student.name},\n\nWe noticed you haven’t submitted anything on Codeforces in the past 7 days. Keep solving to improve! `,
  };
  await transporter.sendMail(mailOptions);
}

module.exports = { sendReminderEmail };