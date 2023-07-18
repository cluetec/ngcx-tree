import { ArrayDataSource } from '@angular/cdk/collections';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { CdkTreeModule, NestedTreeControl } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faBook,
  faChevronDown,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { TREE_DATA } from '../util/mock-tree-nodes';
import { TreeNode } from '../util/models';

@Component({
  selector: 'cdk-tree-flat-example',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, DragDropModule, FontAwesomeModule, CommonModule],
})
export class NgcxTreeComponent implements OnChanges, OnInit {
  @Input() nodes = TREE_DATA;

  dataSource: ArrayDataSource<TreeNodeWrapper> = new ArrayDataSource([]);
  treeControl = new NestedTreeControl<TreeNodeWrapper>((node) => node.children);
  dragging = false;

  faChevronRight = faChevronRight;
  faChevronDown = faChevronDown;
  faBook = faBook;
  ngOnInit(): void {
    const improvedNodes = this.improveNodes(this.nodes);
    this.dataSource = new ArrayDataSource(improvedNodes);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.ngOnInit();
    }
  }

  improveNodes(
    nodes: TreeNode[],
    parent?: TreeNodeWrapper,
    depth: number = 0
  ): TreeNodeWrapper[] {
    const childCount = nodes.length;
    return nodes.map((node, idx) => {
      const nodeWrapper: TreeNodeWrapper = {
        node: node,
        isFirstChild: idx === 0,
        isLastChild: idx === childCount - 1,
        parent: parent,
        depth: depth,
        children: [],
      };
      nodeWrapper.children = node.children
        ? this.improveNodes(node.children, nodeWrapper, depth + 1)
        : [];
      return nodeWrapper;
    });
  }

  hasChild = (_: number, node: TreeNodeWrapper) => node.children.length > 0;

  evenPredicate(parent?: TreeNodeWrapper) {
    return (
      drag: CdkDrag<TreeNodeWrapper>,
      drop: CdkDropList<TreeNodeWrapper>
    ): boolean => {
      console.log(
        parent?.node.title,
        drag.data.node.title,
        drop.data.node.title
      );
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

export interface TreeNodeWrapper {
  node: TreeNode;
  isFirstChild: boolean;
  isLastChild: boolean;
  children: TreeNodeWrapper[];
  depth: number;
  parent?: TreeNodeWrapper;
}
