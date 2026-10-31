import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

interface QualificationCommand { command: string; args: string[] }
interface QualificationEnvironment {
  prerequisites: QualificationCommand[];
  setup: QualificationCommand[];
}

class QualificationPreparation {
  private static execute(command: QualificationCommand): void {
    const result = spawnSync(command.command, command.args, {
      cwd: process.cwd(), stdio: 'inherit', timeout: 120000,
    });
    if (result.error || result.status !== 0) {
      throw new Error(`Qualification command failed: ${command.command} ${JSON.stringify(command.args)}: ${result.error ?? result.status}`);
    }
  }

  static run(): void {
    const environment = JSON.parse(readFileSync('architecture/environment.json', 'utf8')) as QualificationEnvironment;
    const component = JSON.parse(readFileSync('architecture/components/artifact-diagnostics.json', 'utf8')) as { verification: QualificationCommand[] };
    for (const command of [...environment.prerequisites, ...environment.setup, ...component.verification]) {
      this.execute(command);
    }
  }
}

QualificationPreparation.run();
