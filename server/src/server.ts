import Fastify from "fastify";
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';

import { authRoute } from "./roots/auth";
import { userRoute } from "./roots/users";
import { accountRoute } from "./roots/accounts";
import { transactionRoute } from "./roots/transactions";

async function start() {
    const fastify = Fastify({
        logger: true,
    })

    await fastify.register(cors, {origin: true,})

    await fastify.register(jwt, {
        secret: 'teste',
    })

    await fastify.register(require('./middleware/auth'));
    await fastify.register(authRoute);
    await fastify.register(userRoute);
    await fastify.register(accountRoute);
    await fastify.register(transactionRoute);

    await fastify.listen({port: 3000})
}

start()