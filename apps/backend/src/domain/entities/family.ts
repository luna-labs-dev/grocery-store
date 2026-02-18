import { Entity } from '../core';
import { generateReferalCode } from '../helper';
import type { User } from './user';

interface FamilyProps {
  ownerId: string;
  owner: User;
  name: string;
  description?: string;
  inviteCode?: string;
  createdAt: Date;
  createdBy: string;
  members?: User[];
}

export class Family extends Entity<FamilyProps> {
  private constructor(props: FamilyProps, id?: string) {
    super(props, id);
  }

  public get ownerId(): string {
    return this.props.ownerId;
  }

  public get owner(): User {
    return this.props.owner;
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

  public get members(): User[] | undefined {
    return this.props.members;
  }

  public static create(props: FamilyProps, id?: string): Family {
    props.inviteCode =
      props.inviteCode ?? generateReferalCode({ name: props.name });
    return new Family(props, id);
  }

  public generateInviteCode(): void {
    this.props.inviteCode = generateReferalCode({ name: this.props.name });
  }
}
