import { EventEmitter, Type } from '@angular/core';

export interface TreeConfig {
  enableDragging?: boolean;

  treeNodeContentComponent?: Type<NgcxCustomComponent>;

  allowDrop?: (node: TreeNodeWrapper, intoNode?: TreeNodeWrapper) => boolean;

  allowDrag?: (node: TreeNodeWrapper) => boolean;
}

export interface NgcxCustomComponent {
  nodeWrapper?: TreeNodeWrapper;
  customEvent?: EventEmitter<any>;
}

export interface TreeNode {
  id: string;
  title?: string;
  faIcon?: string;
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
  id: any;
  node: TreeNode;
  isFirstChild: boolean;
  isLastChild: boolean;
  children: TreeNodeWrapper[];
  depth: number;
  parent?: TreeNodeWrapper;
}

export interface TreeNodeWrapperChildList {
  parent?: TreeNodeWrapper;
}

export interface TreeNodeComponent {
  nodeWrapper?: TreeNodeWrapper;
}

export interface NgcxTreeNodeMovedEvent {
  node: TreeNodeWrapper;
  parent?: TreeNodeWrapper;
  afterNode?: TreeNodeWrapper;
}