import { PresentationLifecycle } from './assembly/presentation-lifecycle.mjs';

class FailureProgram {
  private readonly events: string[] = [];
  constructor(private readonly mode: string) {}
  private async operation(): Promise<void> {
    this.events.push('operation');
    if (this.mode.includes('primary')) throw new Error('primary-canary');
  }
  private async first(): Promise<void> {
    this.events.push('first');
    if (this.mode.includes('cleanup')) throw new Error('cleanup-canary');
  }
  private async last(): Promise<void> { this.events.push('last'); }
  async run(): Promise<void> {
    const failures: string[] = [];
    try {
      await new PresentationLifecycle().run(this.operation.bind(this), [
        this.first.bind(this), this.last.bind(this),
      ]);
    } catch (error) {
      const errors = error instanceof AggregateError ? error.errors : [error];
      for (const failure of errors) failures.push((failure as Error).message);
    }
    process.stdout.write(JSON.stringify({ events: this.events, failures }) + '\n');
    process.exitCode = failures.length ? 1 : 0;
  }
}
await new FailureProgram(process.argv[2]!).run();
