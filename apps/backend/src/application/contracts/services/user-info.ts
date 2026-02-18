export interface UserInfoResult {
  id: string;
  name?: string;
  email?: string;
  picture?: string;
}

export interface UserInfo {
  getInfoByUserId(userId: string): Promise<UserInfoResult>;
}
