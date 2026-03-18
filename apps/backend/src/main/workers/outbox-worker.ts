import { inject, singleton } from 'tsyringe';
import type { IHydrateProductJob } from '@/domain/usecases/product-hydrator';
import { injection } from '@/main/di/injection-tokens';

const { usecases } = injection;

@singleton()
export class OutboxWorker {
  private timer: NodeJS.Timeout | null = null;
  private isRunning = false;

  constructor(
    @inject(usecases.productHydratorJob)
    private readonly productHydrator: IHydrateProductJob,
    private readonly intervalMs: number = 5000,
  ) {}

  public start(): void {
    if (this.timer) {
      return;
    }

    console.log(`[OutboxWorker] Started (Interval: ${this.intervalMs}ms)`);
    this.timer = setInterval(() => this.tick(), this.intervalMs);
    // initial tick
    this.tick();
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      console.log('[OutboxWorker] Stopped');
    }
  }

  private async tick(): Promise<void> {
    if (this.isRunning) return;

    this.isRunning = true;
    try {
      await this.productHydrator.execute();
    } catch (error) {
      console.error('[OutboxWorker] Error during tick:', error);
    } finally {
      this.isRunning = false;
    }
  }
}
