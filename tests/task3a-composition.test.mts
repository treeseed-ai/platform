import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';

interface Framework {version:string;gitHead:string;integrity:string;}
class Task3AComposition {
  readonly cli=resolve('packages/cli');
  framework():void {
    const record=JSON.parse(readFileSync('composition/task3a.json','utf8')) as {framework:Framework};
    const metadata=JSON.parse(readFileSync(join(this.cli,'node_modules/cordis/package.json'),'utf8')) as {version:string};
    assert.equal(record.framework.version,'4.0.0-rc.12');assert.equal(metadata.version,record.framework.version);
    assert.equal(record.framework.gitHead,'01b396240ce47cf2779c40af9bc445bb748fe112');
    assert.ok(readFileSync(join(this.cli,'bun.lock'),'utf8').includes(record.framework.integrity));
    const projection=JSON.parse(readFileSync(join(this.cli,'node_modules/@treeseed-cordis/sdk/dist/contract.json'),'utf8')) as {version:string};
    assert.equal(projection.version,'0.3.0-cordis.1');
  }
  executable():void {
    // Execute the exact owner's committed public verification program; never import checkout source.
    // It prepares real immutable ESM packages and invokes the built binary from a foreign cwd,
    // through a symlink and with PATH empty. It also checks native identity, alternatives,
    // tampering, metadata/closure rejection, constructor failure and awaited effect cleanup.
    const result=spawnSync('bun',['test','tests/cli-program.test.ts','--timeout','60000','--test-name-pattern','^smoke: (compiled_cli|installed provider|provider constructors|prepared-provider)'],{cwd:this.cli,encoding:'utf8',timeout:90000,maxBuffer:1024*1024});
    assert.equal(result.status,0,result.stdout+result.stderr);assert.match(result.stderr,/4 pass/);assert.match(result.stderr,/0 fail/);
  }
}
const suite=new Task3AComposition();
test('assembled: exact published Cordis and portable provider contract identities',suite.framework.bind(suite));
test('assembled: compiled CLI uses prepared native providers and awaited cleanup',suite.executable.bind(suite));
