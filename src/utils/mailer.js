import { google } from 'googleapis';
import nodemailer from 'nodemailer';
import dotenv from "dotenv";

dotenv.config();

const oAuth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

export const sendCodeEmail = async (code, to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });
  const subject = 'Código de verificación'
  
  const html = `
    <p>Codigo de verificacion: ${code}</p>
    `;
  return new Promise((resolve, reject) => {
    transport.sendMail({ from: process.env.MY_EMAIL, subject: subject, to: to, html }, (err, info) => {
      if (err) reject(err);
      resolve(info);
    });
  });
};

export const sendRegisterNewVehicle = async (patente, to) => {
  const ACCESS_TOKEN = await oAuth2Client.getAccessToken();
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.MY_EMAIL,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: ACCESS_TOKEN,
    },
    tls: {
      rejectUnauthorized: true,
    },
  });

  const subject = 'Se ha registrado una nueva patente';

  const html = `
    <p>Se ha registrado la siguiente patente: ${patente}</p>
    `;

    return new Promise((resolve, reject) => {
      transport.sendMail({ from: process.env.MY_EMAIL, subject: subject, to: to, html }, (err, info) => {
        if (err) reject(err);
        resolve(info);
      });
    });
};
