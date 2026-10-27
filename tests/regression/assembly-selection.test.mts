import {test,expect} from 'bun:test';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
/** Executes the actual preparation programme against genuine selected bytes and a wrong lock pin. */
class AssemblySelectionTests {
 archiveModes():void{
  const root=mkdtempSync(join(tmpdir(),'cordis-task3c-archive-modes-')),composition=JSON.parse(readFileSync('composition/task3c.json','utf8'));
  try{
   const owners:Record<string,{repository:string;directory:string;commit:string}>={};for(const owner of ['admin','api','cli']){const pin=owner==='cli'?composition.cli:composition.owners[owner];owners[owner]={repository:pin.repository,directory:resolve(pin.checkout),commit:pin.commit};}
   const request=join(root,'request.json'),fixture=composition.uiQualification.fixture;writeFileSync(request,JSON.stringify({output:join(root,'closure'),ui:{...fixture,archive:resolve(fixture.archive)},owners}));
   const program=join(root,'build-under-umask.ts');writeFileSync(program,"class Fixture {static async run():Promise<void>{process.umask(0o022);process.argv[2]="+JSON.stringify(request)+";await import("+JSON.stringify(resolve('tests/support/assembly/presentation-owner-closure.mts'))+");}}await Fixture.run();");
   const result=spawnSync(process.execPath,[program],{encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024});expect(result.status).toBe(0);
   const receipt=JSON.parse(result.stdout);for(const owner of ['admin','api','cli'])expect(receipt.owners[owner].sha256).toBe(composition.uiQualification.expectedArtifacts[owner].sha256);
   expect(createHash('sha256').update(readFileSync(join(root,'closure/api/bun.lock'))).digest('hex')).toBe(composition.uiQualification.expectedArtifacts.api.lockSha256);
  }finally{rmSync(root,{recursive:true,force:true});}
 }
 lockPin():void {
  const root=mkdtempSync(join(tmpdir(),'cordis-task3c-selection-')),composition=JSON.parse(readFileSync('composition/task3c.json','utf8'));
  try{
   for(const pin of Object.values(composition.owners) as Array<{archive:string;checkout:string}>){pin.archive=resolve(pin.archive);pin.checkout=resolve(pin.checkout);}
   composition.cli.checkout=resolve(composition.cli.checkout);composition.cli.binary=resolve(composition.cli.binary);
   composition.uiQualification.fixture.archive=resolve(composition.uiQualification.fixture.archive);
   composition.runtimeLock.path=resolve(composition.runtimeLock.path);composition.runtimeLock.sha256='0'.repeat(64);
   mkdirSync(join(root,'composition'));mkdirSync(join(root,'tests/support/assembly'),{recursive:true});
   writeFileSync(join(root,'composition/task3c.json'),JSON.stringify(composition));
   copyFileSync('tests/support/assembly/presentation-owner-closure.mts',join(root,'tests/support/assembly/presentation-owner-closure.mts'));
   const result=spawnSync(process.execPath,[resolve('tests/support/assembly/prepare-presentation.mts')],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024});
   expect(result.status).not.toBe(0);expect(result.stderr).toContain('ASSEMBLY_SELECTION_REFUSED');
   expect(existsSync(join(root,'tests/support/assembly/dist/ui'))).toBe(false);
  }finally{rmSync(root,{recursive:true,force:true});}
 }
}
const suite=new AssemblySelectionTests();test('regression: preparation rejects a changed runtime lock pin before builds or store state',suite.lockPin.bind(suite),240000);
test('regression: owner fixture builds preserve exact archive pins under a different caller umask',suite.archiveModes.bind(suite),240000);
