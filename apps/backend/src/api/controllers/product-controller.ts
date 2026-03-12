import { inject, injectable } from 'tsyringe';
import { FastifyController } from '../contracts/fastify-controller';
import {
  manualSearchQuerySchema,
  manualSearchResponseSchema,
  productMapper,
  scanProductParamsSchema,
  scanProductResponseSchema,
} from '../helpers';
import type { ManualSearchUseCase } from '@/application/usecases/products/manual-search-use-case';
import type { ScanProductUseCase } from '@/application/usecases/products/scan-product-use-case';
import { injection } from '@/main/di/injection-tokens';
import type { FastifyTypedInstance } from '@/main/fastify';

@injectable()
export class ProductController extends FastifyController {
  constructor(
    @inject(injection.usecases.scanProductUseCase)
    private scanProductUseCase: ScanProductUseCase,
    @inject(injection.usecases.manualSearchUseCase)
    private manualSearchUseCase: ManualSearchUseCase,
  ) {
    super();
  }

  registerRoutes(app: FastifyTypedInstance) {
    app.get(
      '/scan/:barcode',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Escanear produto',
          description: 'Escanear um produto pelo código de barras',
          operationId: 'scanProduct',
          params: scanProductParamsSchema,
          response: {
            200: scanProductResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { barcode } = request.params;
        const result = await this.scanProductUseCase.execute(barcode);
        return reply.send(
          productMapper.toScanResponse({
            barcode,
            ...result,
          }),
        );
      },
    );

    app.get(
      '/search',
      {
        schema: {
          tags: [this.prefix],
          summary: 'Pesquisar produtos',
          description: 'Pesquisar produtos pelo nome ou marca',
          operationId: 'searchProducts',
          querystring: manualSearchQuerySchema,
          response: {
            200: manualSearchResponseSchema,
          },
        },
      },
      async (request, reply) => {
        const { q: query } = request.query;

        const result = await this.manualSearchUseCase.execute(query, 0, 10);
        return reply.send(
          productMapper.toSearchResponse({
            products: result.items.map((item) => ({
              id: item.id,
              name: item.name ?? 'Unknown',
              brand: item.brand,
              imageUrl: item.imageUrl,
              canonicalProductId: item.canonicalProductId,
            })),
          }),
        );
      },
    );
  }
}
