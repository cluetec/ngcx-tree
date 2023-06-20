import { ArrayDataSource } from '@angular/cdk/collections';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { Component } from '@angular/core';

interface FoodNode {
  name: string;
  children?: FoodNode[];
}
const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }],
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussels sprouts' }],
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }],
      },
    ],
  },
];

@Component({
  selector: 'cdk-tree-flat-example',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, DragDropModule],
})
export class NgcxTreeComponent {
  treeControl = new NestedTreeControl<FoodNode>((node) => node.children);
  dataSource = new ArrayDataSource(TREE_DATA);
  dragging = false;

  hasChild = (_: number, node: FoodNode) =>
    !!node.children && node.children.length > 0;
}
