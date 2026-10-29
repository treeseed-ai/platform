import { createHash } from "node:crypto";
import {
  existsSync,
  realpathSync,
  readFileSync,
  mkdirSync,
  writeFileSync,
  renameSync,
  unlinkSync,
} from "node:fs";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import type { Change } from "../model/types.js";

export class WorkspaceFiles {
  readonly root: string;
  constructor(root: string) {
    this.root = realpathSync(root);
  }
  static hash(text: string): string {
    return createHash("sha256").update(text).digest("hex");
  }
  path(path: string): string {
    if (
      !path ||
      isAbsolute(path) ||
      /^[A-Za-z]:/.test(path) ||
      path.includes("\\") ||
      path.split("/").some(WorkspaceFiles.badSegment)
    )
      throw new Error("PATH_ESCAPE");
    const result = resolve(this.root, path);
    let parent = result;
    while (!existsSync(parent)) parent = dirname(parent);
    const actual = relative(this.root, realpathSync(parent));
    if (actual === ".." || actual.startsWith("../") || isAbsolute(actual))
      throw new Error("RESOLVED_PATH_ESCAPE");
    return result;
  }
  private static badSegment(segment: string): boolean {
    return segment === "." || segment === ".." || segment === "";
  }
  read(path: string): string {
    return readFileSync(this.path(path), "utf8");
  }
  current(path: string): string {
    return existsSync(this.path(path))
      ? WorkspaceFiles.hash(this.read(path))
      : "";
  }
  write(path: string, text: string): void {
    const target = this.path(path);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target + ".studio-tmp", text, { mode: 0o600 });
    renameSync(target + ".studio-tmp", target);
  }
  transaction(changes: Change[]): void {
    this.recover();
    const paths = new Set<string>();
    for (const change of changes) {
      if (paths.has(change.path)) throw new Error("DUPLICATE_WRITE");
      paths.add(change.path);
      if (this.current(change.path) !== change.expected)
        throw new Error("CONFLICT: " + change.path);
    }
    this.write(".studio/transaction.json", JSON.stringify(changes));
    this.recover();
  }
  recover(): void {
    const journal = this.path(".studio/transaction.json");
    if (!existsSync(journal)) return;
    const changes = JSON.parse(readFileSync(journal, "utf8")) as Change[];
    for (const change of changes) {
      const hash = this.current(change.path);
      if (hash !== change.expected && hash !== WorkspaceFiles.hash(change.text))
        throw new Error("RECOVERY_CONFLICT: " + change.path);
    }
    for (const change of changes) this.write(change.path, change.text);
    unlinkSync(journal);
  }
}
