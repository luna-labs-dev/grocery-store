import '@clerk/fastify';

declare module 'fastify' {
  interface FastifyRequest {
    auth: {
      userId: string;
      isAuthenticated: boolean;
    };
    familyId: string;
  }
}
