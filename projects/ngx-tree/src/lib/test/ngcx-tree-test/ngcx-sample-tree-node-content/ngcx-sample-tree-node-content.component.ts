import { Component, Input } from '@angular/core';
import { TreeNodeWrapper } from '../../../ngcx-tree/ngcx-tree-models';

@Component({
  selector: 'ngcx-sample-tree-node-content',
  templateUrl: './ngcx-sample-tree-node-content.component.html',
})
export class NgcxSampleTreeNodeContentComponent {
  @Input()
  nodeWrapper?: TreeNodeWrapper;
}
