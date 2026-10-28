/** Development fixture lifecycle: retain primary errors and attempt every cleanup step. */
export class PresentationLifecycle {
  async run(operation: () => Promise<void>, cleanup: Array<() => Promise<void>>): Promise<void> {
    const failures: unknown[] = [];
    try { await operation(); }
    catch (error) { failures.push(error); }
    for (const close of cleanup) {
      try { await close(); }
      catch (error) { failures.push(error); }
    }
    if (failures.length === 1) throw failures[0];
    if (failures.length > 1) throw new AggregateError(failures, 'Presentation and cleanup failed');
  }
}
