import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
export interface Framework {version:string;gitHead:string;integrity:string;}
export class NativeCompositionFixture {

  readonly cli=resolve('packages/cli');
}
