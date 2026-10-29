import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { LanguageService } from '../../../architecture/studio/src/language/service.js';
import { ComparisonService } from '../../../architecture/studio/src/comparison/service.js';

class LanguageTests {
  static lexical(): void {
    const language = new LanguageService(resolve('architecture/language'));
    assert.throws(language.parse.bind(language, 'a: 1\na: 2'), /DUPLICATE_KEY/);
    assert.throws(language.parse.bind(language, 'a: &x 1\nb: *x'), /YAML_ANCHOR|YAML_ALIAS/);
  }
  static conformance(): void {
    const language = new LanguageService(resolve('architecture/language'));
    const cases = language.parse(readFileSync('architecture/examples/cases.yaml', 'utf8')) as { cases: Array<{file:string;layer:string;expected:string}> };
    for (const item of cases.cases) {
      if (!['valid', 'schema', 'lexical'].includes(item.layer)) continue;
      const text = readFileSync('architecture/examples/' + item.file, 'utf8');
      const results = language.inspect(text);
      assert.equal(results.length === 0, item.layer === 'valid', item.file);
    }
  }
  static unspecified(): void {
    const comparison = new ComparisonService();
    const observed = { id: 'component.a', kind: 'component', name: 'A', dependencies: ['component.b'] };
    const intended = { id: 'component.a', kind: 'component', name: 'A' };
    assert.equal(comparison.objects([observed], [intended]).length, 0);
  }
}
test('restricted YAML rejects duplicate keys and references', LanguageTests.lexical);
test('existing structural and lexical examples execute', LanguageTests.conformance);
test('omitted intent properties remain unspecified', LanguageTests.unspecified);
