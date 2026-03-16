import { beforeEach, describe, expect, it, type Mocked, vi } from 'vitest';
import 'reflect-metadata';
import type { ExternalProductClient } from '@/application/contracts/external-product-client';
import type { OutboxEventRepositories } from '@/application/contracts/repositories/outbox-event-repository';
import type {
  GetCanonicalProductByIdRepository,
  UpdateCanonicalProductRepository,
} from '@/application/contracts/repositories/product-hierarchy';
import { HydrateProductJob } from '@/application/usecases/product-hierarchy/hydrate-product-job';
import { CanonicalProduct, OutboxEvent } from '@/domain';

describe('HydrateProductJob', () => {
  let mockOutboxRepository: Mocked<OutboxEventRepositories>;
  let mockCanonicalProductRepository: Mocked<
    UpdateCanonicalProductRepository & GetCanonicalProductByIdRepository
  >;
  let mockExternalClient: Mocked<ExternalProductClient>;
  let job: HydrateProductJob;

  beforeEach(() => {
    mockOutboxRepository = {
      getPending: vi.fn(),
      update: vi.fn(),
      add: vi.fn(),
    } as unknown as Mocked<OutboxEventRepositories>;
    mockCanonicalProductRepository = {
      getById: vi.fn(),
      update: vi.fn(),
    } as unknown as Mocked<
      UpdateCanonicalProductRepository & GetCanonicalProductByIdRepository
    >;
    mockExternalClient = {
      fetchByBarcode: vi.fn(),
    } as unknown as Mocked<ExternalProductClient>;
    job = new HydrateProductJob(
      mockOutboxRepository,
      mockCanonicalProductRepository,
      mockExternalClient,
      null as unknown as never, // productIdentityRepository (not used in current tests, but required by constructor)
    );
  });

  it('should process pending ProductScanned events and coordinate updates', async () => {
    const cp = CanonicalProduct.create(
      { name: 'Pending enrich', description: 'Pending enrichment' },
      'cp-123',
    );
    const event = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-123', barcode: '123456' },
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue({
      name: 'Enriched Product',
      brand: 'Enriched Brand',
      description: 'Enriched Description',
      source: 'OFF',
      rawPayload: {},
    });
    vi.mocked(mockCanonicalProductRepository.getById).mockResolvedValue(
      cp as never,
    );

    await job.execute();

    expect(mockOutboxRepository.getPending).toHaveBeenCalledWith(10);
    expect(mockOutboxRepository.update).toHaveBeenCalledTimes(2); // markProcessing, markCompleted
    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalledWith('123456');
    expect(mockCanonicalProductRepository.getById).toHaveBeenCalledWith(
      'cp-123',
    );

    expect(mockCanonicalProductRepository.update).toHaveBeenCalled();
    const updatedCpArg = vi.mocked(mockCanonicalProductRepository.update).mock
      .calls[0][0];
    expect(updatedCpArg.props.name).toBe('Enriched Product');
    expect(updatedCpArg.props.brand).toBe('Enriched Brand');

    expect(event.props.status).toBe('completed');
  });

  it('should mark event as failed if external client throws error', async () => {
    const event = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-123', barcode: '123456' },
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);
    vi.mocked(mockExternalClient.fetchByBarcode).mockRejectedValue(
      new Error('Network failure'),
    );

    await job.execute();

    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalled();
    expect(mockCanonicalProductRepository.update).not.toHaveBeenCalled();
    expect(event.props.status).toBe('failed');
    expect(event.props.lastError).toBe('Network failure');
    expect(mockOutboxRepository.update).toHaveBeenCalledTimes(2); // markProcessing, markFailed
  });

  it('should mark event as failed when external data is null', async () => {
    const event = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-123', barcode: '123456' },
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue(null);

    await job.execute();

    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalled();
    expect(mockCanonicalProductRepository.update).not.toHaveBeenCalled();
    expect(event.props.status).toBe('failed');
    expect(event.props.lastError).toContain('No external data found');
  });

  it('should mark event as failed when canonical product is missing', async () => {
    const event = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-123', barcode: '123456' },
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValue({
      name: 'Enriched',
      brand: 'Enriched',
      description: 'Enriched',
      source: 'OFF',
      rawPayload: {},
    });
    vi.mocked(mockCanonicalProductRepository.getById).mockResolvedValue(
      undefined as never,
    );

    await job.execute();

    expect(mockCanonicalProductRepository.getById).toHaveBeenCalledWith(
      'cp-123',
    );
    expect(mockCanonicalProductRepository.update).not.toHaveBeenCalled();
    expect(event.props.status).toBe('failed');
    expect(event.props.lastError).toContain('Canonical product not found');
  });

  it('should handle unknown event types by marking them as failed', async () => {
    const event = OutboxEvent.create(
      {
        type: 'UnknownType',
        payload: { something: 'else' },
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);

    await job.execute();

    expect(event.props.status).toBe('failed');
    expect(event.props.lastError).toContain('Unknown event type');
    expect(mockOutboxRepository.update).toHaveBeenCalled();
  });

  it('should continue processing the batch even if one event fails', async () => {
    const event1 = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-1', barcode: '1' },
      },
      'event-1',
    );
    const event2 = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { canonicalProductId: 'cp-2', barcode: '2' },
      },
      'event-2',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([
      event1,
      event2,
    ]);

    // Event 1 fails (missing data)
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValueOnce(null);
    // Event 2 succeeds
    vi.mocked(mockExternalClient.fetchByBarcode).mockResolvedValueOnce({
      name: 'Success',
      brand: 'Success',
      description: 'Success',
      source: 'OFF',
      rawPayload: {},
    });
    vi.mocked(mockCanonicalProductRepository.getById).mockResolvedValue(
      CanonicalProduct.create({ name: 'Old' }, 'cp-2'),
    );

    await job.execute();

    expect(event1.props.status).toBe('failed');
    expect(event2.props.status).toBe('completed');
    expect(mockOutboxRepository.update).toHaveBeenCalledTimes(4); // (P1, F1) + (P2, C2)
  });

  it('should mark event as failed when payload is missing required fields', async () => {
    const event = OutboxEvent.create(
      {
        type: 'ProductScanned',
        payload: { somethingElse: 'wrong' } as unknown as never,
      },
      'event-1',
    );

    vi.mocked(mockOutboxRepository.getPending).mockResolvedValue([event]);

    await job.execute();

    expect(event.props.status).toBe('failed');
    // It should fail either because fetchByBarcode(undefined) fails or one of the subsequent checks
    expect(mockOutboxRepository.update).toHaveBeenCalled();
  });
});
