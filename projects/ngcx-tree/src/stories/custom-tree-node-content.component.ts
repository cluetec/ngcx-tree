import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  NgcxCustomComponent,
  TreeNodeWrapper,
} from '../lib/ngcx-tree/ngcx-tree-models';

@Component({
  selector: 'ngcx-sample-tree-node-content',
  templateUrl: 'custom-tree-node-content.component.html',
  standalone: true,
  imports: [NgIf],
})
export class NgcxSampleTreeNodeContentComponent implements NgcxCustomComponent {
  @Input()
  nodeWrapper?: TreeNodeWrapper;
  @Output()
  customEvent = new EventEmitter<any>();

  sampleClicked() {
    this.customEvent.emit('sample clicked ' + this.nodeWrapper?.id);
  }
}
