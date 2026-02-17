import type { AddUserRepository } from './add-user-repository';
import type { GetUserByIdRepository } from './get-user-by-id-repository';
import type { UpdateUserRepository } from './update-user-repository';

export type UserRepositories = AddUserRepository &
  UpdateUserRepository &
  GetUserByIdRepository;

export * from './add-user-repository';
export * from './get-user-by-id-repository';
export * from './update-user-repository';
