import ts from "typescript";
import { format } from "prettier";
import { WorkspaceFiles } from "../workspace/files.js";
import type { Declaration, InventoryFile } from "../model/types.js";

import { SourceFacts } from "./facts.js";

export class SourceParser {
  private source!: ts.SourceFile;
  private result!: InventoryFile;
  async parse(path: string, text: string, blob = ""): Promise<InventoryFile> {
    this.source = ts.createSourceFile(path, text, ts.ScriptTarget.Latest, true);
    this.result = {
      path,
      blob,
      category: SourceParser.category(path),
      declarations: [],
      imports: [],
      exports: [],
      registrations: [],
      diagnostics: [],
    };
    this.visit(this.source);
    const facts = new SourceFacts(this.source);
    facts.visit(this.source);
    this.result.facts = facts.entries;
    await this.measure(text);
    return this.result;
  }
  static category(path: string): string {
    if (path.startsWith("vendor/")) return "vendored";
    if (path.startsWith("dist/")) return "generated";
    if (path.startsWith("tests/")) return "tests";
    if (/\.[cm]?tsx?$|\.(exs?|rs)$/.test(path)) return "source";
    if (/\.md$|^docs\//.test(path)) return "documentation";
    return "configuration";
  }
  private visit(node: ts.Node): void {
    if (
      ts.isDeclarationStatement(node) ||
      ts.isMethodDeclaration(node) ||
      ts.isMethodSignature(node) ||
      ts.isPropertySignature(node) ||
      ts.isConstructorDeclaration(node) ||
      ts.isAccessor(node) ||
      ts.isPropertyDeclaration(node) ||
      ts.isVariableDeclaration(node)
    )
      this.declaration(node);
    this.surface(node);
    ts.forEachChild(node, this.visit.bind(this));
  }
  private surface(node: ts.Node): void {
    if (ts.isImportDeclaration(node))
      this.result.imports.push(
        node.moduleSpecifier.getText(this.source).slice(1, -1),
      );
    if (ts.isExportDeclaration(node) || ts.isExportAssignment(node))
      this.result.exports.push(node.getText(this.source));
    if (
      ts.isCallExpression(node) &&
      /\.(plugin|provide|inject|register|select)$/.test(
        node.expression.getText(this.source),
      )
    )
      this.result.registrations.push(node.getText(this.source));
    if (
      ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      (ts.isFunctionDeclaration(node) && !!node.body)
    )
      this.result.diagnostics.push(
        "CLASS_BEHAVIOR_REQUIRED:" + (this.line(node.getStart()) + 1),
      );
  }
  private declaration(node: ts.Node): void {
    const text = node.getText(this.source);
    const item: Declaration = {
      kind: ts.SyntaxKind[node.kind],
      symbol: this.symbol(node),
      start: this.line(node.getStart()) + 1,
      end: this.line(node.getEnd()) + 1,
      fingerprint: WorkspaceFiles.hash(text),
      exported: this.exported(node),
    };
    this.result.declarations.push(item);
  }
  private exported(node: ts.Node): boolean {
    if (ts.isVariableDeclaration(node))
      return this.exported(node.parent.parent);
    return (
      ts.canHaveModifiers(node) &&
      !!ts.getModifiers(node)?.some(SourceParser.exportModifier)
    );
  }
  private static exportModifier(modifier: ts.Modifier): boolean {
    return modifier.kind === ts.SyntaxKind.ExportKeyword;
  }
  private symbol(node: ts.Node): string {
    const parts: string[] = [];
    let cursor: ts.Node | undefined = node;
    while (cursor && !ts.isSourceFile(cursor)) {
      if (
        "name" in cursor &&
        cursor.name &&
        typeof cursor.name === "object" &&
        "getText" in cursor.name
      )
        parts.unshift((cursor.name as ts.Node).getText(this.source));
      else if (ts.isConstructorDeclaration(cursor))
        parts.unshift("constructor");
      cursor = cursor.parent;
    }
    return (
      parts.join(".") ||
      ts.SyntaxKind[node.kind] + "@" + (this.line(node.getStart()) + 1)
    );
  }
  private line(position: number): number {
    return this.source.getLineAndCharacterOfPosition(position).line;
  }
  private async measure(text: string): Promise<void> {
    try {
      const formatted = await format(text, {
        parser: this.result.path.endsWith("tsx") ? "typescript" : "typescript",
      });
      const source = ts.createSourceFile(
        this.result.path,
        formatted,
        ts.ScriptTarget.Latest,
        true,
      );
      this.measureNode(source, source);
    } catch (error) {
      this.result.diagnostics.push("PARSE_ERROR: " + String(error));
    }
  }
  private measureNode(source: ts.SourceFile, node: ts.Node): void {
    if (
      (ts.isMethodDeclaration(node) ||
        ts.isConstructorDeclaration(node) ||
        ts.isAccessor(node)) &&
      node.body
    ) {
      const symbolSource = this.source;
      this.source = source;
      const symbol = this.symbol(node);
      this.source = symbolSource;
      const declaration = this.result.declarations.find(
        SourceParser.matches.bind(null, symbol),
      );
      if (declaration)
        declaration.bodyLines = SourceParser.bodyLines(
          node.body.getText(source),
        );
    }
    ts.forEachChild(node, this.measureNode.bind(this, source));
  }
  private static matches(symbol: string, item: Declaration): boolean {
    return item.symbol === symbol;
  }
  static bodyLines(body: string): number {
    const text = body.slice(1, -1);
    const scanner = ts.createScanner(
      ts.ScriptTarget.Latest,
      true,
      ts.LanguageVariant.Standard,
      text,
    );
    const lines = new Set<number>();
    while (scanner.scan() !== ts.SyntaxKind.EndOfFileToken)
      SourceParser.tokenLines(
        text,
        scanner.getTokenPos(),
        scanner.getTextPos(),
        lines,
      );
    return lines.size;
  }
  private static tokenLines(
    text: string,
    start: number,
    end: number,
    lines: Set<number>,
  ): void {
    for (let index = start; index < end; index++)
      if (!/\s/.test(text[index]))
        lines.add(text.slice(0, index).split("\n").length);
  }
}
