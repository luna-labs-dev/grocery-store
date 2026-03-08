import type { Entity } from '../../../../domain/core';

export interface User extends Entity {
  name: string;
  picture: string;
  externalId: string;
  email: string;
}

export interface Group extends Entity {
  name: string;
  description?: string;
  owner: User;
  inviteCode: string;
  members?: User[];
  createdAt: Date;
  createdBy: string;
}

export interface CreateGroupParams
  extends Pick<Group, 'name' | 'description'> {}

export interface JoinGroupParams extends Pick<Group, 'inviteCode'> {}

export interface RemoveGroupMemberParams {
  userToBeRemovedId: string;
}
