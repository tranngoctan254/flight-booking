import { Request, Response } from "express";
import UserService from "../services/user.service";

export class UserController {
  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const roleId = req.body.roleId || 4;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const user = await UserService.createUser({
        name,
        email,
        password,
        roleId,
      });

      res.status(201).json({
        message: "User created successfully",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          roleId: user.roleId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: "Email and password are required" });
      }

      const token = await UserService.login(email, password);

      res.status(200).json({
        message: "Login successful",
        token,
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const user = await UserService.getUserById(id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role.name,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const { name, email, password, roleId } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const updatedUser = await UserService.updateUser(id, {
        name,
        email,
        password,
        roleId,
      });

      res.status(200).json({
        message: "User updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          roleId: updatedUser.roleId,
          createdAt: updatedUser.createdAt,
          updatedAt: updatedUser.updatedAt,
        },
      });
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ message: "Email already exists" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }

      const deletedUser = await UserService.deleteUser(id);

      res.status(200).json({
        message: "User deleted successfully",
        user: {
          id: deletedUser.id,
          name: deletedUser.name,
          email: deletedUser.email,
          roleId: deletedUser.roleId,
          createdAt: deletedUser.createdAt,
          updatedAt: deletedUser.updatedAt,
        },
      });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }

  async searchUsers(req: Request, res: Response) {
    try {
      const { searchTerm } = req.query;

      if (!searchTerm || typeof searchTerm !== "string") {
        return res
          .status(400)
          .json({ message: "Search term query parameter is required" });
      }

      const users = await UserService.searchUsers(searchTerm);

      res.status(200).json({ users });
    } catch (error: any) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}
