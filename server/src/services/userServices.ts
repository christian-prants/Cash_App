import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";

export const getUsersService = async (username: any, receiver: any, reply: any) => {
    try {
        const users = await prisma.users.findUnique({
            where: {
                username: username
            },
            select: {
                accountId: true
            }
        })
    
        const userBalance = await prisma.accounts.findUnique({
            where: {
                id: users?.accountId
            },
            select: {
                balance: true
            }
        })

        const receiverAccountId = await prisma.users.findUnique({
            where: {
                username: receiver
            },
            select: {
                accountId: true
            }
        })

        const receiverBalance = await prisma.accounts.findUnique({
            where: {
                id: receiverAccountId?.accountId
            },
            select: {
                balance: true
            }
        })

        return ( {userBalance, receiverBalance, users, receiverAccountId } )
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            return reply.status(500).send({
                message: 'Código do erro: ' + error.code
            })
        }
    }
    
}