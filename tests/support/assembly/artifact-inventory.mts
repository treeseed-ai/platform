import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import { PackageArchiveInspector } from "@treeseed-cordis/deployment";

type Files = Awaited<
  ReturnType<typeof PackageArchiveInspector.inspect>
>["files"];
type FileEntry = Files[number];
type ChangeKind = "added" | "removed" | "modified";
interface Change {
  path: string;
  before: FileEntry | null;
  after: FileEntry | null;
  kind: ChangeKind;
}
interface Evidence {
  formatVersion: 1;
  owners: Record<string, { sha256: string; files: Files }>;
}

/** Public archive inspection only. Diagnostics contain names/digests/modes, never file bodies. */
class ArtifactFiles {
  private static sha(path: string): string {
    return createHash("sha256").update(readFileSync(path)).digest("hex");
  }

  private static codePoint(value: string): number {
    return value.codePointAt(0)!;
  }

  private static comparePaths(left: string, right: string): number {
    const leftPoints = Array.from(left, this.codePoint.bind(this));
    const rightPoints = Array.from(right, this.codePoint.bind(this));
    const limit = Math.min(leftPoints.length, rightPoints.length);
    for (let index = 0; index < limit; index += 1) {
      if (leftPoints[index] !== rightPoints[index]) {
        return leftPoints[index]! - rightPoints[index]!;
      }
    }
    return leftPoints.length - rightPoints.length;
  }

  private static compareChanges(left: Change, right: Change): number {
    return this.comparePaths(left.path, right.path);
  }

  static async run(): Promise<void> {
    const composition = JSON.parse(
      readFileSync("composition/task3c.json", "utf8"),
    );
    if (process.argv[2] === "record") return this.record(composition);
    const owner = process.argv[2]!;
    const path = resolve(process.argv[3]!);
    const sha256 = this.sha(path);
    const expectedSha =
      composition.uiQualification.expectedArtifacts[owner]?.sha256;
    if (owner === "cli") return this.reportCli(owner, expectedSha, sha256);
    const expectedFiles = this.expectedFiles(owner, expectedSha);
    const actualFiles = (await PackageArchiveInspector.inspect(path, sha256))
      .files;
    const changes = this.differences(expectedFiles, actualFiles);
    process.stdout.write(
      JSON.stringify({ owner, expectedSha, actualSha: sha256, changes }) + "\n",
    );
  }

  private static reportCli(
    owner: string,
    expectedSha: string | undefined,
    actualSha: string,
  ): void {
    process.stdout.write(
      JSON.stringify({ owner, expectedSha, actualSha }) + "\n",
    );
  }

  private static async record(composition: any): Promise<void> {
    const receipt = JSON.parse(
      readFileSync(
        "tests/support/assembly/dist/ui/closure/ui-owner-closure.json",
        "utf8",
      ),
    );
    const evidence: Evidence = { formatVersion: 1, owners: {} };
    for (const owner of ["admin", "api"])
      await this.recordOwner(owner, receipt, composition, evidence);
    writeFileSync(
      "composition/task3c-ui-artifact-files.json",
      JSON.stringify(evidence, null, 2) + "\n",
      { flag: "wx" },
    );
  }

  private static async recordOwner(
    owner: string,
    receipt: any,
    composition: any,
    evidence: Evidence,
  ): Promise<void> {
    const item = receipt.owners[owner];
    const sha256 = this.sha(item.path);
    const expectedSha =
      composition.uiQualification.expectedArtifacts[owner].sha256;
    if (sha256 !== expectedSha) throw new Error("ARTIFACT_SELECTION_REQUIRED");
    const files = (
      await PackageArchiveInspector.inspect(resolve(item.path), sha256)
    ).files;
    evidence.owners[owner] = { sha256, files };
  }

  private static expectedFiles(owner: string, expectedSha?: string): Files {
    if (!["admin", "api"].includes(owner) || !expectedSha) {
      throw new Error("ARTIFACT_SELECTION_REQUIRED");
    }
    const evidence = JSON.parse(
      readFileSync("composition/task3c-ui-artifact-files.json", "utf8"),
    ) as Evidence;
    const expected = evidence.owners[owner]!;
    if (expected.sha256 !== expectedSha)
      throw new Error("ARTIFACT_SELECTION_REQUIRED");
    return expected.files;
  }

  private static differences(expected: Files, actual: Files): Change[] {
    const changes: Change[] = [];
    for (const before of expected) {
      const after = this.findFile(actual, before.path);
      const kind = this.changeKind(before, after);
      if (kind)
        changes.push({ path: before.path, before, after: after ?? null, kind });
    }
    for (const after of actual) {
      if (!this.hasPath(expected, after.path))
        changes.push({ path: after.path, before: null, after, kind: "added" });
    }
    return changes.sort(this.compareChanges.bind(this));
  }

  private static findFile(files: Files, path: string): FileEntry | undefined {
    for (const file of files) if (file.path === path) return file;
    return undefined;
  }

  private static changeKind(
    before: FileEntry,
    after?: FileEntry,
  ): ChangeKind | null {
    if (!after) return "removed";
    if (JSON.stringify(before) !== JSON.stringify(after)) return "modified";
    return null;
  }

  private static hasPath(files: Files, path: string): boolean {
    for (const file of files) if (file.path === path) return true;
    return false;
  }
}

await ArtifactFiles.run();
