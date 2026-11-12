import { PrismaClient, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) before seeding.");
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    update: { passwordHash, role: UserRole.SUPER_ADMIN, active: true },
    create: { name: "Store Administrator", email, passwordHash, role: UserRole.SUPER_ADMIN }
  });

  const categorySeeds = [
    ["Lighting", "អំពូលភ្លើង", "lighting"],
    ["Wires & Cables", "ខ្សែភ្លើង", "wires-cables"],
    ["Switches & Sockets", "កុងតាក់ និងព្រីភ្លើង", "switches-sockets"],
    ["Protection", "ឧបករណ៍ការពារ", "protection"],
    ["Security & CCTV", "សុវត្ថិភាព និង CCTV", "security-cctv"],
    ["Tools", "ឧបករណ៍ជាង", "tools"],
    ["Electronics", "អេឡិចត្រូនិក", "electronics"]
  ];
  for (const [name, nameKm, slug] of categorySeeds) {
    await prisma.category.upsert({ where: { slug }, update: { name, nameKm }, create: { name, nameKm, slug } });
  }
  console.log("Seed complete: admin user and 7 categories.");
}

main().catch(error => { console.error(error); process.exit(1); }).finally(async () => prisma.$disconnect());
