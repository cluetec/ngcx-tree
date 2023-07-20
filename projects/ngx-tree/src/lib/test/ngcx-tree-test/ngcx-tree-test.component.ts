import { Component } from '@angular/core';
import { NgcxSampleTreeNodeContentComponent } from '../../../stories/custom-tree-node-content.component';
import {
  TreeConfig,
  TreeNode,
  TreeNodeWrapper,
} from '../../ngcx-tree/ngcx-tree-models';
import { NgcxTreeComponent } from '../../ngcx-tree/ngcx-tree.component';
import { TREE_DATA } from '../mock-tree-nodes';

@Component({
  selector: 'ngcx-tree-test',
  templateUrl: './ngcx-tree-test.component.html',
  standalone: true,
  imports: [NgcxTreeComponent],
})
export class NgcxTreeTestComponent {
  nodes = TREE_DATA;

  config: TreeConfig = {
    treeNodeContentComponent: NgcxSampleTreeNodeContentComponent,

    allowDrop: (
      _drag: TreeNodeWrapper,
      parentNode?: TreeNodeWrapper
    ): boolean => {
      return parentNode?.depth ? parentNode.depth < 2 : true; // only 3 levels
    },

    allowDrag: (drag: TreeNodeWrapper): boolean => {
      return drag.children.length === 0; // allow only dnd of nodes without children
    },
    loadChildren: (parent) => this.loadChildren(parent),
  };
  loadChildren(parent: TreeNodeWrapper): TreeNode[] {
    return parent.children.map((child) => child.node);
  }
}
