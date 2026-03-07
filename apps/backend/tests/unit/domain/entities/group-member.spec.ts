import { describe, expect, it } from 'vitest';
import { GroupMember } from '@/domain/entities/group-member';

describe('GroupMember Entity', () => {
  it('should create a group member with default MEMBER role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      joinedAt: new Date(),
    });

    expect(member.groupId).toBe('group-1');
    expect(member.userId).toBe('user-1');
    expect(member.role).toBe('member');
  });

  it('should create a group member with a specific role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      role: 'owner',
      joinedAt: new Date(),
    });

    expect(member.role).toBe('owner');
  });

  it('should allow updating the role', () => {
    const member = GroupMember.create({
      groupId: 'group-1',
      userId: 'user-1',
      joinedAt: new Date(),
    });

    member.updateRole('moderator');
    expect(member.role).toBe('moderator');
  });
});
