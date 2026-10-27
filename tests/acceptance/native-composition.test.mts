import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {NativeCompositionFixture} from '../support/native-composition-fixture.mts';
class NativeCompositionFixtureAcceptance extends NativeCompositionFixture {

  executable():void {
    // Execute the exact owner's committed public verification program; never import checkout source.
    // It prepares real immutable ESM packages and invokes the built binary from a foreign cwd,
    // through a symlink and with PATH empty. It also checks native identity, alternatives,
    // tampering, metadata/closure rejection, constructor failure and awaited effect cleanup.
    const result=spawnSync('bun',['test','tests/cli-program.test.ts','--timeout','60000','--test-name-pattern','^smoke: (compiled_cli|installed provider|provider constructors|prepared-provider)'],{cwd:this.cli,encoding:'utf8',timeout:90000,maxBuffer:1024*1024});
    assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stderr,/4 pass/);assert.match(result.stderr,/0 fail/);
  }
}
const suite=new NativeCompositionFixtureAcceptance();
test("acceptance: compiled CLI uses prepared native providers and awaited cleanup",suite.executable.bind(suite));
