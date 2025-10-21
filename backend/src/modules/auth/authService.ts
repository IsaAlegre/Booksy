import { AppDataSource } from "../../config/data_source.js";
import { User } from "../users/userEntity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RegisterUserDto } from "./dtos/register-user.dto.js"; 
import { LoginUserDto } from "./dtos/login-user.dto.js";
import { transporter } from "../../config/mailer.js";
import { MoreThan } from "typeorm";

// Ahora el servicio recibe un DTO validado
export async function register(registerDto: RegisterUserDto) {
    const userRepo = AppDataSource.getRepository(User);
    const { username, email, password } = registerDto;
    const existingUser = await userRepo.findOne({ where: [{ username }, { email }]});
    if (existingUser) {
        throw new Error("Username or email already exists");
      }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = userRepo.create({ username, email, password: hashedPassword });
    await userRepo.save(newUser);
    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
}


export async function login(loginDto: LoginUserDto) {
  const userRepo = AppDataSource.getRepository(User);
  const { username, password } = loginDto;
  const user = await userRepo.findOneBy({ username });
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("FATAL: JWT_SECRET is not configured in the environment.");
  }

  const token = jwt.sign(
    { userId: user.id, username: user.username, role: user.role }, 
    jwtSecret,
    { expiresIn: "1h" }
  );
  const { password: _, ...safeUser } = user as any
  return { token, user: safeUser };
}

export async function requestPasswordReset(email: string) {
  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOneBy({ email });

  // Por seguridad, no revelamos si el usuario existe o no.
  if (!user) {
    console.log(`Intento de reseteo para email no existente: ${email}`);
    return;
  }

  // 1. Generar un token seguro
  const resetToken = crypto.randomBytes(32).toString("hex");

  console.log(`Token de reseteo para ${user.email}: ${resetToken}`);

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 2. Establecer una fecha de expiración (ej. 10 minutos)
  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  await userRepository.save(user);

  // 3. Enviar el correo
  const resetURL = `http://localhost:5173/api/reset-password/${resetToken}`; // URL del frontend

  const mailOptions = {
    from: '"Booksy" <no-reply@booksy.com>',
    to: user.email,
    subject: "Reseteo de contraseña para Booksy",
    html: `<p>Has solicitado un reseteo de contraseña.</p>
           <p>Haz clic en este <a href="${resetURL}">enlace</a> para establecer una nueva contraseña.</p>
           <p>Si no solicitaste esto, por favor ignora este correo.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function resetPassword(token: string, newPassword: string) {
  // 1. Hashear el token que viene del usuario para buscarlo en la BD
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const userRepository = AppDataSource.getRepository(User);
  const user = await userRepository.findOne({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: MoreThan(new Date()), // Comprueba que no haya expirado
    },
  });

  if (!user) {
    throw new Error("El token es inválido o ha expirado.");
  }

  // 2. Actualizar la contraseña
  user.password = await bcrypt.hash(newPassword, 10);

  // 3. Invalidar el token
  user.passwordResetToken = null;
  user.passwordResetExpires = null;

  await userRepository.save(user);
}