import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {PackageArchiveInspector} from '@treeseed-cordis/deployment';
type Files=Awaited<ReturnType<typeof PackageArchiveInspector.inspect>>['files'];
interface Evidence{formatVersion:1;owners:Record<string,{sha256:string;files:Files}>;}
/** Public archive inspection only. Diagnostics contain names/digests/modes, never file bodies. */
class ArtifactFiles {
 private static sha(path:string):string{return createHash('sha256').update(readFileSync(path)).digest('hex');}
 static async run():Promise<void>{
  const composition=JSON.parse(readFileSync('composition/task3c.json','utf8'));
  if(process.argv[2]==='record'){
   const receipt=JSON.parse(readFileSync('verification/task3c/dist/ui/closure/ui-owner-closure.json','utf8')),evidence:Evidence={formatVersion:1,owners:{}};
   for(const owner of ['admin','api']){const item=receipt.owners[owner],sha256=this.sha(item.path);if(sha256!==composition.uiQualification.expectedArtifacts[owner].sha256)throw new Error('ARTIFACT_SELECTION_REQUIRED');evidence.owners[owner]={sha256,files:(await PackageArchiveInspector.inspect(resolve(item.path),sha256)).files};}
   writeFileSync('composition/task3c-ui-artifact-files.json',JSON.stringify(evidence,null,2)+'\n',{flag:'wx'});return;
  }
  const owner=process.argv[2]!,path=resolve(process.argv[3]!),sha256=this.sha(path),expectedSha=composition.uiQualification.expectedArtifacts[owner]?.sha256;
  if(owner==='cli'){process.stdout.write(JSON.stringify({owner,expectedSha,actualSha:sha256})+'\n');return;}
  if(!['admin','api'].includes(owner)||!expectedSha)throw new Error('ARTIFACT_SELECTION_REQUIRED');
  const evidence=JSON.parse(readFileSync('composition/task3c-ui-artifact-files.json','utf8')) as Evidence,expected=evidence.owners[owner]!;
  if(expected.sha256!==expectedSha)throw new Error('ARTIFACT_SELECTION_REQUIRED');
  const actual=(await PackageArchiveInspector.inspect(path,sha256)).files,changes=[];
  for(const before of expected.files){let next;for(const file of actual)if(file.path===before.path)next=file;if(!next||JSON.stringify(before)!==JSON.stringify(next))changes.push({path:before.path,before,after:next??null});}
  for(const file of actual){let found=false;for(const before of expected.files)if(file.path===before.path)found=true;if(!found)changes.push({path:file.path,before:null,after:file});}
  process.stdout.write(JSON.stringify({owner,expectedSha,actualSha:sha256,changes})+'\n');
 }
}
await ArtifactFiles.run();
