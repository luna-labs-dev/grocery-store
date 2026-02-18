import type { Family, User } from '@/domain';

export const userMapper = {
  toResponse: (user: User) => ({
    id: user.id,
    externalId: user.externalId,
    name: user.name,
    picture: user.picture,
    email: user.email,
  }),
};

export const familyMapper = {
  toResponse: (family: Family) => {
    return {
      name: family.name,
      description: family.description,
      owner: userMapper.toResponse(family.owner),
      inviteCode: family.inviteCode,
      members: family.members
        ? family.members.map((member) => userMapper.toResponse(member))
        : undefined,
      createdAt: family.createdAt,
      createdBy: family.createdBy,
    };
  },
};
