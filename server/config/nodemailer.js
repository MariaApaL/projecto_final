// pkozjoxdxzcglxbf
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.goingout@gmail.com',
    pass: 'pkozjoxdxzcglxbf',
  },
});

module.exports = transporter;