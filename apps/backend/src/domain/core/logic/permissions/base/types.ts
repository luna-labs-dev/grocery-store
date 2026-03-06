import type { User } from '@/domain/entities';

export interface PermissionContext<DataType> {
  user: User;
  data?: DataType;
}

export type PermissionCheck<DataType> =
  | boolean
  | ((ctx: PermissionContext<DataType>) => boolean);
