import { beforeEach, describe, expect, it, vi } from 'vitest';
import 'reflect-metadata';
import { HydrateProductJob } from '@/application/usecases/product-hierarchy/hydrate-product-job';
import { CanonicalProduct, OutboxEvent } from '@/domain';

describe('HydrateProductJob', () => {
  let mockOutboxRepository: any;
  let mockCanonicalProductRepository: any;
  let mockExternalClient: any;
  let job: HydrateProductJob;

  beforeEach(() => {
    mockOutboxRepository = {
      getPending: vi.fn(),
      update: vi.fn(),
    };
    mockCanonicalProductRepository = {
      getById: vi.fn(),
      update: vi.fn(),
    };
    mockExternalClient = {
      fetchByBarcode: vi.fn(),
    };
    job = new HydrateProductJob(
      mockOutboxRepository,
      mockCanonicalProductRepository,
      mockExternalClient,
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

    mockOutboxRepository.getPending.mockResolvedValue([event]);
    mockExternalClient.fetchByBarcode.mockResolvedValue({
      name: 'Enriched Product',
      brand: 'Enriched Brand',
      description: 'Enriched Description',
    });
    mockCanonicalProductRepository.getById.mockResolvedValue(cp);

    await job.execute();

    expect(mockOutboxRepository.getPending).toHaveBeenCalledWith(10);
    expect(mockOutboxRepository.update).toHaveBeenCalledTimes(2); // markProcessing, markCompleted
    expect(mockExternalClient.fetchByBarcode).toHaveBeenCalledWith('123456');
    expect(mockCanonicalProductRepository.getById).toHaveBeenCalledWith(
      'cp-123',
    );

    expect(mockCanonicalProductRepository.update).toHaveBeenCalled();
    const updatedCpArg = mockCanonicalProductRepository.update.mock.calls[0][0];
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

    mockOutboxRepository.getPending.mockResolvedValue([event]);
    mockExternalClient.fetchByBarcode.mockRejectedValue(
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

    mockOutboxRepository.getPending.mockResolvedValue([event]);
    mockExternalClient.fetchByBarcode.mockResolvedValue(null);

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

    mockOutboxRepository.getPending.mockResolvedValue([event]);
    mockExternalClient.fetchByBarcode.mockResolvedValue({
      name: 'Enriched',
      brand: 'Enriched',
      description: 'Enriched',
    });
    mockCanonicalProductRepository.getById.mockResolvedValue(null);

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

    mockOutboxRepository.getPending.mockResolvedValue([event]);

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

    mockOutboxRepository.getPending.mockResolvedValue([event1, event2]);

    // Event 1 fails (missing data)
    mockExternalClient.fetchByBarcode.mockResolvedValueOnce(null);
    // Event 2 succeeds
    mockExternalClient.fetchByBarcode.mockResolvedValueOnce({
      name: 'Success',
    });
    mockCanonicalProductRepository.getById.mockResolvedValue(
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
        payload: { somethingElse: 'wrong' } as any,
      },
      'event-1',
    );

    mockOutboxRepository.getPending.mockResolvedValue([event]);

    await job.execute();

    expect(event.props.status).toBe('failed');
    // It should fail either because fetchByBarcode(undefined) fails or one of the subsequent checks
    expect(mockOutboxRepository.update).toHaveBeenCalled();
  });
});
