import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import {NativeCompositionFixture} from '../support/native-composition-fixture.mts';
class NativeCompositionFixtureIntegration extends NativeCompositionFixture {

  framework():void {
    const record=JSON.parse(readFileSync('composition/task3a.json','utf8')) as {framework:Framework};
    const metadata=JSON.parse(readFileSync(join(this.cli,'node_modules/cordis/package.json'),'utf8')) as {version:string};
    assert.equal(record.framework.version,'4.0.0-rc.12');assert.equal(metadata.version,record.framework.version);
    assert.equal(record.framework.gitHead,'01b396240ce47cf2779c40af9bc445bb748fe112');
    assert.ok(readFileSync(join(this.cli,'bun.lock'),'utf8').includes(record.framework.integrity));
    const projection=JSON.parse(readFileSync(join(this.cli,'node_modules/@treeseed-cordis/sdk/dist/contract.json'),'utf8')) as {contractVersion:string};
    assert.equal(projection.contractVersion,'0.3.0-cordis.1');
  }
}
const suite=new NativeCompositionFixtureIntegration();
test("integration: exact published Cordis and portable provider contract identities",suite.framework.bind(suite));
