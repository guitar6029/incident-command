import 'dotenv/config';
import { prisma } from '../lib/prisma'; // adjust path if needed
import { EmployeeRole, EmployeeLevel } from '../generated/prisma/client';

const INITIAL_EMPLOYEE_COUNT = 20;
const EMAIL_DOMAIN = 'company.com';

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  const roles = [
    EmployeeRole.IT_HELP,
    EmployeeRole.SYSTEM,
    EmployeeRole.NETWORK,
    EmployeeRole.SRE,
  ];

  const levels = [EmployeeLevel.L1, EmployeeLevel.L2, EmployeeLevel.L3];

  const employees = Array.from({ length: INITIAL_EMPLOYEE_COUNT }).map(
    (_, i) => ({
      name: `Employee ${i + 1}`,
      email: `employee${i + 1}@${EMAIL_DOMAIN}`,
      role: randomFromArray(roles),
      level: randomFromArray(levels),
      active: true,
      onCall: Math.random() > 0.5,
    }),
  );

  await prisma.employee.createMany({
    data: employees,
    skipDuplicates: true, // prevents unique email crash
  });

  console.log(`Seeded ${INITIAL_EMPLOYEE_COUNT} employees`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
