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
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgcxTreeDataSource } from './ngcx-tree-data.source';
import {
  NgcxTreeNodeMovedEvent,
  TreeConfig,
  TreeNode,
  TreeNodeWrapper,
} from './ngcx-tree-models';
import { NgcxTreeNodeComponent } from './ngcx-tree-node/ngcx-tree-node.component';
import { isParentOf } from './ngcx-tree-utils';

@Component({
  selector: 'ngcx-tree',
  templateUrl: 'ngcx-tree.component.html',
  styleUrls: ['ngcx-tree.component.scss'],
  standalone: true,
  imports: [CdkTreeModule, DragDropModule, CommonModule, NgcxTreeNodeComponent],
})
export class NgcxTreeComponent implements OnChanges, OnInit {
  @Input() nodes?: TreeNode[];
  @Input() config?: TreeConfig;
  @Output() nodeMoved = new EventEmitter<NgcxTreeNodeMovedEvent>();
  @Output() customEvent = new EventEmitter<any>();
  @Output() clickEvent = new EventEmitter<TreeNodeWrapper>();

  dataSource: NgcxTreeDataSource<TreeNodeWrapper> =
    new NgcxTreeDataSource<TreeNodeWrapper>([]);
  treeControl!: NestedTreeControl<TreeNodeWrapper>;
  dragging = false;

  ngOnInit(): void {
    const improvedNodes = this.createWrapperNodes(this.nodes ?? []);
    this.dataSource = new NgcxTreeDataSource(improvedNodes);

    this.treeControl = new NestedTreeControl<TreeNodeWrapper>(
      (node) => node.children,
      { trackBy: (node: TreeNodeWrapper) => node.id }
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
        id: node.id,
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

  hasChild = (_: number, node: TreeNodeWrapper) => node.children.length > 0;

  allowDrop(): (
    drag: CdkDrag<TreeNodeWrapper>,
    drop: CdkDropList<TreeNodeWrapper>
  ) => boolean {
    const customAllowDrop = this.config?.allowDrop
      ? (drag: CdkDrag<TreeNodeWrapper>, drop: CdkDropList<TreeNodeWrapper>) =>
          this.config!.allowDrop!(drag.data, drop.data.parent, drop.data)
      : () => true;
    return (
      drag: CdkDrag<TreeNodeWrapper>,
      drop: CdkDropList<TreeNodeWrapper>
    ) => {
      if (isParentOf(drag.data, drop.data)) {
        return false;
      }
      return customAllowDrop(drag, drop);
    };
  }

  disableDrag(node: TreeNodeWrapper) {
    return this.config?.allowDrag ? !this.config.allowDrag(node) : false;
  }

  // Every cdkDropList has only exact one element and will always removed from one and added to another
  handleDrop(event: CdkDragDrop<TreeNodeWrapper>) {
    const movedNode: TreeNodeWrapper = event.item.data;
    const removeFromList = movedNode.parent?.node.children ?? this.nodes!;

    const removeIndex = removeFromList.findIndex(
      (child) => child.id === movedNode.id
    );
    removeFromList.splice(removeIndex, 1);

    const insertAfterNode = !!event.currentIndex;
    const toNode: TreeNodeWrapper = event.container.data;
    const addToList = toNode.parent?.node.children ?? this.nodes!;

    let addAtNodeIdx = addToList.findIndex((child) => child.id === toNode.id);
    if (insertAfterNode) {
      addAtNodeIdx++;
    }
    addToList.splice(addAtNodeIdx, 0, movedNode.node);
    this.dataSource.update(this.createWrapperNodes(this.nodes!));

    const afterNodeIdx = addAtNodeIdx - 1;
    const wrapperList = toNode.parent?.children ?? this.dataSource.data$.value;
    const afterNode =
      afterNodeIdx > -1 && addToList.length > afterNodeIdx
        ? wrapperList.find((node) => node.id === addToList[afterNodeIdx].id)
        : undefined;
    this.nodeMoved.emit({
      node: movedNode,
      parent: toNode.parent,
      afterNode: afterNode,
    });
    console.log({
      node: movedNode,
      parent: toNode.parent,
      afterNode: afterNode,
    });
  }
}
