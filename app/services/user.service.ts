import { models } from "@models/prisma";
import { Prisma, User } from "@prisma/client";
import { comparePasswords, hashPassword } from "../utils/hash";
import { generateToken } from "../utils/jwt";

class UserService {
  async createUser(data: {
    name: string;
    email: string;
    password: string;
    roleId: number;
  }): Promise<User> {
    const hashedPassword = await hashPassword(data.password);

    const user = await models.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        roleId: data.roleId,
      },
    });

    return user;
  }

  async getAllUsers(): Promise<
    Prisma.UserGetPayload<{ include: { role: true } }>[]
  > {
    return await models.user.findMany({
      include: { role: true },
    });
  }

  async getUserById(
    id: number
  ): Promise<Prisma.UserGetPayload<{ include: { role: true } }> | null> {
    return await models.user.findUnique({
      where: { id },
      include: { role: true },
    });
  }

  async updateUser(
    id: number,
    data: {
      name?: string;
      email?: string;
      password?: string;
      roleId?: number;
    }
  ): Promise<User> {
    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    return await models.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: number): Promise<User> {
    return await models.user.delete({
      where: { id },
    });
  }

  async login(email: string, password: string): Promise<string> {
    const user = await models.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    const token = generateToken({
      userId: user.id,
      role: user.role.name,
    });

    return token;
  }

  async searchUsers(
    searchTerm: string
  ): Promise<Prisma.UserGetPayload<{ include: { role: true } }>[] | null> {
    return await models.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm } },
          { email: { contains: searchTerm } },
        ],
      },
      include: { role: true },
    });
  }
}

export default new UserService();
