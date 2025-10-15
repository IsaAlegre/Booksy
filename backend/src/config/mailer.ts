import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // ej. "smtp.gmail.com"
  port: 465,
  secure: true, // true para el puerto 465, false para otros
  auth: {
    user: process.env.EMAIL_USER, // Tu correo electrónico
    pass: process.env.EMAIL_PASS, // La contraseña de aplicación de tu correo
  },
});

transporter.verify().then(() => {
  console.log("Nodemailer está listo para enviar correos.");
}).catch(console.error);