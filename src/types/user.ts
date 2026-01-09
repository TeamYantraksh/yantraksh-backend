import { UserType } from "@prisma/client";

export interface IUserCreate {
    name: string
    email: string
    password: string
    userType: UserType
    rollNumber?: string
    department?: string
    year?: number
}

export interface IUserSafe {
    id: string
    name: string
    email: string
    userType: UserType
    rollNumber?: string
    department?: string
    year?: number
    createdAt: Date
    updatedAt: Date
}
