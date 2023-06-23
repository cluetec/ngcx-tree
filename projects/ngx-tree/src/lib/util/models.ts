export interface TreeConfig {
  nodeIndent: number;
  expandDelay: number;
  allowDepthChange: boolean;
  enableDragging: boolean;
}

export interface TreeNode {
  title: string;
  description?: string;
  children?: TreeNode[];
}

export interface TreeFlatNode {
  id: string;
  title: string;
  description?: string;
  level: number;
  expandable: boolean;
}
