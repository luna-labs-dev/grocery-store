import type { User } from '../../entities';

export interface GetUserParams {
  externalId: string;
}

export interface GetUser {
  execute(params: GetUserParams): Promise<User>;
}
