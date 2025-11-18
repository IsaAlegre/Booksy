import type { Request, Response, NextFunction } from "express";
import { register, login, requestPasswordReset, resetPassword } from "./authService.js";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { RegisterUserDto } from "./dtos/register-user.dto.js";
import { LoginUserDto } from "./dtos/login-user.dto.js";
import { userService } from "../users/userService.js";


export async function handleRegister(req: Request, res: Response, next: NextFunction) {
  try {
    // 1. Convierte el objeto plano (req.body) a una instancia de nuestro DTO
    const registerDto = plainToInstance(RegisterUserDto, req.body);

    // 2. Valida la instancia del DTO
    const errors = await validate(registerDto);

    // 3. Si hay errores, devuelve una respuesta 400
    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    // 4. Si todo está bien, llama al servicio con el DTO validado
    const newUser = await register(registerDto);
    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
}

export async function handleLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const loginDto = plainToInstance(LoginUserDto, req.body);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const result = await login(loginDto);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function handleMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userPayload = (req as any).user;
    const userId = userPayload?.userId ?? userPayload?.userId;
    if (!userId) return res.status(401).json({ message: "No autorizado" });

    const user = await userService.findById(Number(userId));
    if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

    // eliminar campos sensibles
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...safeUser } = user as any;
    return res.json(safeUser);
  } catch (error) {
    next(error);
  }
}

export async function handleForgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "El correo es obligatorio." });
    }
    await requestPasswordReset(email);
    // Siempre enviamos una respuesta genérica por seguridad
    res.json({ message: "Si existe una cuenta con ese correo, se ha enviado un enlace de reseteo." });
  } catch (error) {
    next(error);
  }
}

export async function handleResetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!token) {
      return res.status(400).json({ message: "El token de reseteo es obligatorio." });
    }

    if (!password) {
      return res.status(400).json({ message: "La nueva contraseña es obligatoria." });
    }

    await resetPassword(token, password);
    res.json({ message: "La contraseña ha sido actualizada exitosamente." });
  } catch (error) {
    next(error);
  }
}


