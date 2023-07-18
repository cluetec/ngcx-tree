export interface TreeConfig {
  enableDragging?: boolean;

  allowDrop?: (
    drag: TreeNodeWrapper,
    parentNode?: TreeNodeWrapper,
    atNode?: TreeNodeWrapper
  ) => boolean;
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
