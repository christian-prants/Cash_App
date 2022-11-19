const fp = require('fastify-plugin');

module.exports = fp(async (fastify: any) => {
  fastify.decorate('authenticate', async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });
});