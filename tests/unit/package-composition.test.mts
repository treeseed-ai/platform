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
class PackageCompositionFixtureUnit extends PackageCompositionFixture {

  async sourcePolicy():Promise<void> {
    const require=createRequire(join(this.cli,'package.json'));
    const module=require('@treeseed-cordis/sdk/source-policy') as PolicyModule;
    const policy=new module.SourcePolicy();
    for(const path of ['tests/acceptance/package-composition.test.mts','tests/acceptance/deployment-planning.test.mts','tests/acceptance/native-composition.test.mts'])assert.deepEqual(policy.inspect(path,readFileSync(join(this.root,path),'utf8'),this.root),[]);
  }
}
const suite=new PackageCompositionFixtureUnit();
test("unit: semantic class policy for composition test",suite.sourcePolicy.bind(suite));
