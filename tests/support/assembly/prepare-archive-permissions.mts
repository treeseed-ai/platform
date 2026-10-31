import { chmodSync, lstatSync, readdirSync } from 'node:fs';

class QualificationArchivePermissions {
  static run(): void {
    const files = readdirSync('vendor/task3c').map(name => `vendor/task3c/${name}`);
    for (const path of ['.', 'vendor', 'vendor/task3c', ...files]) {
      const stat = lstatSync(path);
      if (stat.isSymbolicLink()) throw new Error(`Archive path must not be redirected: ${path}`);
      chmodSync(path, stat.mode & 0o755);
    }
  }
}

QualificationArchivePermissions.run();
