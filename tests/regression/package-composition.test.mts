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
class PackageCompositionFixtureRegression extends PackageCompositionFixture {

  mergeIdentity():void {
    const directory=mkdtempSync(join(tmpdir(),'cordis-merge-'));
    try {
      this.git(directory,['init','--quiet']);writeFileSync(join(directory,'candidate.txt'),'accepted');
      this.git(directory,['add','candidate.txt']);this.git(directory,['commit','--quiet','-m','candidate']);
      const candidate=this.git(directory,['rev-parse','HEAD^{tree}']);this.git(directory,['commit','--quiet','--allow-empty','-m','same tree at different commit']);
      this.assertSource(directory,candidate);
      writeFileSync(join(directory,'candidate.txt'),'changed');assert.throws(this.assertSource.bind(this,directory,candidate));this.git(directory,['add','candidate.txt']);this.git(directory,['commit','--quiet','-m','changed tree']);
      assert.throws(this.assertSource.bind(this,directory,candidate));
    }finally {rmSync(directory,{recursive:true,force:true});}
  }
}
const suite=new PackageCompositionFixtureRegression();
test("regression: accepted source survives commit rewrite but rejects changed trees",suite.mergeIdentity.bind(suite));
