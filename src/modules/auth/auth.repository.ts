import prisma from "../../config/client";
import { IUserCreate } from "../../types/user";

export class AuthRepository{
    findByEmail(email:string){
        return prisma.user.findUnique({
            where:{
                email
            }
        })
    }
    createUser(data: IUserCreate){
        return prisma.user.create({data})
    }
    findById(id:string){
        return prisma.user.findUnique({
            where:{
                id
            }
        })
    }
}