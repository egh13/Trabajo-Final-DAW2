import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Tipo local para construir los borradores de log antes de insertar
type LogDraft = {
    level: "INFO" | "ERROR" | "WARNING" | "DEBUG";
    module: string;
    action: string;
    userId?: number | null;
    ip: string;
    createdAt: Date;
    detail?: string;
};

async function main() {
    console.log("Limpiando base de datos... 🧹");
    await prisma.userLog.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();

    console.log("Insertando Categorias... 📁");
    const catZapatillas = await prisma.category.create({
        data: { name: "Zapatillas" }
    });
    const catAccesorios = await prisma.category.create({
        data: { name: "Accesorios" }
    });
    const catRopa = await prisma.category.create({ data: { name: "Ropa" } });

    console.log("Insertando Usuarios... 👥");
    const salt = await bcrypt.genSalt(10);
    await prisma.user.createMany({
        data: [
            {
                name: "Administrador",
                email: "admin@securetenis.com",
                password: await bcrypt.hash("admin123", salt),
                role: "ADMIN"
            },
            {
                name: "Cliente Demo",
                email: "cliente@securetenis.com",
                password: await bcrypt.hash("cliente123", salt),
                role: "CLIENT"
            },
            {
                name: "Analista Seguridad",
                email: "analista@securetenis.com",
                password: await bcrypt.hash("analista123", salt),
                role: "ANALYST"
            }
        ]
    });

    console.log("Insertando Productos... 👟");
    await prisma.product.createMany({
        data: [
            /*
             * ZAPATILLAS
             */
            {
                name: "Secure Boot",
                description: "La bota enfocada en la comodidad y seguridad",
                price: 149.0,
                stock: 20,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778166496/secure-boot.png",
                categoryId: catZapatillas.id
            },
            {
                name: "Secure Oxford",
                description: "Elegancia y seguridad en tus pies",
                price: 89.0,
                stock: 35,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778166531/secure-oxford.png",
                categoryId: catZapatillas.id
            },
            {
                name: "Secure Tenis",
                description: "Seguridad en tu día a día",
                price: 129.0,
                stock: 12,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778166821/ChatGPT_Image_7_may_2026_17_10_46_j6cf1o.png",
                categoryId: catZapatillas.id
            },
            {
                name: "Secure High Tenis",
                description:
                    "Seguridad en tu día a día, pero sin exponer tus tobillos",
                price: 189.0,
                stock: 8,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778166820/ChatGPT_Image_7_may_2026_17_12_25_n30hxr.png",
                categoryId: catZapatillas.id
            },
            {
                name: "Casual Secure",
                description:
                    "Zapatilla casual para lucir en tu trabajo de oficina",
                price: 99.0,
                stock: 25,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778166837/ChatGPT_Image_7_may_2026_17_09_28_q2nxur.png",
                categoryId: catZapatillas.id
            },
            {
                name: "Luxury Slipper",
                description: "Pantuflas con suela anti-resbalones",
                price: 35.0,
                stock: 45,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778167321/ChatGPT_Image_7_may_2026_17_21_08_rzg7f4.png",
                categoryId: catZapatillas.id
            },
            /*
             * ACCESORIOS
             */
            {
                name: "Secure Chain",
                description: "Pura calidad en tu cuello",
                price: 490.0,
                stock: 5,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778167430/ChatGPT_Image_7_may_2026_17_23_09_j32sia.png",
                categoryId: catAccesorios.id
            },
            {
                name: "Luxury Gold Rings",
                description: "Lote de anillos de oro puro extraido en Somalia",
                price: 5500.0,
                stock: 2,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778167494/ChatGPT_Image_7_may_2026_17_23_58_sqtwtx.png",
                categoryId: catAccesorios.id
            },
            /*
             * ROPA
             */
            {
                name: "Secure T-Shirt (Black)",
                description: "Camiseta de algodón para cualquier ocasión",
                price: 25.0,
                stock: 37,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778167586/ChatGPT_Image_7_may_2026_17_26_13_paunme.png",
                categoryId: catRopa.id
            },
            {
                name: "Secure T-Shirt (White)",
                description: "Camiseta de algodón para cualquier ocasión",
                price: 25.0,
                stock: 65,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778167587/ChatGPT_Image_7_may_2026_17_25_47_rrc9it.png",
                categoryId: catRopa.id
            },
            {
                name: "Secure Hoodie",
                description: "Sudadera azul marino, ideal para ir a tomar el vermut",
                price: 60.0,
                stock: 35,
                image: "https://res.cloudinary.com/dqezwrvov/image/upload/v1778485960/ChatGPT_Image_11_may_2026_09_50_55_mqfq3e.png",
                categoryId: catRopa.id
            }
        ]
    });

    console.log("Insertando Logs de auditoria... 📋");
    const admin = await prisma.user.findUnique({
        where: { email: "admin@securetenis.com" }
    });
    const cliente = await prisma.user.findUnique({
        where: { email: "cliente@securetenis.com" }
    });
    const analista = await prisma.user.findUnique({
        where: { email: "analista@securetenis.com" }
    });

    const now = new Date();
    const logs: LogDraft[] = [];

    // Genera logins exitosos y fallidos para los ultimos 3 dias
    for (let daysAgo = 2; daysAgo >= 0; daysAgo--) {
        const day = new Date(now);
        day.setDate(day.getDate() - daysAgo);

        const loginCount = Math.floor(Math.random() * 6) + 2 + (6 - daysAgo);
        for (let i = 0; i < loginCount; i++) {
            const hour = 8 + Math.floor(Math.random() * 12);
            const minute = Math.floor(Math.random() * 60);
            const user = [admin, cliente, analista][
                Math.floor(Math.random() * 3)
            ];
            logs.push({
                level: "INFO",
                module: "Auth",
                action: "Login exitoso",
                userId: user?.id,
                ip: `192.168.1.${10 + i}`,
                createdAt: new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate(),
                    hour,
                    minute
                )
            });
        }

        const failEmails = [
            "hacker@evil.com",
            "desconocido@test.com",
            "brute@force.net",
            "fake@spam.org"
        ];
        const failCount = Math.floor(Math.random() * 4) + 1;
        for (let i = 0; i < failCount; i++) {
            const hour = 1 + Math.floor(Math.random() * 22);
            logs.push({
                level: "ERROR",
                module: "Auth",
                action: "Login fallido — Credenciales incorrectas.",
                userId: null,
                ip: `103.21.${Math.floor(Math.random() * 255)}.${Math.floor(
                    Math.random() * 255
                )}`,
                createdAt: new Date(
                    day.getFullYear(),
                    day.getMonth(),
                    day.getDate(),
                    hour,
                    Math.floor(Math.random() * 60)
                ),
                detail: `email: ${
                    failEmails[Math.floor(Math.random() * failEmails.length)]
                }`
            });
        }
    }

    // Logs adicionales variados para hoy
    const today = (h: number, m: number) =>
        new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);

    logs.push(
        {
            level: "WARNING",
            module: "Auth",
            action: "Acceso sin token a /api/orders",
            userId: null,
            ip: "45.33.32.156",
            createdAt: today(10, 15)
        },
        {
            level: "INFO",
            module: "Productos",
            action: "GET /api/products",
            userId: cliente?.id,
            ip: "192.168.1.42",
            createdAt: today(10, 20)
        },
        {
            level: "INFO",
            module: "Pedidos",
            action: "Nuevo pedido creado",
            userId: cliente?.id,
            ip: "192.168.1.42",
            createdAt: today(10, 30)
        },
        {
            level: "INFO",
            module: "Auth",
            action: "Registro de nuevo usuario",
            userId: cliente?.id,
            ip: "192.168.1.88",
            createdAt: today(11, 0)
        },
        {
            level: "DEBUG",
            module: "Sistema",
            action: "Healthcheck DB OK",
            userId: null,
            ip: "127.0.0.1",
            createdAt: today(8, 0)
        }
    );

    // El cast evita el conflicto entre el tipo local y el enum generado por Prisma
    await prisma.userLog.createMany({ data: logs as any[] });

    console.log(`  -> ${logs.length} logs insertados`);
    console.log("Base de datos poblada! ✅");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
