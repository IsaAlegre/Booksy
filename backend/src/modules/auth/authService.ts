import { AppDataSource } from "../../config/data_source.js";
import { User } from "../users/userEntity.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RegisterUserDto } from "./dtos/register-user.dto.js"; 
import { LoginUserDto } from "./dtos/login-user.dto.js";


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


