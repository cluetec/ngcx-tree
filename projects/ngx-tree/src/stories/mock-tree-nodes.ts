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

const addIcon = (node: TreeNode): TreeNode => {
  const icon = (node.children?.length ?? 0) > 0 ? 'fa-folder' : 'fa-book';
  const result = { ...node };
  result.faIcon = icon;
  result.children?.forEach((child) => addIcon(child));
  return result;
};

export const TREE_DATA_WITH_ICONS = TREE_DATA.map((node) => addIcon(node));
