export interface AddUserParams {
  externalId: string;
}

export interface AddUser {
  execute(params: AddUserParams): Promise<void>;
}
