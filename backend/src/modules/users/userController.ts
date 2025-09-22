import type { Request, Response, NextFunction } from "express";
import { userService } from "./userService";

export class UserController {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ message: "Username is required" });
      }
      const newUser = await userService.create(username);
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const idParam = req.params.id;

      // 1. Primero, verifica que el parámetro existe
      if (!idParam) {
        return res.status(400).json({ message: "User ID must be provided in the URL." });
      }

      // 2. Ahora, TypeScript sabe que idParam es un string
      const id = parseInt(idParam, 10);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID format." });
      }

      await userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

}

export const userController = new UserController();