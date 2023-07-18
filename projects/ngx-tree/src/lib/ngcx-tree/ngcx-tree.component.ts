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
  Type,
} from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TreeNode, TreeNodeWrapper } from '../ngcx-tree-models';
import { TREE_DATA } from '../ngcx-tree-test/mock-tree-nodes';
import { NgcxDefaultTreeNodeComponent } from './ngcx-default-tree-node/ngcx-default-tree-node.component';
import { NgcxTreeNodeComponent } from './ngcx-tree-node/ngcx-tree-node.component';

@Component({
  selector: 'ngcx-tree',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [
    CdkTreeModule,
    DragDropModule,
    FontAwesomeModule,
    CommonModule,
    NgcxTreeNodeComponent,
  ],
})
export class NgcxTreeComponent implements OnChanges, OnInit {
  @Input() nodes = TREE_DATA;

  @Input() treeNodeComponent: Type<any> = NgcxDefaultTreeNodeComponent;

  dataSource: ArrayDataSource<TreeNodeWrapper> = new ArrayDataSource([]);
  treeControl = new NestedTreeControl<TreeNodeWrapper>((node) => node.children);
  dragging = false;

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

  allowDrop(
    drag: CdkDrag<TreeNodeWrapper>,
    drop: CdkDropList<TreeNodeWrapper>
  ): boolean {
    console.log(drag.data.node.title, drop.data.node.title);
    console.log(drop.data.parent);
    console.log(drag.data.depth);

    return drop.data.depth < 2;
  }

  // allowDropInto(
  //   drag: CdkDrag<TreeNodeWrapper>,
  //   drop: CdkDropList<TreeNodeWrapper>
  // ): boolean {
  //   console.log(drag.data.node.title, drop.data.node.title);
  //   console.log(drop.data.parent);
  //   console.log(drag.data.depth);

  //   return drop.data.depth < 1;
  // }

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
