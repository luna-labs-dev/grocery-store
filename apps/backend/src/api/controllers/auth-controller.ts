import type { FastifyPluginOptions } from 'fastify';
import { injectable } from 'tsyringe';
import { FastifyController } from '@/api/contracts/fastify-controller';
import {
  callbackGoogleQuerystringSchema,
  csrfResponseSchema,
  sessionResponseSchema,
  signInEmailRequestSchema,
  signInSocialRequestSchema,
  signUpEmailRequestSchema,
} from '@/api/helpers';
import { HttpStatusCode } from '@/domain/core/enums';
import { auth } from '@/main/auth/auth';
import { env } from '@/main/config/env';
import type { FastifyTypedInstance } from '@/main/fastify/types';

@injectable()
export class AuthController extends FastifyController {
  private async handleRequest(request: any, reply: any) {
    const baseOrigin = new URL(env.auth.url).origin;
    const url = `${baseOrigin}${request.url}`;

    const response = await auth.handler(
      new Request(url, {
        method: request.method,
        headers: request.headers as any,
        body: request.body ? JSON.stringify(request.body) : undefined,
      }),
    );

    // Copy Set-Cookie and other headers from the Web Response to Fastify Reply
    response.headers.forEach((value, key) => {
      reply.header(key, value);
    });

    reply.status(response.status);

    if (response.status === HttpStatusCode.NoContent) {
      return reply.send();
    }

    try {
      const data = await response.json();
      return reply.send(data);
    } catch {
      return reply.send();
    }
  }

  async registerRoutes(app: FastifyTypedInstance, _opts: FastifyPluginOptions) {
    app.post(
      '/sign-up/email',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Sign up with email',
          description: 'Register a new user using email and password',
          operationId: 'signUpEmail',
          body: signUpEmailRequestSchema,
          response: {
            [HttpStatusCode.Ok]: sessionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.post(
      '/sign-in/email',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Sign in with email',
          description: 'Authenticate a user using email and password',
          operationId: 'signInEmail',
          body: signInEmailRequestSchema,
          response: {
            [HttpStatusCode.Ok]: sessionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.post(
      '/sign-in/social',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Social Sign In',
          description: 'Initiate social login flow (e.g., Google)',
          operationId: 'signInSocial',
          body: signInSocialRequestSchema,
          response: {
            [HttpStatusCode.Ok]: sessionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.post(
      '/sign-out',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Sign out',
          description: 'Invalidate the current session',
          operationId: 'signOut',
          response: {
            [HttpStatusCode.Ok]: sessionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.get(
      '/session',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Get session',
          description: 'Get the current user session information',
          operationId: 'getSession',
          response: {
            [HttpStatusCode.Ok]: sessionResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.get(
      '/callback/google',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Google Callback',
          description: 'Handle Google social login callback',
          operationId: 'callbackGoogle',
          querystring: callbackGoogleQuerystringSchema,
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );

    app.get(
      '/csrf',
      {
        schema: {
          tags: [this.prefix],
          summary: 'CSRF Token',
          description: 'Get the current CSRF token',
          operationId: 'getCsrfToken',
          response: {
            [HttpStatusCode.Ok]: csrfResponseSchema,
          },
        },
      },
      async (request, reply) => {
        return this.handleRequest(request, reply);
      },
    );
  }
}
