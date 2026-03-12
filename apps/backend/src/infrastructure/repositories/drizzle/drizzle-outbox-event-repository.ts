import { eq } from 'drizzle-orm';
import { injectable } from 'tsyringe';
import { db } from './setup/connection';
import { outboxEventTable } from './setup/schema';
import type { OutboxEventRepositories } from '@/application/contracts/repositories';
import { OutboxEvent } from '@/domain/entities';

@injectable()
export class DrizzleOutboxEventRepository implements OutboxEventRepositories {
  async add(event: OutboxEvent): Promise<void> {
    await db.insert(outboxEventTable).values({
      id: event.id,
      type: event.type,
      payload: event.payload as Record<string, unknown>,

      status: event.status,
      lastError: event.lastError,
      retryCount: event.retryCount,
      createdAt: event.createdAt,
      processedAt: event.processedAt,
    });
  }

  async getPending(limit = 10): Promise<OutboxEvent[]> {
    const rawEvents = await db.query.outboxEventTable.findMany({
      where: eq(outboxEventTable.status, 'pending'),
      limit,
      orderBy: (events, { asc }) => [asc(events.createdAt)],
    });

    return rawEvents.map((row) =>
      OutboxEvent.reconstitute(
        {
          type: row.type,
          payload: row.payload,
          status: row.status,
          lastError: row.lastError,
          retryCount: row.retryCount,
          createdAt: row.createdAt,
          processedAt: row.processedAt,
        },
        row.id,
      ),
    );
  }

  async update(event: OutboxEvent): Promise<void> {
    await db
      .update(outboxEventTable)
      .set({
        status: event.status,
        lastError: event.lastError,
        retryCount: event.retryCount,
        processedAt: event.processedAt,
      })
      .where(eq(outboxEventTable.id, event.id));
  }
}
