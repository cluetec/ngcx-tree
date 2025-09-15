
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NgcxCustomComponent,
  NgcxTreeNodeWrapper,
} from '../src/lib/ngcx-tree/ngcx-tree-models';

@Component({
    selector: 'ngcx-sample-tree-node-content',
    templateUrl: 'custom-tree-node-content.component.html',
    imports: []
})
export class NgcxSampleTreeNodeContentComponent
  implements NgcxCustomComponent<any>
{
  @Input()
  nodeWrapper!: NgcxTreeNodeWrapper<any>;
  @Output()
  customEvent = new EventEmitter<any>();

  sampleClicked() {
    this.customEvent.emit('sample button clicked ' + this.nodeWrapper?.id);
  }
}
