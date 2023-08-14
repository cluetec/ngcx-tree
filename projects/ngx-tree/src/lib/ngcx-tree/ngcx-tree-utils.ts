import { TreeNodeWrapper } from './ngcx-tree-models';

export const isParentOf = (
  parent: TreeNodeWrapper,
  node: TreeNodeWrapper
): boolean => {

  if (!node.parent) {
    return false;
  }
  if (parent.id === node.parent.id) {
    return true;
  }
  return isParentOf(parent, node.parent);
};
