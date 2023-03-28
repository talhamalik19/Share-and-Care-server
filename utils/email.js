import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';

export const sendForgotPasswordEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '304227548d02e2',
      pass: '629b65871170a9',
    },
  });

  fs.readFile(
    path.join(process.cwd(), 'templates', 'password-reset.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const template = Handlebars.compile(data);
        const replacements = {
          OTP: otp,
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
          from: 'shareandcare@gmail.com',
          to: email,
          subject: 'Password Reset',
          text: '',
          html: htmlToSend,
        };
        await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info);
            }
          });
        });
      }
    }
  );
};

export const sendResourceApprovedEmail = async (resource) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: '304227548d02e2',
      pass: '629b65871170a9',
    },
  });

  const { requestedByEmail: email1, approvedByEmail: email2 } = resource;

  fs.readFile(
    path.join(process.cwd(), 'templates', 'resource-approved.html'),
    'utf8',
    async (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const template = Handlebars.compile(data);
        const replacements = {
          resource: resource.resourceName,
          quantity: resource.resourceQuantity,
          duration: resource.resourceDuration,
          notes:
            resource.resourceNotes.trim() === ''
              ? 'None'
              : resource.resourceNotes,
          approvedByName: resource.approvedByName,
          approvedByEmail: resource.approvedByEmail,
          approvedByPhone: resource.approvedByPhone,
          requestedByName: resource.requestedByName,
          requestedByEmail: resource.requestedByEmail,
          requestedByPhone: resource.requestedByPhone,
          requestedByAddress: resource.requestedByAddress,
        };
        const htmlToSend = template(replacements);
        const mailOptions = {
          from: 'shareandcare@gmail.com',
          to: [email1, email2],
          subject: 'Resource Request Approved!',
          text: '',
          html: htmlToSend,
        };
        await new Promise((resolve, reject) => {
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
              reject(error);
            } else {
              console.log('Email sent: ' + info.response);
              resolve(info);
            }
          });
        });
      }
    }
  );
};
