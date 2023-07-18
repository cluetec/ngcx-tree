import { Component } from '@angular/core';
import { TreeConfig, TreeNodeWrapper } from '../ngcx-tree-models';
import { NgcxTreeComponent } from '../ngcx-tree/ngcx-tree.component';
import { TREE_DATA } from './mock-tree-nodes';
import { NgcxSampleTreeNodeContentComponent } from './ngcx-sample-tree-node-content/ngcx-sample-tree-node-content.component';

@Component({
  selector: 'ngcx-tree-test',
  templateUrl: './ngcx-tree-test.component.html',
  styleUrls: ['./ngcx-tree-test.component.scss'],
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class NgcxTreeTestComponent {
  nodes = TREE_DATA;
  treeNodeContentComponent = NgcxSampleTreeNodeContentComponent;

  config: TreeConfig = {
    allowDrop: (
      _drag: TreeNodeWrapper,
      parentNode?: TreeNodeWrapper
    ): boolean => {
      return !!parentNode; // only main level
    },
  };
}
