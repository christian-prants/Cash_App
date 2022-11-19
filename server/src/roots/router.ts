module.exports = async function(fastify: any, options: any) {
    fastify.get(
      "/api/validateAccessToken",
      {
        preValidation: [fastify.authenticate]
      },
      async function(request: any, response: any) {
         response.status(200).send({message: "OK"});
      }
    )
  }