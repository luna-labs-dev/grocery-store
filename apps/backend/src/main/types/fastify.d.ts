import '@clerk/fastify';
declare module 'fastify' {
  interface FastifyRequest {
    context: {
      auth: {
        userId: string;
        isAuthenticated: boolean;
      };
      familyId: string;
    };
  }
}
