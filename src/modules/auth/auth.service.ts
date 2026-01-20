import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppError } from "../../core/AppError";
import { AuthRepository } from "./auth.repository";
import { IUserSafe } from "../../types/user";

export class AuthService {
    private repo = new AuthRepository();

    async register(body: any): Promise<string> {
        const data = body;

        if (data.userType === "AUS_STUDENT" && !data.rollNumber) {
            throw new AppError("Roll number required for AUS students", 422)
        }

        const exists = await this.repo.findByEmail(data.email);
        if (exists) throw new AppError("Email already exists", 409)

        data.password = await bcrypt.hash(data.password, 10)

        const user = await this.repo.createUser(data);
        return this.generateToken(user.id, user.userType);
    }

    async login(body: any): Promise<string> {
        const user = await this.repo.findByEmail(body.email)
        if (!user) throw new AppError("Invalid email or password", 401)

        const ok = await bcrypt.compare(body.password, user.password)
        if (!ok) throw new AppError("Invalid email or password", 401)

        return this.generateToken(user.id, user.userType)
    }

    async me(id: string): Promise<IUserSafe | null> {
        const user = await this.repo.findById(id);
        if (!user) throw new AppError("User not found", 404);

        const { password, ...safe } = user;
        return {
            ...safe,
            rollNumber: safe.rollNumber ?? undefined,
            department: safe.department ?? undefined,
            year: safe.year ?? undefined,
        };
    }

    private generateToken(id: string, userType: string): string {
        return jwt.sign({ id, userType }, process.env.JWT_SECRET!, { expiresIn: "7d" })
    }

    async getAllUsers() {
        return this.repo.findAll();
    }

    async changeUserRole(userId: string, userType: string) {
        // Validate userType if needed, though Zod checks payload usually
        return this.repo.updateUserRole(userId, userType);
    }

    // Admin Request methods
    async requestAdmin(userId: string) {
        // Check if user already has pending request
        const existing = await this.repo.findAdminRequestByUserId(userId);
        if (existing) {
            throw new AppError("You already have a pending admin request", 400);
        }

        // Check if user is already an admin
        const user = await this.repo.findById(userId);
        if (user?.userType === "ADMIN") {
            throw new AppError("You are already an admin", 400);
        }

        return this.repo.createAdminRequest(userId);
    }

    async getPendingAdminRequests() {
        return this.repo.findAllPendingAdminRequests();
    }

    async approveAdminRequest(requestId: string) {
        const request = await this.repo.updateAdminRequest(requestId, 'APPROVED');
        // Also update the user's role to ADMIN
        await this.repo.updateUserRole(request.userId, 'ADMIN');
        return request;
    }

    async rejectAdminRequest(requestId: string) {
        return this.repo.updateAdminRequest(requestId, 'REJECTED');
    }
}
