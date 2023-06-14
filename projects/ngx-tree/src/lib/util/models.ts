export interface TreeNode {
  id: string;
  title: string;
  description?: string;
  children: TreeNode[];
}

export interface TreeFlatNode {
  id: string;
  title: string;
  description?: string;
  level: number;
  expandable: boolean;
}
