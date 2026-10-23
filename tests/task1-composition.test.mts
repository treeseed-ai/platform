import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, rmSync, readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer, type Server } from 'node:net';

interface Candidate {repository:string;commit:string;baseline:string;archiveSha256?:string;artifactSha256?:string;}
interface Composition {schemaVersion:number;owners:{sdk:Candidate;deployment:Candidate;cli:Candidate};}
interface Manifest {cordisCandidate:{sdk:Candidate;deployment?:Candidate};}
interface PolicyModule {SourcePolicy:new()=>{inspect(file:string,source:string,root:string):string[]};}
class Task1Composition {
  readonly root=resolve(process.cwd());
  readonly cli=join(this.root,'packages/cli');
  readonly composition=JSON.parse(readFileSync(join(this.root,'composition/task1.json'),'utf8')) as Composition;
  server:Server|null=null;
  completion:((port:number)=>void)|null=null;
  sha(bytes:Uint8Array):string {return createHash('sha256').update(bytes).digest('hex');}
  readArchive(archive:string,path:string):Buffer {
    const result=spawnSync('tar',['-xOf',archive,'package/'+path],{maxBuffer:4*1024*1024});
    assert.equal(result.status,0,'Candidate archive read must succeed');return result.stdout;
  }
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
    const head=spawnSync('git',['-C',this.cli,'rev-parse','HEAD'],{encoding:'utf8'});
    assert.equal(head.status,0);assert.equal(head.stdout.trim(),pins.cli.commit);
    assert.match(readFileSync(join(this.root,'.github/workflows/verify.yml'),'utf8'),new RegExp(pins.cli.commit));
  }
  async sourcePolicy():Promise<void> {
    const require=createRequire(join(this.cli,'package.json'));
    const module=await import(require.resolve('@treeseed-cordis/sdk/source-policy')) as PolicyModule;
    const policy=new module.SourcePolicy();
    assert.deepEqual(policy.inspect('tests/task1-composition.test.mts',readFileSync(join(this.root,'tests/task1-composition.test.mts'),'utf8'),this.root),[]);
  }
  listen(completion:(port:number)=>void):void {this.completion=completion;this.server=createServer();this.server.listen(0,'127.0.0.1',this.listening.bind(this));}
  listening():void {const address=this.server!.address();assert.equal(typeof address,'object');this.completion!((address as {port:number}).port);this.server!.close();}
  async artifact():Promise<void> {
    const binary=join(this.cli,'dist/trsd-linux-x64');
    assert.equal(this.sha(readFileSync(binary)),this.composition.owners.cli.artifactSha256,'Assembled binary must match the qualified artifact');
    const cwd=mkdtempSync(join(tmpdir(),'cordis-assembled-'));
    try {
      const version=spawnSync(binary,['--version'],{cwd,encoding:'utf8',env:{...process.env,PATH:''},stdio:['ignore','pipe','pipe']});
      assert.equal(version.status,0);assert.equal(version.stdout,'trsd 0.0.0-cordis.1\n');assert.equal(version.stderr,'');
      const port=await new Promise<number>(this.listen.bind(this));
      const result=spawnSync(binary,['doctor','--json','--installation',join(cwd,'uncreated'),'--port',String(port)],{cwd,encoding:'utf8',stdio:['ignore','pipe','pipe'],timeout:15000});
      const envelope=JSON.parse(result.stdout) as {command:string;success:boolean;result:{ready:boolean};problem:object|null};
      assert.equal(envelope.command,'doctor');assert.equal(envelope.success,envelope.result.ready);assert.equal(result.status,envelope.success?0:3);assert.equal(result.stderr,'');
      assert.deepEqual(readdirSync(cwd),[]);
    }finally{rmSync(cwd,{recursive:true,force:true});}
  }
}
const suite=new Task1Composition();
test('assembled: exact owner archives, installed exports and source identity',suite.closure.bind(suite));
test('assembled: semantic class policy for composition test',suite.sourcePolicy.bind(suite));
test('assembled: exact standalone artifact from foreign cwd without writes',suite.artifact.bind(suite));
