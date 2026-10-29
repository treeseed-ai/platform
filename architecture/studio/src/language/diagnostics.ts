import type { Diagnostic } from "../model/types.js";
export class Diagnostics {
  readonly items: Diagnostic[] = [];
  add(
    code: string,
    subject: string,
    message: string,
    status: Diagnostic["status"] = "violated",
  ): void {
    this.items.push({ code, subject, message, status });
  }
}
