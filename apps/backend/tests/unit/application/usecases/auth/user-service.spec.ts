import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DbUserManager } from '@/application/usecases/db-user-manager';
import { UserNotFoundException } from '@/domain/exceptions';

function makeUserRepository(
  overrides: Partial<{ getById: ReturnType<typeof vi.fn> }> = {},
) {
  return {
    getById: vi.fn(),
    ...overrides,
  };
}

describe('DbUserManager', () => {
  let userRepository: ReturnType<typeof makeUserRepository>;
  let userManager: DbUserManager;

  beforeEach(() => {
    userRepository = makeUserRepository();
    // Bypass tsyringe injection for unit tests
    userManager = new DbUserManager(userRepository as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return the user when found in the repository', async () => {
      const dbUser = { id: 'user-789', name: 'Alice', familyId: 'fam-1' };
      userRepository.getById.mockResolvedValueOnce(dbUser);

      const result = await userManager.getUser({ externalId: 'user-789' });

      expect(result).toStrictEqual(dbUser);
      expect(userRepository.getById).toHaveBeenCalledWith('user-789');
    });

    it('should throw an error when the user is not found', async () => {
      userRepository.getById.mockResolvedValueOnce(null);

      await expect(
        userManager.getUser({ externalId: 'ghost-user' }),
      ).rejects.toThrow(UserNotFoundException);
    });
  });
});
