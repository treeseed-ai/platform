import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync, mkdtempSync, rmSync, readdirSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createServer, type Server } from 'node:net';
export interface Candidate {repository:string;commit:string;tree:string;baseline:string;archiveSha256?:string;artifactSha256?:string;}
export interface Composition {schemaVersion:number;owners:{sdk:Candidate;deployment:Candidate;cli:Candidate};}
export interface ArchiveDeclaration {repository:string;commit:string;sha256:string;}
export interface Manifest {cordisCandidate:{sdk:ArchiveDeclaration;deployment?:ArchiveDeclaration};}
export interface PolicyModule {SourcePolicy:new()=>{inspect(file:string,source:string,root:string):string[]};}
export class PackageCompositionFixture {

  readonly root=resolve(process.cwd());

  readonly cli=join(this.root,'packages/cli');

  readonly composition=JSON.parse(readFileSync(join(this.root,'composition/task3a.json'),'utf8')) as Composition;

  server:Server|null=null;

  completion:((port:number)=>void)|null=null;

  sha(bytes:Uint8Array):string {return createHash('sha256').update(bytes).digest('hex');}

  readArchive(archive:string,path:string):Buffer {
    const result=spawnSync('tar',['-xOf',archive,'package/'+path],{maxBuffer:4*1024*1024});
    assert.equal(result.status,0,'Candidate archive read must succeed');return result.stdout;
  }

  git(directory:string,args:string[]):string {
    const result=spawnSync('git',['-C',directory,'-c','user.name=Cordis review fixture','-c','user.email=cordis-fixture@example.invalid','-c','core.hooksPath=/dev/null','-c','commit.gpgsign=false',...args],{encoding:'utf8'});
    assert.equal(result.status,0,result.stderr);return result.stdout.trim();
  }



  listen(completion:(port:number)=>void):void {this.completion=completion;this.server=createServer();this.server.listen(0,'127.0.0.1',this.listening.bind(this));}

  listening():void {const address=this.server!.address();assert.equal(typeof address,'object');this.completion!((address as {port:number}).port);this.server!.close();}
}
