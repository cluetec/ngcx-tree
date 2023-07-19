import { Component } from '@angular/core';
import { NgcxTreeComponent } from '../../ngcx-tree/ngcx-tree.component';
import { TreeConfig, TreeNodeWrapper } from '../ngcx-tree-models';
import { TREE_DATA } from './mock-tree-nodes';
import { NgcxSampleTreeNodeContentComponent } from './ngcx-sample-tree-node-content/ngcx-sample-tree-node-content.component';

@Component({
  selector: 'ngcx-tree-test',
  templateUrl: './ngcx-tree-test.component.html',
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
      return parentNode?.depth ? parentNode.depth < 2 : true; // only 3 levels
    },

    allowDrag: (drag: TreeNodeWrapper): boolean => {
      return drag.children.length === 0; // allow only dnd of nodes without children
    },
  };
}
