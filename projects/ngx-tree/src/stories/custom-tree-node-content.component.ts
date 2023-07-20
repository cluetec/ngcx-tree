import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TreeNodeWrapper } from '../lib/ngcx-tree/ngcx-tree-models';

@Component({
  selector: 'ngcx-sample-tree-node-content',
  templateUrl: 'custom-tree-node-content.component.html',
})
export class NgcxSampleTreeNodeContentComponent {
  @Input()
  nodeWrapper?: TreeNodeWrapper;
  @Output()
  customEvent = new EventEmitter<any>();

  sampleClicked() {
    this.customEvent.emit('sample clicked');
  }
}
