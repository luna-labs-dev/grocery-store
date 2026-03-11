import 'reflect-metadata';
import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import { container } from 'tsyringe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Better Auth and its internal handler
vi.mock('@/main/auth/auth', () => ({
  auth: {
    handler: vi.fn(),
  },
}));

vi.mock('@/main/config/env', () => ({
  env: {
    baseConfig: {
      environment: 'local',
      origins: ['http://localhost'],
    },
    auth: {
      url: 'http://localhost/api/auth',
    },
  },
}));

import { AuthController } from '@/api/controllers/auth-controller';
import { auth } from '@/main/auth/auth';

describe('AuthController', () => {
  let app: any;
  const mockAuthHandler = vi.mocked(auth.handler);

  beforeEach(async () => {
    vi.clearAllMocks();
    app = fastify();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);

    const controller = container.resolve(AuthController);
    await app.register(controller.registerRoutes.bind(controller));
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /sign-up/email', () => {
    it('should proxy the request to Better Auth and return 200 on success', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'test@test.com',
        name: 'Test',
        emailVerified: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        image: 'http://example.com/image.png',
      };
      const mockSession = {
        id: 'session-123',
        token: 'token-123',
        userId: 'user-123',
        expiresAt: new Date(Date.now() + 3600000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockResponse = new Response(
        JSON.stringify({ user: mockUser, session: mockSession }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'POST',
        url: '/sign-up/email',
        payload: {
          email: 'test@test.com',
          password: 'password123',
          name: 'Test',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        user: mockUser,
        session: mockSession,
      });
      expect(mockAuthHandler).toHaveBeenCalled();
    });

    it('should return 400 when the body is invalid (Zod validation)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/sign-up/email',
        payload: {
          email: 'invalid-email',
          password: 'short',
        },
      });

      expect(response.statusCode).toBe(400);
      expect(mockAuthHandler).not.toHaveBeenCalled();
    });
  });

  describe('GET /csrf', () => {
    it('should return a CSRF token', async () => {
      const mockResponse = new Response(
        JSON.stringify({ csrfToken: 'fake-csrf-token' }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'GET',
        url: '/csrf',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        csrfToken: 'fake-csrf-token',
      });
    });
  });

  describe('Header & Cookie Propagation', () => {
    it('should correctly propagate Set-Cookie headers from Better Auth', async () => {
      const mockResponse = new Response(null, {
        status: 204,
        headers: {
          'Set-Cookie': 'auth_session=abc; Path=/; HttpOnly',
        },
      });
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'POST',
        url: '/sign-out',
      });

      expect(response.statusCode).toBe(204);
      expect(response.headers['set-cookie']).toContain(
        'auth_session=abc; Path=/; HttpOnly',
      );
    });
  });

  describe('OAuth / Social Flows (Redirects)', () => {
    it('should proxy 302 redirects from Better Auth (Social Sign-in initiation)', async () => {
      const redirectUrl =
        'https://accounts.google.com/o/oauth2/v2/auth?client_id=xxx';
      const mockResponse = new Response(
        JSON.stringify({ url: redirectUrl, redirect: true }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'POST',
        url: '/sign-in/social',
        payload: {
          provider: 'google',
          callbackURL: 'http://localhost:3000/callback',
        },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual({
        url: redirectUrl,
        redirect: true,
      });
    });

    it('should handle OAuth callbacks with valid query parameters', async () => {
      const mockResponse = new Response(null, {
        status: 302,
        headers: { Location: '/' },
      });
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'GET',
        url: '/callback/google?code=123&state=abc',
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/');
    });
  });

  describe('Edge Cases', () => {
    it('should handle non-JSON responses from Better Auth gracefully', async () => {
      const mockResponse = new Response('Empty body', { status: 200 });
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'GET',
        url: '/get-session',
      });

      expect(response.statusCode).toBe(200);
      expect(response.body).toBe('');
    });

    it('should handle 500 errors from Better Auth handler', async () => {
      const mockResponse = new Response(
        JSON.stringify({ error: 'Internal Server Error' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        },
      );
      mockAuthHandler.mockResolvedValueOnce(mockResponse);

      const response = await app.inject({
        method: 'GET',
        url: '/get-session',
      });

      expect(response.statusCode).toBe(500);
      expect(JSON.parse(response.body)).toEqual({
        error: 'Internal Server Error',
      });
    });

    it('should fail when POST body is missing (empty body)', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/sign-in/email',
        // No payload
      });

      expect(response.statusCode).toBe(400); // Fastify-zod validation should catch this
    });
  });
});
