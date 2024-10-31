import prisma, { models } from ".";
import RoleService from "../../app/services/role.service";

async function main() {
  const roles = ["Admin", "Manager", "Sale", "Customer"];

  for (const roleName of roles) {
    const existingRole = await models.role.findUnique({
      where: { name: roleName },
    });

    if (!existingRole) {
      await RoleService.createRole(roleName);
      console.log(`Created role: ${roleName}`);
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
