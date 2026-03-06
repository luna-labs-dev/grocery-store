import { type ApplicationRole, Entity } from '../core';
import type { GroupMember } from './group-member';

interface UserProps {
  externalId?: string;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string;
  roles: ApplicationRole[];
  reputationScore: number;
  groups?: GroupMember[];
  createdAt: Date;
  updatedAt: Date;
}

interface UserInfoProps {
  name: string;
  image?: string;
}

export class User extends Entity<UserProps> {
  private constructor(props: UserProps, id?: string) {
    super(props, id);
  }

  public get externalId(): string | undefined {
    return this.props.externalId;
  }

  public get email(): string {
    return this.props.email;
  }

  public get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  public get name(): string {
    return this.props.name;
  }

  public get image(): string | undefined {
    return this.props.image;
  }

  public set image(image: string | undefined) {
    this.props.image = image;
  }

  public get groups(): GroupMember[] | undefined {
    return this.props.groups;
  }

  public get roles(): ApplicationRole[] {
    return this.props.roles;
  }

  public get reputationScore(): number {
    return this.props.reputationScore;
  }

  public get createdAt(): Date {
    return this.props.createdAt;
  }

  public get updatedAt(): Date {
    return this.props.updatedAt;
  }

  public setUserInfo({ name, image }: UserInfoProps) {
    this.props.name = name;
    this.props.image = image;
  }

  public static create(props: UserProps, id?: string): User {
    return new User(props, id);
  }
}
