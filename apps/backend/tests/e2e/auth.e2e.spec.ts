import type { FastifyInstance } from 'fastify';
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { cleanupDatabase, initApp } from './setup';

describe('Auth E2E', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await initApp();
  });

  beforeEach(async () => {
    await cleanupDatabase();
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should register a new user', async () => {
    const signupData = {
      email: 'register-test@example.com',
      password: 'password123',
      name: 'Register User',
    };
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      payload: signupData,
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(signupData.email);
  });

  it('should login an existing user', async () => {
    const loginData = {
      email: 'login-test@example.com',
      password: 'login-password123',
      name: 'Login User',
    };

    // 1. First register
    const signupRes = await app.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      payload: loginData,
    });
    expect(signupRes.statusCode).toBe(200);

    // 2. Then login
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/sign-in/email',
      payload: {
        email: loginData.email,
        password: loginData.password,
      },
    });

    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.user).toBeDefined();
    expect(body.user.email).toBe(loginData.email);
    expect(response.headers['set-cookie']).toBeDefined();
  });

  it('should not login with wrong password', async () => {
    const userData = {
      email: 'wrong-pass-test@example.com',
      password: 'password123',
      name: 'Wrong Pass User',
    };

    // 1. First register
    await app.inject({
      method: 'POST',
      url: '/api/auth/sign-up/email',
      payload: userData,
    });

    // 2. Then try login with wrong password
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/sign-in/email',
      payload: {
        email: userData.email,
        password: 'wrongpassword',
      },
    });

    expect(response.statusCode).toBe(401);
  });
});
