import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdtempSync, rmSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

interface PreparedFixture {
  root:string;bundle:string;installation:string;configuration:Record<string,unknown>;
  prepare(port?:number):Promise<PreparedFixture>;close():void;
}
interface FixtureModule {PreparedReleaseFixture:new()=>PreparedFixture;}
interface PlanProjection {id:string;digest:string;expectedComposition:null;blockers:unknown[];artifacts:{kind:string}[];configuration:Record<string,unknown>;recipe:object;pluginBindings:{id:string;provide:string[];inject:string[]}[];}
interface Envelope {command:string;success:boolean;result:PlanProjection|null;blockers:unknown[];references:string[];}
class Task2Planning {
  readonly cli=resolve('packages/cli');
  readonly binary=join(this.cli,'dist/trsd-linux-x64');
  snapshot():string {
    const records:string[]=[];
    for(const args of [['ps','-aq'],['image','ls','--no-trunc','-q'],['volume','ls','-q'],['network','ls','-q']]){const result=spawnSync('docker',['--context','default',...args],{encoding:'utf8'});assert.equal(result.status,0,'Read-only Docker inventory must succeed');records.push(result.stdout.split('\n').sort().join('\n'));}
    for(const path of ['/proc/net/tcp','/proc/net/tcp6']){const listeners:string[]=[];for(const line of readFileSync(path,'utf8').trim().split('\n').slice(1)){const fields=line.trim().split(/\s+/);if(fields[3]==='0A')listeners.push(fields[1]!);}records.push(listeners.sort().join(','));}
    return JSON.stringify(records);
  }
  async plan_changes_no_runtime():Promise<void> {
    const require=createRequire(join(this.cli,'package.json')),module=require('@treeseed-cordis/deployment/testing') as FixtureModule;
    const fixture=await new module.PreparedReleaseFixture().prepare(),cwd=mkdtempSync(join(tmpdir(),'cordis assembled planning '));
    try {
      const configuration=join(cwd,'desired.json');writeFileSync(configuration,JSON.stringify(fixture.configuration));
      const before=this.snapshot(),result=spawnSync(this.binary,['platform','plan','--file',configuration,'--json'],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:20000});
      assert.equal(result.stderr,'');const envelope=JSON.parse(result.stdout) as Envelope;assert.equal(envelope.command,'platform.plan');
      const qualified=/^VERSION_ID="?26\.04/m.test(readFileSync('/etc/os-release','utf8'))&&process.arch==='x64';
      if(!qualified&&process.env.CORDIS_REQUIRE_PLAN!=='1'){assert.equal(result.status,3);assert.equal(envelope.result,null);assert.equal(existsSync(fixture.installation),false);assert.equal(this.snapshot(),before);return;}
      assert.equal(result.status,0,result.stdout);assert.equal(envelope.success,true);assert.ok(envelope.result);const plan=envelope.result;
      assert.equal(plan.expectedComposition,null);assert.deepEqual(plan.blockers,[]);assert.deepEqual(plan.configuration,fixture.configuration);assert.ok(plan.recipe);assert.equal(plan.pluginBindings[0]!.id,'fixture');assert.deepEqual(plan.pluginBindings[0]!.provide,['fixture']);assert.deepEqual(plan.artifacts.map(Task2Planning.kind),['package','image']);
      const reference=join(fixture.installation,'.cordis/plans',plan.id+'.json');assert.deepEqual(envelope.references,[reference]);assert.deepEqual(JSON.parse(readFileSync(reference,'utf8')),plan);assert.equal(statSync(reference).mode&0o777,0o600);assert.equal(statSync(join(fixture.installation,'.cordis')).mode&0o777,0o700);
      const repeat=spawnSync(this.binary,['platform','plan','--file',configuration,'--json'],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']});assert.equal(repeat.status,0);assert.equal(repeat.stdout,result.stdout);
      assert.equal(this.snapshot(),before);assert.deepEqual(readdirSync(fixture.installation),['.cordis']);assert.equal(existsSync(join(fixture.installation,'.cordis/credentials')),false);assert.equal(existsSync(join(fixture.root,'SCRIPT_CANARY')),false);
      writeFileSync(join(fixture.bundle,'archives/plugin.tgz'),'tampered-secret-canary');const blocked=spawnSync(this.binary,['platform','plan','--file',configuration,'--json'],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe']});assert.equal(blocked.status,3);const rejection=JSON.parse(blocked.stdout) as Envelope;assert.equal(rejection.result,null);assert.deepEqual(rejection.references,[]);assert.ok(rejection.blockers.length);assert.ok(!(blocked.stdout+blocked.stderr).includes('tampered-secret-canary'));assert.deepEqual(readdirSync(join(fixture.installation,'.cordis/plans')),[plan.id+'.json']);
    }finally{fixture.close();rmSync(cwd,{recursive:true,force:true});}
  }
  static kind(artifact:{kind:string}):string {return artifact.kind;}
}
const suite=new Task2Planning();
test('assembled: plan_changes_no_runtime with exact local inputs and saved read-back',suite.plan_changes_no_runtime.bind(suite));
