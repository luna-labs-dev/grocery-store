import 'reflect-metadata';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UserService } from '@/application/usecases/user-service';
import { UserAlreadyExistsException } from '@/domain/exceptions';

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

  describe('addUser', () => {
    it('should throw UserAlreadyExistsException when user already exists', async () => {
      userRepository.getById.mockResolvedValueOnce({ id: 'user-123' });

      await expect(userService.addUser({ id: 'user-123' })).rejects.toThrow(
        UserAlreadyExistsException,
      );
      expect(userRepository.getById).toHaveBeenCalledWith('user-123');
    });

    it('should complete without error when user does not exist yet', async () => {
      userRepository.getById.mockResolvedValueOnce(null);

      await expect(
        userService.addUser({ id: 'new-user-456' }),
      ).resolves.toBeUndefined();
      expect(userRepository.getById).toHaveBeenCalledWith('new-user-456');
    });
  });

  describe('getUser', () => {
    it('should return the user when found in the repository', async () => {
      const dbUser = { id: 'user-789', name: 'Alice', familyId: 'fam-1' };
      userRepository.getById.mockResolvedValueOnce(dbUser);

      const result = await userService.getUser({ id: 'user-789' });

      expect(result).toStrictEqual(dbUser);
      expect(userRepository.getById).toHaveBeenCalledWith('user-789');
    });

    it('should throw an error when the user is not found', async () => {
      userRepository.getById.mockResolvedValueOnce(null);

      await expect(userService.getUser({ id: 'ghost-user' })).rejects.toThrow(
        'User with id ghost-user not found',
      );
    });
  });
});
