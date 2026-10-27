import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer, type Server } from 'node:net';
import {PackageCompositionFixture} from '../support/package-composition-fixture.mts';
class PackageCompositionFixtureAcceptance extends PackageCompositionFixture {

  async artifact():Promise<void> {
    const binary=join(this.cli,'dist/trsd-linux-x64');
    assert.equal(this.sha(readFileSync(binary)),this.composition.owners.cli.artifactSha256,'Assembled binary must match the qualified artifact');
    const cwd=mkdtempSync(join(tmpdir(),'cordis-assembled-'));
    try {
      const version=spawnSync(binary,['--version'],{cwd,encoding:'utf8',env:{...process.env,PATH:''},stdio:['ignore','pipe','pipe']});
      assert.equal(version.status,0);assert.equal(version.stdout,'trsd 0.0.0-cordis.3\n');assert.equal(version.stderr,'');
      const port=await new Promise<number>(this.listen.bind(this));
      const result=spawnSync(binary,['doctor','--json','--installation',join(cwd,'uncreated'),'--port',String(port)],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:15000});
      const envelope=JSON.parse(result.stdout) as {command:string;success:boolean;result:{ready:boolean};problem:object|null};
      assert.equal(envelope.command,'doctor');assert.equal(envelope.success,envelope.result.ready);assert.equal(result.status,envelope.success?0:3);assert.equal(result.stderr,'');
      assert.deepEqual(readdirSync(cwd),[]);
    }finally{rmSync(cwd,{recursive:true,force:true});}
  }
}
const suite=new PackageCompositionFixtureAcceptance();
test("acceptance: exact standalone artifact from foreign cwd without writes",suite.artifact.bind(suite));
