import { prisma } from "../../config/prisma";

// Estadísticas de autenticación calculadas desde los logs reales
interface AuthStats {
    totalLogins30d: number;
    failedAttempts30d: number;
    uniqueUsersToday: number;
    recentSessions: { user: string; time: string; ok: boolean }[];
    failedAttempts: {
        time: string;
        email: string;
        ip: string;
        reason: string;
    }[];
    chartData: { day: string; ok: number; fail: number }[];
}

const getAuthStats = async (): Promise<AuthStats> => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const todayStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Logins exitosos en los últimos 30 días
    const totalLogins30d = await prisma.userLog.count({
        where: {
            module: "Auth",
            action: "Login exitoso",
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    // Intentos fallidos en los últimos 30 días
    const failedAttempts30d = await prisma.userLog.count({
        where: {
            module: "Auth",
            action: { startsWith: "Login fallido" },
            createdAt: { gte: thirtyDaysAgo }
        }
    });

    // Usuarios únicos que hicieron login hoy
    const todayLogins = await prisma.userLog.findMany({
        where: {
            module: "Auth",
            action: "Login exitoso",
            createdAt: { gte: todayStart }
        },
        select: { userId: true }
    });
    const uniqueUsersToday = new Set(
        todayLogins.map((l) => l.userId).filter(Boolean)
    ).size;

    // Últimas 10 sesiones (login exitoso + fallido)
    const recentRows = await prisma.userLog.findMany({
        where: {
            module: "Auth",
            OR: [
                { action: "Login exitoso" },
                { action: { startsWith: "Login fallido" } }
            ]
        },
        include: { user: { select: { email: true } } },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    const recentSessions = recentRows.map((r) => ({
        user:
            r.user?.email ?? r.detail?.replace("email: ", "") ?? "Desconocido",
        time: r.createdAt.toISOString(),
        ok: r.action === "Login exitoso"
    }));

    // Últimos 10 intentos fallidos con detalle
    const failedRows = await prisma.userLog.findMany({
        where: { module: "Auth", action: { startsWith: "Login fallido" } },
        orderBy: { createdAt: "desc" },
        take: 10
    });

    const failedAttempts = failedRows.map((r) => {
        const reason = r.action
            .replace("Login fallido — ", "")
            .replace("Login fallido — ", "");
        return {
            time: r.createdAt.toISOString(),
            email: r.detail?.replace("email: ", "") ?? "Desconocido",
            ip: r.ip ?? "",
            reason: reason.charAt(0).toUpperCase() + reason.slice(1)
        };
    });

    // Datos del gráfico: logins vs fallidos por día (últimos 7 días)
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const chartData: AuthStats["chartData"] = [];

    for (let i = 6; i >= 0; i--) {
        const dayStart = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        dayStart.setHours(0, 0, 0, 0);
        const dayEnd = new Date(dayStart);
        dayEnd.setHours(23, 59, 59, 999);

        const [ok, fail] = await Promise.all([
            prisma.userLog.count({
                where: {
                    module: "Auth",
                    action: "Login exitoso",
                    createdAt: { gte: dayStart, lte: dayEnd }
                }
            }),
            prisma.userLog.count({
                where: {
                    module: "Auth",
                    action: { startsWith: "Login fallido" },
                    createdAt: { gte: dayStart, lte: dayEnd }
                }
            })
        ]);

        chartData.push({ day: dayNames[dayStart.getDay()], ok, fail });
    }
    return {
        totalLogins30d,
        failedAttempts30d,
        uniqueUsersToday,
        recentSessions,
        failedAttempts,
        chartData
    };
};

// Estadísticas generales del sistema para la vista Estado General
interface SystemStats {
    backend: { status: string; latencyMs: number; version: string };
    database: { status: string; engine: string; tables: number };
    counts: {
        users: number;
        products: number;
        orders: number;
        logs: number;
        categories: number;
    };
    logsByLevel: { level: string; count: number }[];
    logsByModule: { module: string; count: number }[];
}

const getSystemStats = async (): Promise<SystemStats> => {
    const startTime = Date.now();

    // Conteos principales de las tablas del sistema
    const [users, products, orders, logs, categories] = await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.userLog.count(),
        prisma.category.count()
    ]);

    const latencyMs = Date.now() - startTime;

    // Distribución de logs por nivel
    const levelGroups = await prisma.userLog.groupBy({
        by: ["level"],
        _count: { level: true }
    });
    const logsByLevel = levelGroups.map((g) => ({
        level: g.level,
        count: g._count.level
    }));

    // Distribución de logs por módulo (top 10)
    const moduleGroups = await prisma.userLog.groupBy({
        by: ["module"],
        _count: { module: true },
        orderBy: { _count: { module: "desc" } },
        take: 10
    });
    const logsByModule = moduleGroups.map((g) => ({
        module: g.module,
        count: g._count.module
    }));

    return {
        backend: { status: "Operativo", latencyMs, version: "1.0.0" },
        database: { status: "Conectada", engine: "MySQL", tables: 7 },
        counts: { users, products, orders, logs, categories },
        logsByLevel,
        logsByModule
    };
};

export { getAuthStats, getSystemStats }