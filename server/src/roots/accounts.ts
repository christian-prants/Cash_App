import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

export async function accountRoute(fastify: FastifyInstance){
    fastify.post('/accounts', async (request: any) => {
        const { username } = request.body;

        const users = await prisma.users.findUnique({
            where: {
                username: username
            }
        })

        const account = await prisma.accounts.findUnique({
            select: {
                balance: true
            },
            where: {
                id: users?.accountId
            }
        })

        return { account }
    })
}