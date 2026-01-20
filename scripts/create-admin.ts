import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function createAdmin() {
    const email = "admin@yantraksh.com";
    const password = "Admin@123";
    const name = "Admin User";

    console.log("Creating admin user...");

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log("Admin user already exists!");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        await prisma.$disconnect();
        return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
            userType: "ADMIN",
        },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log(`User ID: ${admin.id}`);

    await prisma.$disconnect();
}

createAdmin().catch((e) => {
    console.error("Error creating admin:", e);
    process.exit(1);
});
