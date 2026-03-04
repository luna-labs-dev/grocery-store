import type { FastifyRequest } from 'fastify';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock tsyringe container so we never need real DI resolution
vi.mock('tsyringe', () => ({
  container: {
    resolve: vi.fn(),
  },
}));

import { container } from 'tsyringe';
import {
  UnauthorizedException,
  UserNotAFamilyMemberBarrierException,
} from '@/domain/exceptions';
import { familyBarrierMiddleware } from '@/main/fastify/middlewares/family-barrier-middleware';

const mockResolve = container.resolve as ReturnType<typeof vi.fn>;

function makeRequest(userId: string | undefined): FastifyRequest {
  return {
    auth: userId ? { user: { id: userId } } : { user: null },
    familyId: undefined,
  } as unknown as FastifyRequest;
}

describe('familyBarrierMiddleware', () => {
  const mockGetUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockResolve.mockReturnValue({ getUser: mockGetUser });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set request.familyId when the user belongs to a family', async () => {
    const dbUser = { id: 'user-1', familyId: 'family-xyz' };
    mockGetUser.mockResolvedValueOnce(dbUser);

    const request = makeRequest('user-1');

    await familyBarrierMiddleware(request);

    expect(mockGetUser).toHaveBeenCalledWith({ id: 'user-1' });
    expect(request.familyId).toBe('family-xyz');
  });

  it('should throw UnauthorizedException when user id is missing from session', async () => {
    const request = makeRequest(undefined);

    await expect(familyBarrierMiddleware(request)).rejects.toThrow(
      UnauthorizedException,
    );
    expect(mockGetUser).not.toHaveBeenCalled();
  });

  it('should throw UserNotAFamilyMemberBarrierException when user has no familyId', async () => {
    const dbUser = { id: 'user-2', familyId: null };
    mockGetUser.mockResolvedValueOnce(dbUser);

    const request = makeRequest('user-2');

    await expect(familyBarrierMiddleware(request)).rejects.toThrow(
      UserNotAFamilyMemberBarrierException,
    );
    expect(request.familyId).toBeUndefined();
  });

  it('should propagate unexpected errors thrown by getUser', async () => {
    mockGetUser.mockRejectedValueOnce(new Error('DB Connection failed'));

    const request = makeRequest('user-3');

    await expect(familyBarrierMiddleware(request)).rejects.toThrow(
      'DB Connection failed',
    );
  });
});
