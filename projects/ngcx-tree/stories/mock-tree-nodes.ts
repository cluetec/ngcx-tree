import { NgcxTreeNode } from '../src/lib/ngcx-tree/ngcx-tree-models';

export const TREE_DATA: NgcxTreeNode[] = [
  {
    id: 'meat',
    title:
      'Meat Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
  },
  {
    id: 'fish',
    title:
      'Fish Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
  },
  {
    id: 'fru',
    title:
      'Fruit Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
    children: [
      {
        id: 'app',
        title:
          'Apple Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua',
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

const addIcon = (node: NgcxTreeNode): NgcxTreeNode => {
  const icon = (node.children?.length ?? 0) > 0 ? 'fa-folder' : 'fa-book';
  const result = { ...node };
  result.faIcon = icon;
  result.children = result.children?.map((child) => addIcon(child));
  return result;
};

export const TREE_DATA_WITH_ICONS = TREE_DATA.map((node) => addIcon(node));
