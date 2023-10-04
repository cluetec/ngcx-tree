import { NestedTreeControl } from '@angular/cdk/tree';
import { EventEmitter, TemplateRef, Type } from '@angular/core';

export interface NgcxTreeConfig<T> {
  treeNodeContentComponent?: Type<NgcxCustomComponent<T>>;
  treeNodeContentTemplate?: TemplateRef<any>;

  allowDrop?: (
    node: NgcxTreeNodeWrapper<T>,
    intoNode?: NgcxTreeNodeWrapper<T>
  ) => boolean;
  allowDrag?: (node: NgcxTreeNodeWrapper<T>) => boolean;
  allowSelection?: (node: NgcxTreeNodeWrapper<T>) => boolean;
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

export interface NgcxTreeNodeComponent<T> {
  nodeWrapper?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeNodeMovedEvent<T> {
  node: NgcxTreeNodeWrapper<T>;
  parent?: NgcxTreeNodeWrapper<T>;
  afterNode?: NgcxTreeNodeWrapper<T>;
  beforeNode?: NgcxTreeNodeWrapper<T>;
}

export interface NgcxTreeApi<T> {
  selectNodeById(id: string): void;
  findNodeById(id: string): NgcxTreeNodeWrapper<T> | undefined;

  get treeControl(): NestedTreeControl<NgcxTreeNodeWrapper<any>, string>;
}
