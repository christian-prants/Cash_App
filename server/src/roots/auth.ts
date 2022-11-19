import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";
import { comparePassword } from "../lib/encrypt";

export async function authRoute(fastify: FastifyInstance) {

    fastify.post('/api/v1/generateAccessToken', async (request: any, reply: any) => {

      const { username, password } = request.body;

      if (!username || !password) {
        reply.status(500).send({ error: true, msg: 'Todos os campos devem ser preenchidos.' });
      }

      const checksUser = await prisma.users.findUnique({
        where: {
          username: username
        }
      })

      if (checksUser) {
        const encryptedPass = checksUser.password
        const isValid = await comparePassword(password, encryptedPass)

        const userAccountId = checksUser.accountId
        const getUserBalance = await prisma.accounts.findUnique({
          where: {
              id: userAccountId
          },
          select: {
            balance: true
          }
        })
        const userBalance = String(getUserBalance?.balance)
        console.log(userBalance)

        if (!checksUser || !isValid) {
          return reply.status(404).send({ error: true, msg: 'Usuário não encontrado.' });
        }
        const token = fastify.jwt.sign({ username, password: encryptedPass, balance: getUserBalance }, { expiresIn: 86400 });
        reply.send({ token, username, encryptedPass, getUserBalance });
      }
    });
  }