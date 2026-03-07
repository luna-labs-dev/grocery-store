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
});
