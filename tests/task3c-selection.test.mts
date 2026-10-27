import {test,expect} from 'bun:test';
import {readFileSync,writeFileSync,mkdirSync,mkdtempSync,copyFileSync,rmSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {tmpdir} from 'node:os';
import {spawnSync} from 'node:child_process';
/** Executes the actual preparation programme against genuine selected bytes and a wrong lock pin. */
class AssemblySelectionTests {
 lockPin():void {
  const root=mkdtempSync(join(tmpdir(),'cordis-task3c-selection-')),composition=JSON.parse(readFileSync('composition/task3c.json','utf8'));
  try{
   for(const pin of Object.values(composition.owners) as Array<{archive:string;checkout:string}>){pin.archive=resolve(pin.archive);pin.checkout=resolve(pin.checkout);}
   composition.cli.checkout=resolve(composition.cli.checkout);composition.cli.binary=resolve(composition.cli.binary);
   composition.uiQualification.fixture.archive=resolve(composition.uiQualification.fixture.archive);
   composition.runtimeLock.path=resolve(composition.runtimeLock.path);composition.runtimeLock.sha256='0'.repeat(64);
   mkdirSync(join(root,'composition'));mkdirSync(join(root,'verification/task3c'),{recursive:true});
   writeFileSync(join(root,'composition/task3c.json'),JSON.stringify(composition));
   copyFileSync('verification/task3c/ui-owner-closure.mts',join(root,'verification/task3c/ui-owner-closure.mts'));
   const result=spawnSync(process.execPath,[resolve('verification/task3c/prepare-ui.mts')],{cwd:root,encoding:'utf8',timeout:180000,maxBuffer:4*1024*1024});
   expect(result.status).not.toBe(0);expect(result.stderr).toContain('ASSEMBLY_SELECTION_REFUSED');
   expect(existsSync(join(root,'verification/task3c/dist/ui'))).toBe(false);
  }finally{rmSync(root,{recursive:true,force:true});}
 }
}
const suite=new AssemblySelectionTests();test('task3c: preparation rejects a changed runtime lock pin before builds or store state',suite.lockPin.bind(suite),240000);
