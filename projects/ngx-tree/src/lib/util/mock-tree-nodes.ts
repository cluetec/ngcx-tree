import { TreeNode } from './models';

export const mockTreeNodes: TreeNode[] = [
  {
    id: '1',
    title: 'Apple',
    description: 'Red',
    children: [],
  },
  {
    id: '2',
    title: 'Banana',
    description: 'Yellow',
    children: [],
  },
  {
    id: '3',
    title: 'Citrus',
    description: 'Orange',
    children: [
      {
        id: '4',
        title: 'Orange',
        description: 'Orange',
        children: [],
      },
      {
        id: '5',
        title: 'Lemon',
        description: 'Yellow',
        children: [
          {
            id: '11',
            title: 'Lemon',
            description: 'Funny',
            children: [],
          },
          {
            id: '12',
            title: 'Lemon',
            description: 'Angry',
            children: [],
          },
          {
            id: '13',
            title: 'Lemon',
            description: 'Sad',
            children: [],
          },
        ],
      },
      {
        id: '6',
        title: 'Lime',
        description: 'Green',
        children: [],
      },
    ],
  },
  {
    id: '7',
    title: 'Berry',
    description: 'Red',
    children: [
      {
        id: '8',
        title: 'Strawberry',
        description: 'Red',
        children: [],
      },
      {
        id: '9',
        title: 'Blueberry',
        description: 'Blue',
        children: [],
      },
      {
        id: '10',
        title: 'Raspberry',
        description: 'Red',
        children: [],
      },
    ],
  },
];
