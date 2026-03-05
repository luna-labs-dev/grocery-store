import { describe, expect, it } from 'vitest';
import { CollaborationGroup } from '@/domain/entities/collaboration-group';

describe('CollaborationGroup Entity', () => {
  it('should create a collaboration group with an invite code', () => {
    const group = CollaborationGroup.create({
      name: 'Supermarket Gang',
      description: 'Buying food for the office',
      createdAt: new Date(),
      createdBy: 'user-1',
    });

    expect(group.name).toBe('Supermarket Gang');
    expect(group.inviteCode).toBeDefined();
    expect(group.inviteCode?.length).toBeGreaterThan(5);
  });

  it('should allow generating a new invite code', () => {
    const group = CollaborationGroup.create({
      name: 'Supermarket Gang',
      createdAt: new Date(),
      createdBy: 'user-1',
    });

    const firstCode = group.inviteCode;
    group.generateInviteCode();
    expect(group.inviteCode).not.toBe(firstCode);
  });
});
