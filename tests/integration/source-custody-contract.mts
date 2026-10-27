import assert from 'node:assert/strict';
import {PackageCompositionFixture} from '../support/package-composition-fixture.mts';
export class SourceCustodyContract extends PackageCompositionFixture {
assertSource(directory:string,tree:string):void {
    assert.equal(this.git(directory,['rev-parse','HEAD^{tree}']),tree,'Checkout source tree differs from the accepted candidate');
    assert.equal(this.git(directory,['status','--porcelain=v1','--untracked-files=normal']),'','Candidate checkout must be clean');
  }
}
