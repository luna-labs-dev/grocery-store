import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '@/application/usecases/user-service';

function makeUserRepository(
  overrides: Partial<{ getById: ReturnType<typeof vi.fn> }> = {},
) {
  return {
    getById: vi.fn(),
    ...overrides,
  };
}

describe('UserService', () => {
  let userRepository: ReturnType<typeof makeUserRepository>;
  let userService: UserService;

  beforeEach(() => {
    userRepository = makeUserRepository();
    // Bypass tsyringe injection for unit tests
    userService = new UserService(userRepository as never);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUser', () => {
    it('should return the user when found in the repository', async () => {
      const dbUser = { id: 'user-789', name: 'Alice', familyId: 'fam-1' };
      userRepository.getById.mockResolvedValueOnce(dbUser);

      const result = await userService.getUser({ externalId: 'user-789' });

      expect(result).toStrictEqual(dbUser);
      expect(userRepository.getById).toHaveBeenCalledWith('user-789');
    });

    it('should throw an error when the user is not found', async () => {
      userRepository.getById.mockResolvedValueOnce(null);

      await expect(
        userService.getUser({ externalId: 'ghost-user' }),
      ).rejects.toThrow('User with externalId ghost-user not found');
    });
  });
});
