import prisma from './prisma';
import {IUser} from "../common/interfaces/auth";

class DB {
    constructor() {
    }

    async createUser(user: Partial<IUser>) {
        return await prisma.user.create({
            data: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                password: user.password,
            }
        })
    }

    async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: {
                email
            }
        })
    }

    async saveRefreshToken(userEmail: string, refreshToken: string) {
        return await prisma.user.update({
            where: {
                email: userEmail
            },
            data: {
                refreshToken
            }
        })
    }

    async getUserByRefreshToken(refreshToken: string) {
        return await prisma.user.findUnique({
            where: {
                refreshToken
            }
        })
    }

    async getUserById(id: string) {
        return await prisma.user.findUnique({
            where: {
                id
            }
        })
    }
}

export default DB;