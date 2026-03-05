import type { auth } from '@/main/auth/auth';

declare module 'fastify' {
  interface FastifyRequest {
    auth: typeof auth.$Infer.Session;
    /** @deprecated use groupId instead */
    familyId?: string;
    groupId: string;
  }
}
