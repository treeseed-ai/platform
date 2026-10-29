import {
  Data,
  type Inventory,
  type Diagnostic,
  type Repository,
  type InventoryFile,
} from "../model/types.js";
import { GitSource } from "./git.js";

export class SourcePolicy {
  constructor(private git: GitSource) {}
  check(repository: Repository, inventory: Inventory): Diagnostic[] {
    const policy = this.policy(repository);
    const result: Diagnostic[] = [];
    const used = new Set<string>();
    for (const file of inventory.files) this.file(file, policy, result, used);
    for (const exception of Data.records(policy.exceptions))
      if (!used.has(String(exception.fingerprint)))
        result.push({
          code: "STALE_EXCEPTION",
          status: "violated",
          message: String(exception.symbol),
        });
    return result;
  }
  private file(
    file: InventoryFile,
    policy: Record<string, unknown>,
    result: Diagnostic[],
    used: Set<string>,
  ): void {
    if (!["source", "tests"].includes(file.category)) return;
    this.layout(file.path, result);
    for (const declaration of file.declarations)
      this.declaration(file.path, declaration, policy, result, used);
    for (const diagnostic of file.diagnostics)
      result.push({
        code: diagnostic.split(":")[0],
        status: "violated",
        path: file.path,
        message: diagnostic,
      });
  }
  private declaration(
    path: string,
    declaration: InventoryFile["declarations"][number],
    policy: Record<string, unknown>,
    result: Diagnostic[],
    used: Set<string>,
  ): void {
    if ((declaration.bodyLines ?? 0) <= 20) return;
    const identity = {
      file: path,
      symbol: declaration.symbol,
      fingerprint: declaration.fingerprint,
    };
    const accepted = this.matches(policy.exceptions, identity);
    if (accepted) used.add(declaration.fingerprint);
    const debt = this.matches(policy.violations, identity);
    result.push({
      code: accepted
        ? "ACCEPTED_EXCEPTION"
        : debt
          ? "HISTORICAL_DEBT"
          : "METHOD_TOO_LONG",
      status: accepted ? "satisfied" : "violated",
      subject: declaration.symbol,
      path,
      message: declaration.bodyLines + " canonical body lines",
    });
  }
  private policy(repository: Repository): Record<string, unknown> {
    try {
      return JSON.parse(
        this.git.read({
          project: repository.project,
          revision: repository.revision,
          path: ".readability.json",
        }),
      );
    } catch {
      return {};
    }
  }
  private matches(
    entries: unknown,
    identity: { file: string; symbol: string; fingerprint: string },
  ): boolean {
    for (const entry of Data.records(entries))
      if (
        entry.file === identity.file &&
        entry.fingerprint === identity.fingerprint &&
        String(entry.symbol)
          .replace(".static ", ".")
          .replace(".get ", ".")
          .replace(".set ", ".") === identity.symbol
      )
        return true;
    return false;
  }
  private layout(path: string, result: Diagnostic[]): void {
    if (!/\.(test|spec)\.[cm]?tsx?$/.test(path)) return;
    if (
      !/^tests\/(acceptance|integration|regression|unit)\//.test(path) ||
      /(?:task|phase)\d/i.test(path)
    )
      result.push({
        code: "TEST_TIER_PLACEMENT",
        status: "violated",
        path,
        message:
          "Executable specifications belong in named behavioral test tiers",
      });
  }
}
