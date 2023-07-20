import { TreeNode } from '../lib/ngcx-tree/ngcx-tree-models';

export const TREE_DATA: TreeNode[] = [
  {
    id: 'meat',
    title: 'Meat',
  },
  {
    id: 'fish',
    title: 'Fish',
  },
  {
    id: 'fru',
    title: 'Fruit',
    children: [
      {
        id: 'app',
        title: 'Apple',
      },
      {
        id: 'ban',
        title: 'Banana',
      },
      {
        id: 'fruloo',
        title: 'Fruit loops',
      },
    ],
  },
  {
    id: 'veg',
    title: 'Vegetables',
    children: [
      {
        id: 'gre',
        title: 'Green',
        children: [
          {
            id: 'broc',
            title: 'Broccoli',
          },
          {
            id: 'brss',
            title: 'Brussels sprouts',
          },
        ],
      },
      {
        id: 'ora',
        title: 'Orange',
        children: [
          {
            id: 'pump',
            title: 'Pumpkins',
          },
          {
            id: 'carr',
            title: 'Carrots',
          },
        ],
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
