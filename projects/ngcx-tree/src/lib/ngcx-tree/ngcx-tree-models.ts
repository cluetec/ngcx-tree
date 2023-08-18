import { EventEmitter, TemplateRef, Type } from '@angular/core';

export interface NgcxTreeConfig<T> {
  enableDragging?: boolean;

  treeNodeContentComponent?: Type<NgcxCustomComponent<T>>;
  treeNodeContentTemplate?: TemplateRef<any>;

  allowDrop?: (
    node: NgcxTreeNodeWrapper<T>,
    intoNode?: NgcxTreeNodeWrapper<T>
  ) => boolean;

  allowDrag?: (node: NgcxTreeNodeWrapper<T>) => boolean;
}

export interface NgcxCustomComponent<T> {
  nodeWrapper?: NgcxTreeNodeWrapper<T>;
  customEvent?: EventEmitter<any>;
}

export interface NgcxTreeNode {
  id: string;
  title?: any;
  faIcon?: string;
  children?: NgcxTreeNode[];
}

export interface NgcxTreeNodeWrapper<T> {
  id: any;
  data: T;
  isFirstChild: boolean;
  isLastChild: boolean;
  children: NgcxTreeNodeWrapper<T>[];
  depth: number;
  parent?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeNodeComponent<T> {
  nodeWrapper?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeNodeMovedEvent<T> {
  node: NgcxTreeNodeWrapper<T>;
  parent?: NgcxTreeNodeWrapper<T>;
  afterNode?: NgcxTreeNodeWrapper<T>;
  beforeNode?: NgcxTreeNodeWrapper<T>;
}
