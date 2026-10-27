import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer, type Server } from 'node:net';
import {SourceCustodyContract as PackageCompositionFixture} from '../integration/source-custody-contract.mts';
class PackageCompositionFixtureIntegration extends PackageCompositionFixture {

  closure():void {
    const pins=this.composition.owners;
    const cliManifest=JSON.parse(readFileSync(join(this.cli,'package.json'),'utf8')) as Manifest;
    assert.equal(this.composition.schemaVersion,1);
    for(const owner of ['sdk','deployment'] as const) {
      const archive=join(this.cli,'vendor',owner+'.tgz');const declaration=cliManifest.cordisCandidate[owner]!;
      assert.equal(declaration.commit,pins[owner].commit);assert.equal(declaration.repository,pins[owner].repository);
      assert.equal(this.sha(readFileSync(archive)),pins[owner].archiveSha256);assert.equal(declaration.sha256,pins[owner].archiveSha256);
      const entry=owner==='sdk'?'contracts':'diagnose';
      assert.deepEqual(readFileSync(join(this.cli,'node_modules/@treeseed-cordis',owner,'dist/src',entry+'.js')),this.readArchive(archive,'dist/src/'+entry+'.js'));
    }
    const deployment=JSON.parse(this.readArchive(join(this.cli,'vendor/deployment.tgz'),'package.json').toString()) as Manifest;
    assert.equal(deployment.cordisCandidate.sdk.commit,pins.sdk.commit);assert.equal(deployment.cordisCandidate.sdk.sha256,pins.sdk.archiveSha256);
    this.assertSource(this.cli,pins.cli.tree);
    assert.match(readFileSync(join(this.root,'.github/workflows/verify.yml'),'utf8'),new RegExp(pins.cli.commit));
  }
}
const suite=new PackageCompositionFixtureIntegration();
test("integration: exact owner archives, installed exports and source identity",suite.closure.bind(suite));
