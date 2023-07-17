import { ArrayDataSource } from '@angular/cdk/collections';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { TreeNode } from 'ngx-tree';
import { TREE_DATA } from '../util/mock-tree-nodes';

@Component({
  selector: 'cdk-tree-flat-example',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, DragDropModule, FontAwesomeModule, CommonModule],
})
export class NgcxTreeComponent implements OnChanges {
  @Input() nodes = TREE_DATA;

  dataSource = new ArrayDataSource(this.nodes);
  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dragging = false;

  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faBook = faBook;
  ngOnChanges(changes: SimpleChanges) {
    this.dataSource = new ArrayDataSource(this.nodes);
  }
  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

  evenPredicate(parent?: TreeNode) {
    return (drag: CdkDrag<TreeNode>, drop: CdkDropList<TreeNode>): boolean => {
      console.log(parent?.title, drag.data.title, drop.data.title);
      // console.log(treeControl.getLevel(node));
      return !!parent;
    };
  }

  handleDrop(event: CdkDragDrop<string[]>) {
    console.log(event);

    // if (event.previousContainer === event.container) {
    //   moveItemInArray(
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex
    //   );
    // } else {
    //   transferArrayItem(
    //     event.previousContainer.data,
    //     event.container.data,
    //     event.previousIndex,
    //     event.currentIndex
    //   );
    // }
  }
}
