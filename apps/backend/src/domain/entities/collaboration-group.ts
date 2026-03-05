import { Entity } from '../core';
import { generateReferalCode } from '../helper';
import type { GroupMember } from './group-member';

interface CollaborationGroupProps {
  name: string;
  description?: string;
  inviteCode?: string;
  createdAt: Date;
  createdBy: string;
  members?: GroupMember[];
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

  public get members(): GroupMember[] | undefined {
    return this.props.members;
  }

  public static create(
    props: CollaborationGroupProps,
    id?: string,
  ): CollaborationGroup {
    props.inviteCode =
      props.inviteCode ?? generateReferalCode({ name: props.name });
    return new CollaborationGroup(props, id);
  }

  public generateInviteCode(): void {
    this.props.inviteCode = generateReferalCode({ name: this.props.name });
  }
}
