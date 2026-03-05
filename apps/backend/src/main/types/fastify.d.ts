import type { auth } from '@/main/auth/auth';

declare module 'fastify' {
  interface FastifyRequest {
    auth: typeof auth.$Infer.Session;
    groupId: string;
  }
}
