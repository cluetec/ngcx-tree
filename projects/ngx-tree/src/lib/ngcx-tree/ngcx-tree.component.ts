import { ArrayDataSource } from '@angular/cdk/collections';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input } from '@angular/core';
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
  imports: [CdkTreeModule, DragDropModule, FontAwesomeModule],
})
export class NgcxTreeComponent {
  @Input() dataSource = new ArrayDataSource(TREE_DATA);

  treeControl = new NestedTreeControl<TreeNode>((node) => node.children);
  dragging = false;

  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faBook = faBook;

  hasChild = (_: number, node: TreeNode) =>
    !!node.children && node.children.length > 0;

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
