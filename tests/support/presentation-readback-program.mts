import { setTimeout as delay } from 'node:timers/promises';
import { PresentationReadback } from './assembly/presentation-readback.mjs';
import { PlanningBlockedError } from '@treeseed-cordis/sdk';

class ReadbackProgram {
  private calls = 0;
  constructor(private readonly mode: string) {}
  private async read(): Promise<{ phase: string; result: string | null }> {
    this.calls++;
    if (this.mode === 'fatal') throw new Error('UNKNOWN_FAILURE');
    if (this.mode === 'blocked') throw new PlanningBlockedError([{ code: 'AUTHORITY_DENIED', message: 'Denied.' }]);
    if (this.mode === 'disconnect' || (this.mode === 'transient' && this.calls === 1))
      throw new Error('SERVICE_WORKER_EXCHANGE_FAILED');
    if (this.mode === 'late') await delay(100);
    if (this.mode === 'failed' || this.mode === 'cancelled') return { phase: this.mode, result: null };
    if (this.mode !== 'late' && this.calls < (this.mode === 'transient' ? 3 : 2))
      return { phase: 'stage', result: null };
    return { phase: 'completed', result: 'ready' };
  }
  async run(): Promise<void> {
    let error: string | null = null;
    try {
      const budget = this.mode === 'late' ? 50 : this.mode === 'disconnect' ? 250 : 3000;
      const record = await new PresentationReadback().wait(this.read.bind(this), Date.now() + budget);
      if (record.phase !== 'completed' || record.result !== 'ready') throw new Error('NOT_READY');
    } catch (failure) {
      error = failure instanceof PlanningBlockedError ? 'BLOCKER_UNCHANGED' : (failure as Error).message;
    }
    process.stdout.write(JSON.stringify({ calls: this.calls, error }) + '\n');
    process.exitCode = error === null ? 0 : 1;
  }
}
await new ReadbackProgram(process.argv[2]!).run();
