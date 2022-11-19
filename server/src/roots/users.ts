import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { encryptPassword } from "../lib/encrypt";

export async function userRoute(fastify: FastifyInstance){

    fastify.get('/users', async () => {
        const users = await prisma.users.findMany({
            include: {
                accounts: true
            }
        })
        return {users}
    })

    fastify.post('/users', async (request: any, reply: any)=> {  
        const { username, password } = request.body;
        const encryptedPassword = await encryptPassword(password);

        const hasStrongPassword = ((str: string) => {
            const strongPass = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$')
            if (strongPass.test(str)) {
                return true
            } else {
                return false
            }
        })
        
        const checksUser = await prisma.users.findUnique({
            where: {
                username: username
            }
        })

        if (checksUser) {
            return reply.status(500).send({
                message: 'Username já está em uso, escolha outro.'
            })
        } else if (username.lenght < 3) {
            return reply.status(500).send({
                message: 'O username deve ter pelo menos 3 caracteres.'
            })
        } else if (!hasStrongPassword) {
            return reply.status(500).send({
                message: 'A password deve ter no mínimo 8 caracteres, 1 letra maiúscula e 1 número.'
            })
        }

        try {
            const user = await prisma.users.create({
                data: {
                    username: username,
                    password: encryptedPassword,
                    
                    accounts: {
                        create: {
                            balance: 100
                        }
                    }
                }
            })
            //return reply.status(201).send('Usuário ' + user.username + ' criado com sucesso.')
            return {user}
        } catch {
            const user = await prisma.users.create({
                data: {
                    username: username,
                    password: encryptedPassword,

                    accounts: {
                        create: {
                            balance: 100
                        }
                    }
                }
            })
            return {user}
        }
    })
}
