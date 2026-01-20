import prisma from "../../config/client";
import { IUserCreate } from "../../types/user";

export class AuthRepository {
    findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email
            }
        })
    }
    createUser(data: IUserCreate) {
        return prisma.user.create({ data })
    }
    findById(id: string) {
        return prisma.user.findUnique({
            where: {
                id
            }
        })
    }

    findAll() {
        return prisma.user.findMany();
    }

    updateUserRole(id: string, userType: any) {
        return prisma.user.update({
            where: { id },
            data: { userType }
        });
    }

    // Admin Request methods
    createAdminRequest(userId: string) {
        return prisma.adminRequest.create({
            data: { userId }
        });
    }

    findAdminRequestByUserId(userId: string) {
        return prisma.adminRequest.findFirst({
            where: { userId, status: 'PENDING' }
        });
    }

    findAllPendingAdminRequests() {
        return prisma.adminRequest.findMany({
            where: { status: 'PENDING' },
            include: { user: { select: { id: true, name: true, email: true, userType: true } } },
            orderBy: { createdAt: 'desc' }
        });
    }

    updateAdminRequest(id: string, status: 'APPROVED' | 'REJECTED') {
        return prisma.adminRequest.update({
            where: { id },
            data: { status },
            include: { user: true }
        });
    }
}