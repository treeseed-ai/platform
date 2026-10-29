import ts from "typescript";
export interface SourceFact {
  kind: string;
  symbol: string;
  value: unknown;
  resolved: boolean;
}
export class SourceFacts {
  readonly entries: SourceFact[] = [];
  constructor(private source: ts.SourceFile) {}
  visit(node: ts.Node): void {
    if (
      ts.isPropertyDeclaration(node) &&
      node.initializer &&
      /^(provide|inject|name)$/.test(node.name.getText(this.source))
    )
      this.record(
        "plugin-declaration",
        node.name.getText(this.source),
        node.initializer,
      );
    if (
      ts.isCallExpression(node) &&
      /\.(plugin|provide|register|select)$/.test(
        node.expression.getText(this.source),
      )
    )
      this.call(node);
    if (ts.isExportDeclaration(node))
      this.entries.push({
        kind: "export",
        symbol: node.getText(this.source),
        value: node.moduleSpecifier?.getText(this.source),
        resolved: true,
      });
    ts.forEachChild(node, this.visit.bind(this));
  }
  private call(node: ts.CallExpression): void {
    const values = node.arguments.map(this.literal.bind(this));
    this.entries.push({
      kind: "registration",
      symbol: node.expression.getText(this.source),
      value: values,
      resolved: !values.some(SourceFacts.unresolved),
    });
  }
  private record(kind: string, symbol: string, node: ts.Node): void {
    const value = this.literal(node);
    this.entries.push({
      kind,
      symbol,
      value,
      resolved: !SourceFacts.unresolved(value),
    });
  }
  private literal(node: ts.Node): unknown {
    if (ts.isStringLiteralLike(node) || ts.isNumericLiteral(node))
      return node.text;
    if (ts.isIdentifier(node)) return { reference: node.text };
    if (ts.isArrayLiteralExpression(node))
      return node.elements.map(this.literal.bind(this));
    if (ts.isObjectLiteralExpression(node)) return this.object(node);
    if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
    if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
    return { unresolved: node.getText(this.source) };
  }
  private object(node: ts.ObjectLiteralExpression): unknown {
    const value: Record<string, unknown> = {};
    for (const property of node.properties) {
      if (!ts.isPropertyAssignment(property))
        return { unresolved: node.getText(this.source) };
      value[property.name.getText(this.source)] = this.literal(
        property.initializer,
      );
    }
    return value;
  }
  private static unresolved(value: unknown): boolean {
    if (Array.isArray(value)) return value.some(SourceFacts.unresolved);
    if (value && typeof value === "object")
      return (
        "unresolved" in value ||
        Object.values(value).some(SourceFacts.unresolved)
      );
    return false;
  }
}
