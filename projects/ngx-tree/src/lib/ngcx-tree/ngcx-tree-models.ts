import { Type } from '@angular/core';

export interface TreeConfig {
  enableDragging?: boolean;

  treeNodeContentComponent?: Type<any>;

  allowDrop?: (
    drag: TreeNodeWrapper,
    parentNode?: TreeNodeWrapper,
    atNode?: TreeNodeWrapper
  ) => boolean;

  allowDrag?: (drag: TreeNodeWrapper) => boolean;

  loadChildren?: (node: TreeNodeWrapper) => TreeNode[];
}

export interface TreeNode {
  title?: string;
  children?: TreeNode[];
}

export interface TreeFlatNode {
  id: string;
  title: string;
  description?: string;
  level: number;
  expandable: boolean;
}

export interface TreeNodeWrapper {
  node: TreeNode;
  isFirstChild: boolean;
  isLastChild: boolean;
  children: TreeNodeWrapper[];
  depth: number;
  parent?: TreeNodeWrapper;
}

export interface TreeNodeComponent {
  nodeWrapper?: TreeNodeWrapper;
}
