import type { FastifyRequest } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock better-auth/node beforehand so auth.ts can import without real credentials
vi.mock('better-auth/node', () => ({
  fromNodeHeaders: vi.fn((headers) => headers),
}));

// Mock the auth module so we don't need a real DB/redis for unit tests
vi.mock('@/main/auth/auth', () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Import AFTER mocks are in place
import { fromNodeHeaders } from 'better-auth/node';
import { UnauthorizedException } from '@/domain/exceptions';
import { auth } from '@/main/auth/auth';
import { authMiddleware } from '@/main/fastify/middlewares/auth-middleware';

// vi.mocked provides correct MockInstance types; fixture values are cast to
// satisfy Better Auth's strict session shape without duplicating the full type.
const mockGetSession = vi.mocked(auth.api.getSession);
const mockFromNodeHeaders = vi.mocked(fromNodeHeaders);

function makeRequest(headers: Record<string, string> = {}): FastifyRequest {
  return { headers, auth: undefined } as unknown as FastifyRequest;
}

const fakeSession = {
  user: { id: 'user-123', name: 'Test User', email: 'test@example.com' },
  session: {
    id: 'session-abc',
    token: 'tok',
    userId: 'user-123',
    createdAt: new Date(),
    updatedAt: new Date(),
    expiresAt: new Date(Date.now() + 3_600_000),
  },
} as Awaited<ReturnType<typeof mockGetSession>>;

describe('authMiddleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should attach the session object to request.auth when the session is valid', async () => {
    mockGetSession.mockResolvedValueOnce(fakeSession);
    mockFromNodeHeaders.mockImplementationOnce((h) => h as never);

    const request = makeRequest({ authorization: 'Bearer tok' });

    await authMiddleware(request);

    expect(mockFromNodeHeaders).toHaveBeenCalledWith(request.headers);
    expect(mockGetSession).toHaveBeenCalled();
    expect(request.auth).toBe(fakeSession);
  });

  it('should throw UnauthorizedException when no session is returned', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    mockFromNodeHeaders.mockImplementationOnce((h) => h as never);

    const request = makeRequest();

    await expect(authMiddleware(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException when session has expired (getSession resolves null)', async () => {
    mockGetSession.mockResolvedValueOnce(null);
    mockFromNodeHeaders.mockImplementationOnce((h) => h as never);

    const request = makeRequest({ authorization: 'Bearer expired' });

    await expect(authMiddleware(request)).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should propagate unexpected errors thrown by getSession', async () => {
    const networkError = new Error('Network timeout');
    mockGetSession.mockRejectedValueOnce(networkError);
    mockFromNodeHeaders.mockImplementationOnce((h) => h as never);

    const request = makeRequest();

    await expect(authMiddleware(request)).rejects.toThrow('Network timeout');
  });
});
