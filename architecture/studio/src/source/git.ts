import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import type { Binding, Repository } from "../model/types.js";

export class GitSource {
  constructor(readonly roots: Record<string, string>) {}
  run(project: string, args: string[]): string {
    if (!this.roots[project]) throw new Error("UNKNOWN_REPOSITORY: " + project);
    return execFileSync(
      "git",
      ["-C", realpathSync(this.roots[project]), ...args],
      { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 30000 },
    );
  }
  revision(project: string, revision: string): string {
    if (!/^[a-f0-9]{40}$/.test(revision))
      throw new Error("EXACT_REVISION_REQUIRED");
    const actual = this.run(project, [
      "rev-parse",
      "--verify",
      revision + "^{commit}",
    ]).trim();
    if (actual !== revision) throw new Error("REVISION_MISMATCH");
    return actual;
  }
  read(binding: Binding): string {
    this.revision(binding.project, binding.revision);
    if (
      !binding.path ||
      /^\/|^[A-Za-z]:|\\|(?:^|\/)\.{1,2}(?:\/|$)/.test(binding.path)
    )
      throw new Error("PATH_ESCAPE");
    const entry = this.run(binding.project, [
      "ls-tree",
      binding.revision,
      "--",
      binding.path,
    ]);
    if (!entry || entry.startsWith("120000"))
      throw new Error(entry ? "RESOLVED_PATH_ESCAPE" : "MISSING_SOURCE");
    return this.run(binding.project, [
      "show",
      binding.revision + ":" + binding.path,
    ]);
  }
  files(
    repository: Repository,
  ): Array<{ path: string; blob: string; mode: string }> {
    this.revision(repository.project, repository.revision);
    const result: Array<{ path: string; blob: string; mode: string }> = [];
    for (const entry of this.run(repository.project, [
      "ls-tree",
      "-rz",
      repository.revision,
    ]).split("\0")) {
      if (!entry) continue;
      const [metadata, path] = entry.split("\t");
      const [mode, , blob] = metadata.split(" ");
      result.push({ mode, blob, path });
    }
    return result;
  }
}
