import { EventEmitter, TemplateRef, Type } from '@angular/core';

export interface NgcxTreeConfig<T extends NgcxTreeNode> {
  treeNodeContentComponent?: Type<NgcxCustomComponent<T>>;
  treeNodeContentTemplate?: TemplateRef<any>;

  allowDrop?: (
    node: NgcxTreeNodeWrapper<T>,
    intoNode?: NgcxTreeNodeWrapper<T>
  ) => boolean;
  preventDropReason?: (
    node: NgcxTreeNodeWrapper<T>,
    intoNode?: NgcxTreeNodeWrapper<T>
  ) => string;
  allowDrag?: (node: NgcxTreeNodeWrapper<T>) => boolean;
  allowSelection?: (node: NgcxTreeNodeWrapper<T>) => boolean;
}

export interface NgcxCustomComponent<T extends NgcxTreeNode> {
  nodeWrapper?: NgcxTreeNodeWrapper<T>;
  customEvent?: EventEmitter<any>;
}

export interface NgcxTreeNode {
  id: string;
  title?: any;
  faIcon?: string;
  children?: NgcxTreeNode[];
}

export interface NgcxTreeNodeWrapper<T extends NgcxTreeNode> {
  id: string;
  data: T;
  depth: number;
  index: number;
  isSelectable?: boolean;
  isFirstChild: boolean;
  isLastChild: boolean;
  children: NgcxTreeNodeWrapper<T>[];
  parent?: NgcxTreeNodeWrapper<T>;
  next?: NgcxTreeNodeWrapper<T>;
  previous?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeNodeComponent<T extends NgcxTreeNode> {
  nodeWrapper?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeNodeMovedEvent<T extends NgcxTreeNode> {
  node: NgcxTreeNodeWrapper<T>;
  parent?: NgcxTreeNodeWrapper<T>;
  afterNode?: NgcxTreeNodeWrapper<T>;
  beforeNode?: NgcxTreeNodeWrapper<T>;
}
