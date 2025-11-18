import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, 
  port: 465,
  secure: true, // true para el puerto 465, false para otros
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify().then(() => {
  console.log("Nodemailer está listo para enviar correos.");
}).catch(console.error);