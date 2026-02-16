import type { Entity } from './entity';

export interface NewResponse extends Entity {
  createdAt: Date;
}
