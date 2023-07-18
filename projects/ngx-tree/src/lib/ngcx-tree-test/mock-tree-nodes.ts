import { TreeNode } from '../ngcx-tree-models';

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
