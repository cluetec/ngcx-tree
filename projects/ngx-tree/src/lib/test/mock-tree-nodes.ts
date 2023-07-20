import { TreeNode } from '../ngcx-tree/ngcx-tree-models';

export const TREE_DATA: TreeNode[] = [
  {
    title: 'Meat',
  },
  {
    title: 'Fish',
  },
  {
    title: 'Fruit',
    children: [
      { title: 'Apple' },
      { title: 'Banana' },
      { title: 'Fruit loops' },
    ],
  },
  {
    title: 'Vegetables',
    children: [
      {
        title: 'Green',
        children: [{ title: 'Broccoli' }, { title: 'Brussels sprouts' }],
      },
      {
        title: 'Orange',
        children: [{ title: 'Pumpkins' }, { title: 'Carrots' }],
      },
    ],
  },
];

export const TREE_DATA_WITHOUT_CHILDREN = TREE_DATA.map((node) => ({
  title: node.title,
}));

const createChildMap = (nodes: TreeNode[]): { [key: string]: TreeNode[] } => {
  const childMap: { [key: string]: TreeNode[] } = {};
  nodes
    .filter((node) => node.children)
    .forEach((node) => {
      childMap[node.title!] = node.children!;
      const childrenMap = createChildMap(node.children!);
      Object.keys(childrenMap).forEach(
        (key) => (childMap[key] = childrenMap[key])
      );
    });
  return childMap;
};

export const TREE_CHILDREN: { [key: string]: TreeNode[] } =
  createChildMap(TREE_DATA);
