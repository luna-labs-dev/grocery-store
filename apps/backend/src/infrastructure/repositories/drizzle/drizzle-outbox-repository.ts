import { eq } from 'drizzle-orm';
import { db } from './setup/connection';
import { outboxEventTable } from './setup/schema';
import type {
  CreateOutboxEvent,
  OutboxRepository,
} from '@/application/contracts/repositories/outbox-repository';

export class DrizzleOutboxRepository implements OutboxRepository {
  async create(event: CreateOutboxEvent): Promise<void> {
    await db.insert(outboxEventTable).values({
      type: event.type,
      payload: event.payload,
      status: 'pending',
    });
  }

  async markAsProcessing(id: string): Promise<void> {
    await db
      .update(outboxEventTable)
      .set({ status: 'processing' })
      .where(eq(outboxEventTable.id, id));
  }

  async markAsCompleted(id: string): Promise<void> {
    await db
      .update(outboxEventTable)
      .set({ status: 'completed', processedAt: new Date() })
      .where(eq(outboxEventTable.id, id));
  }

  async markAsFailed(id: string, error: string): Promise<void> {
    await db
      .update(outboxEventTable)
      .set({ status: 'failed', lastError: error })
      .where(eq(outboxEventTable.id, id));
  }
}
