import { Entity, type GroupRole } from '../core';
import type { User } from './user';

interface GroupMemberProps {
  groupId: string;
  userId: string;
  user?: User;
  role: GroupRole;
  joinedAt: Date;
}

export class GroupMember extends Entity<GroupMemberProps> {
  private constructor(props: GroupMemberProps, id?: string) {
    super(props, id);
  }

  public get groupId(): string {
    return this.props.groupId;
  }

  public get userId(): string {
    return this.props.userId;
  }

  public get user(): User | undefined {
    return this.props.user;
  }

  public get role(): GroupRole {
    return this.props.role;
  }

  public get joinedAt(): Date {
    return this.props.joinedAt;
  }

  public static create(
    props: Omit<GroupMemberProps, 'role'> & { role?: GroupRole },
    id?: string,
  ): GroupMember {
    return new GroupMember(
      {
        ...props,
        role: props.role ?? 'member',
      },
      id,
    );
  }

  public updateRole(role: GroupRole): void {
    this.props.role = role;
  }
}
