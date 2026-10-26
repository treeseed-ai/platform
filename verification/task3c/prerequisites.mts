import {readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
/** Explicit test-host image preparation; runtime apply never pulls. */
class AssemblyPrerequisites {
 private command(args:string[]):void{const result=spawnSync('docker',args,{stdio:'inherit',timeout:180000});if(result.status!==0)throw new Error('ASSEMBLY_ENGINE_PREREQUISITE');}
 run():void{this.command(['info']);this.command(['compose','version']);const file=process.argv[2]??'composition/task3c.json',evidence=JSON.parse(readFileSync(file,'utf8'));if(!evidence.fixturesOnly)throw new Error('ASSEMBLY_FIXTURE_REQUIRED');for(const image of Object.values(evidence.images)){if(typeof image!=='string'||!/^[a-z0-9./_-]+@sha256:[a-f0-9]{64}$/.test(image))throw new Error('ASSEMBLY_IMAGE_PIN_REQUIRED');this.command(['pull',image]);}}
}
new AssemblyPrerequisites().run();
