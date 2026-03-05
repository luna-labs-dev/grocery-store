import { describe, expect, it } from 'vitest';
import { GroupMember } from '@/domain/entities/group-member';
import { GroupRole } from '@/domain/core/enums';

describe('GroupMember Entity', () => {
  it('should create a group member with default MEMBER role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      joinedAt: new Date(),
    });

    expect(member.groupId).toBe('group-1');
    expect(member.userId).toBe('user-1');
    expect(member.role).toBe(GroupRole.MEMBER);
  });

  it('should create a group member with a specific role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      role: GroupRole.OWNER,
      joinedAt: new Date(),
    });

    expect(member.role).toBe(GroupRole.OWNER);
  });

  it('should allow updating the role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      joinedAt: new Date(),
    });

    member.updateRole(GroupRole.ADMIN);
    expect(member.role).toBe(GroupRole.ADMIN);
  });
});
