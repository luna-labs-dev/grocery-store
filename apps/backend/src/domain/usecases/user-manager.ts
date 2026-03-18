import type { User } from '../entities';

export interface AddUserParams {
  externalId: string;
}

export interface GetUserParams {
  externalId: string;
}

export interface IUserManager {
  getUser(params: GetUserParams): Promise<User>;
}
