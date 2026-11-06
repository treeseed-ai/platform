import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';

/** Development-only inspection of the instruction artifact; never used by application code. */
export class GuidanceDocument {
  readonly path: string;
  readonly source: string;

  constructor(path: string, source = readFileSync(path, 'utf8')) {
    this.path = path;
    this.source = source;
  }

  metadata(): string[] {
    const front = /^---\n([\s\S]*?)\n---\n/.exec(this.source);
    if (!front) return ['invalid or absent skill metadata'];
    const name = /^name: ([a-z0-9-]+)$/m.exec(front[1]);
    const description = /^description: (.+)$/m.exec(front[1]);
    if (!name || !description || !description[1].replace(/["']/g, '').trim()) return ['invalid skill fields'];
    return name[1] === basename(dirname(this.path)) ? [] : ['skill name differs from directory'];
  }

  examples(): string[] {
    return /^\s*(?:`{3,}|~{3,})|^(?: {4}|\t)\S/m.test(this.source) ? ['embedded code example'] : [];
  }

  links(): string[] {
    const missing: string[] = [];
    for (const match of this.source.matchAll(/\[[^\]]*\]\(([^)]+)\)/g)) {
      const target = match[1];
      if (/^[a-z][a-z\d+.-]*:/i.test(target)) continue;
      const path = target.split('#')[0];
      if (!existsSync(path ? resolve(dirname(this.path), path) : this.path)) missing.push(target);
    }
    return missing;
  }

  absentSkills(root: string): string[] {
    const missing: string[] = [];
    for (const match of this.source.matchAll(/superpowers:([a-z-]+)/g)) {
      if (!existsSync(join(root, '.agents/skills', match[1], 'SKILL.md'))) missing.push(match[1]);
    }
    return missing;
  }

  githubCommands(): string[] {
    const invalid: string[] = [];
    for (const line of this.source.split('\n')) {
      if (/\bgh pr create\b/.test(line) && !/--base\s+cordis\b/.test(line)) invalid.push(line);
      if (/--approve\b|\bgh auth token\b|\bgh issue close\b|\bgh release (create|upload|delete|edit)\b/.test(line)) invalid.push(line);
      if (/\bgit tag -(s|a|d)\b|\bnpm (publish|dist-tag)\b|\baffaan-m\/ECC\b|\bCloses\s+#/i.test(line)) invalid.push(line);
    }
    return invalid;
  }
}

/** Discover actual installed entry points rather than assuming an upstream catalog. */
export class GuidancePackage {
  readonly root: string;

  constructor(root = resolve(process.env.SKILL_REVIEW_ROOT ?? process.cwd())) {
    this.root = root;
  }

  documents(): GuidanceDocument[] {
    const documents: GuidanceDocument[] = [];
    const skills = join(this.root, '.agents/skills');
    for (const name of readdirSync(skills)) {
      const path = join(skills, name, 'SKILL.md');
      if (existsSync(path)) documents.push(new GuidanceDocument(path));
    }
    return documents;
  }

  problems(): string[] {
    const problems: string[] = [];
    for (const document of this.documents()) {
      problems.push(...document.metadata(), ...document.examples(), ...document.links());
      problems.push(...document.absentSkills(this.root));
    }
    return problems;
  }
}
