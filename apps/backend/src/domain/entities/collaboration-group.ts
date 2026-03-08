import { Entity, type GroupRole } from '../core';
import { generateReferalCode } from '../helper';
import { GroupMember } from './group-member';

interface CollaborationGroupProps {
  name: string;
  description?: string;
  inviteCode?: string;
  createdAt: Date;
  createdBy: string;
  members: GroupMember[];
}

export class CollaborationGroup extends Entity<CollaborationGroupProps> {
  private constructor(props: CollaborationGroupProps, id?: string) {
    super(props, id);
  }

  public get name(): string {
    return this.props.name;
  }

  public get description(): string | undefined {
    return this.props.description;
  }

  public get inviteCode(): string | undefined {
    return this.props.inviteCode;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get createdBy(): string {
    return this.props.createdBy;
  }

  public get members(): GroupMember[] {
    return this.props.members;
  }

  public static create(
    props: Omit<CollaborationGroupProps, 'members' | 'inviteCode'> & {
      members?: GroupMember[];
      inviteCode?: string;
    },
    id?: string,
  ): CollaborationGroup {
    const inviteCode =
      props.inviteCode ?? generateReferalCode({ name: props.name });

    const members = props.members ?? [];

    const group = new CollaborationGroup(
      {
        ...props,
        inviteCode,
        members,
      },
      id,
    );

    // If it's a new group and no members were provided, add the creator as owner
    if (!id && members.length === 0) {
      group.addMember(
        GroupMember.create({
          groupId: group.id,
          userId: props.createdBy,
          role: 'owner',
          joinedAt: props.createdAt,
        }),
      );
    }

    return group;
  }

  public addMember(member: GroupMember): void {
    const exists = this.props.members.some((m) => m.userId === member.userId);
    if (!exists) {
      this.props.members.push(member);
    }
  }

  public removeMember(userId: string): void {
    this.props.members = this.props.members.filter((m) => m.userId !== userId);
  }

  public updateMemberRole(userId: string, role: GroupRole): void {
    const member = this.props.members.find((m) => m.userId === userId);
    if (member) {
      member.updateRole(role);
    }
  }

  public generateInviteCode(): void {
    this.props.inviteCode = generateReferalCode({ name: this.props.name });
  }

  public updateName(name: string): void {
    this.props.name = name;
  }

  public updateDescription(description?: string): void {
    this.props.description = description;
  }
}
