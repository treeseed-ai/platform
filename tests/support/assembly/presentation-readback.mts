import { setTimeout as delay } from 'node:timers/promises';

interface ApplicationObservation { phase: string; result: string | null; }

/** Development-only observation: no mutation, fallback readiness or rolling deadline. */
export class PresentationReadback {
  private failure: unknown = new Error('UI_APPLICATION_DEADLINE');
  async wait(read: () => Promise<ApplicationObservation>, until: number): Promise<ApplicationObservation> {
    this.failure = new Error('UI_APPLICATION_DEADLINE');
    while (Date.now() < until) {
      const record = await this.observe(read);
      if (Date.now() >= until) break;
      if (record && ['completed', 'failed', 'cancelled'].includes(record.phase)) return record;
      await delay(100);
    }
    throw this.failure;
  }
  private async observe(read: () => Promise<ApplicationObservation>): Promise<ApplicationObservation | null> {
    try {
      const record = await read();
      this.failure = new Error('UI_APPLICATION_DEADLINE');
      return record;
    } catch (error) {
      if (!(error instanceof Error) || error.message !== 'SERVICE_WORKER_EXCHANGE_FAILED') throw error;
      this.failure = error;
      return null;
    }
  }
}
