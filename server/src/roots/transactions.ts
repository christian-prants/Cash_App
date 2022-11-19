import { Prisma } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { getUsersService } from "../services/userServices"

export async function transactionRoute(fastify: FastifyInstance){
    fastify.post('/transactions', async (request: any, reply: any) => {
        const { username } = request.body;

        const users = await prisma.users.findUnique({
            where: {
                username: username
            }
        })
      
        const userAccId = users?.accountId

        const transactions = await prisma.transactions.findMany({
            where: {
                OR: [{
                    creditedAccountId: userAccId
                }, {
                    debitedAccountId: userAccId
                }]
            },
        })
        reply.send({ transactions, userAccId});
        //return  { transactions, userAccId }
    })

    fastify.post('/transactions/cashin', async (request: any, reply: any) => {
        const { username } = request.body;

        const users = await prisma.users.findUnique({
            where: {
                username: username
            }
        })

        const userAccId = users?.accountId
        console.log('accid: ' + userAccId)

        const transactions = await prisma.transactions.findMany({
            where: {
                creditedAccountId: userAccId
            }
        })

        return  { transactions }
    })

    fastify.post('/transactions/cashout', async (request: any, reply: any) => {
        const { username } = request.body;

        const users = await prisma.users.findUnique({
            where: {
                username: username
            }
        })

        const userAccId = users?.accountId
        console.log('accid: ' + userAccId)

        const transactions = await prisma.transactions.findMany({
            where: {
                debitedAccountId: userAccId
            }
        })

        return  { transactions }
    })

    fastify.post('/transactions/cashout/operation', async(request: any, reply: any) => {
        const { username } = request.body;
        const { receiver } = request.body;
        const { value } = request.body;
        
        const userServ = await getUsersService(username, receiver, reply)

        if (userServ.userBalance?.balance) {
            if (value > userServ.userBalance?.balance) {
                return reply.status(500).send({
                    message: 'Saldo insuficiente.'
                })
            }
        }

        if (userServ.users?.accountId === userServ.receiverAccountId?.accountId){
            return reply.status(500).send({
                message: 'Não é possível transferir saldo para si mesmo.'
            })
        }

        try {
            await prisma.$transaction ([
                prisma.accounts.update({
                    where: {
                        id: userServ.users?.accountId
                    },
                    data: {
                        balance: (Number(userServ.userBalance?.balance) - value )
                    }
                }),
                prisma.accounts.update({
                    where: {
                        id: userServ.receiverAccountId?.accountId
                    },
                    data: {
                        balance: (Number(userServ.receiverBalance?.balance) + Number(value) )
                    }
                }),
                prisma.transactions.create({
                    data: {
                        value: Number(value),
                        debitedAccountId: userServ.users?.accountId,
                        creditedAccountId: userServ.receiverAccountId?.accountId
                    }
                })
                ])
                return reply.status(201).send({message:'OK'})
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                return reply.status(500).send({
                    message: 'Código do erro: ' + error.code
                })
            }
        }
    })
}