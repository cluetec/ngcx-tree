import { Component, Input } from '@angular/core';
import { TreeNodeWrapper } from '../lib/ngcx-tree/ngcx-tree-models';

@Component({
  selector: 'ngcx-sample-tree-node-content',
  template: '{{ nodeWrapper?.node?.title }} <i>(sample)</i>',
})
export class NgcxSampleTreeNodeContentComponent {
  @Input()
  nodeWrapper?: TreeNodeWrapper;
}
