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
import { TreeConfig, TreeNode, TreeNodeWrapper } from './ngcx-tree-models';
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
  @Input() nodes?: TreeNode[];
  @Input() config?: TreeConfig;

  dataSource: ArrayDataSource<TreeNodeWrapper> = new ArrayDataSource([]);
  treeControl!: NestedTreeControl<TreeNodeWrapper>;

  dragging = false;

  ngOnInit(): void {
    const improvedNodes = this.createWrapperNodes(this.nodes ?? []);
    this.dataSource = new ArrayDataSource(improvedNodes);
    const loadChildren = this.config?.loadChildren;

    this.treeControl = new NestedTreeControl<TreeNodeWrapper>(
      loadChildren
        ? (node) => {
            const improvedNodes = this.createWrapperNodes(
              loadChildren(node),
              node,
              node.depth + 1
            );
            node.children = improvedNodes;

            return improvedNodes;
          }
        : (node) => node.children
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['nodes']) {
      this.ngOnInit();
    }
  }

  createWrapperNodes(
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
        ? this.createWrapperNodes(node.children, nodeWrapper, depth + 1)
        : [];
      return nodeWrapper;
    });
  }

  hasChild = (_: number, node: TreeNodeWrapper) =>
    this.config?.loadChildren || node.children.length > 0;

  allowDrop(): (
    drag: CdkDrag<TreeNodeWrapper>,
    drop: CdkDropList<TreeNodeWrapper>
  ) => boolean {
    if (this.config?.allowDrop) {
      return (
        drag: CdkDrag<TreeNodeWrapper>,
        drop: CdkDropList<TreeNodeWrapper>
      ) => this.config!.allowDrop!(drag.data, drop.data.parent, drop.data);
    }
    return () => true;
  }

  disableDrag(node: TreeNodeWrapper) {
    return this.config?.allowDrag ? !this.config.allowDrag(node) : false;
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

  handleDrop(event: CdkDragDrop<TreeNodeWrapper>) {
    console.log('node', event);
    console.log('node', event.item.data.node.title);
    console.log('from', event.previousContainer.data.node.title);
    console.log('to', event.container.data.node.title);

    // transferArrayItem(
    //   event.previousContainer.data,
    //   event.container.data,
    //   event.previousIndex,
    //   event.currentIndex
    // );
  }
}
