export interface IConfigService {
  getThreshold(groupId: string, key: string): Promise<number>;
}
