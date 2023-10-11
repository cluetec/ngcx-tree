import { NgcxTreeNodeWrapper } from './ngcx-tree-models';

export const isParentOf = (
  parent: NgcxTreeNodeWrapper<any>,
  node: NgcxTreeNodeWrapper<any>
): boolean => {
  if (!node.parent) {
    return false;
  }
  if (parent.id === node.parent.id) {
    return true;
  }
  return isParentOf(parent, node.parent);
};
