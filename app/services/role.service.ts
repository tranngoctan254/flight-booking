import { Role } from "@prisma/client";
import { models } from "../../models/prisma";

class RoleService {
  async createRole(name: string): Promise<Role> {
    return await models.role.create({
      data: { name },
    });
  }

  async getAllRoles(): Promise<Role[]> {
    return await models.role.findMany();
  }

  async getRoleById(id: number): Promise<Role | null> {
    return await models.role.findUnique({
      where: { id },
    });
  }
}

export default new RoleService();
