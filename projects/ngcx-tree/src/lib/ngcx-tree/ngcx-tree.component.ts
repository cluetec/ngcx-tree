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
  HostListener,
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
  dragging?: TreeNodeWrapper;

  DropType = DropType;

  disable = () => false;
  createDropZoneData = (
    node: TreeNodeWrapper,
    dropType: DropType
  ): TreeNodeWrapperDropZone => ({ ...node, dropType: dropType });

  private canceledByEsq?: boolean;

  ngOnInit(): void {
    const improvedNodes = this.createWrapperNodes(this.nodes ?? []);
    this.dataSource = new NgcxTreeDataSource(improvedNodes);

    this.treeControl = new NestedTreeControl<TreeNodeWrapper>(
      (node) => node.children,
      { trackBy: (node: TreeNodeWrapper) => node.id }
    );

    this.treeControl.dataNodes = this.dataSource.data$.value;
    setTimeout(() => this.treeControl.expandAll(), 100);
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

  allowDrop(dropNode: TreeNodeWrapper, dropType: DropType): boolean {
    if (
      !this.dragging ||
      this.dragging.id === dropNode.id ||
      isParentOf(this.dragging, dropNode)
    ) {
      return false;
    }
    const intoNode =
      dropType == DropType.DROP_INTO ? dropNode : dropNode.parent;
    if (this.config?.allowDrop) {
      // TODO cache calls?
      return this.config.allowDrop(this.dragging, intoNode);
    }
    return true;
  }

  // prevent drop directly after a node on same level, that is expanded
  sortPredicate(): (
    index: number,
    drag: CdkDrag,
    drop: CdkDropList
  ) => boolean {
    return (
      index: number,
      _drag: CdkDrag<TreeNodeWrapper>,
      drop: CdkDropList<TreeNodeWrapper>
    ) => {
      return index == 0 || !this.treeControl.isExpanded(drop.data);
    };
  }

  disableDrag(node: TreeNodeWrapper) {
    return this.config?.allowDrag ? !this.config.allowDrag(node) : false;
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.canceledByEsq = true;
      document.dispatchEvent(new Event('mouseup'));
    }
  }

  // Every cdkDropList has only exact one element and will always removed from one and added to another
  handleDrop(event: CdkDragDrop<TreeNodeWrapperDropZone>) {
    const movedNode: TreeNodeWrapper = event.item.data;
    const toNode: TreeNodeWrapperDropZone = event.container.data;

    // dropType undefined can happen if dropped directly without moving
    if (this.canceledByEsq || toNode.dropType === undefined) {
      this.canceledByEsq = false;
      return;
    }

    this.removeElementFromPreviousPosition(movedNode);

    const insertIntoNode =
      toNode.dropType === DropType.DROP_INTO ? toNode : toNode.parent;
    const wrapperList = insertIntoNode?.children ?? this.dataSource.data$.value;
    let addAtNodeIdx = this.findAddIndex(toNode, insertIntoNode, wrapperList);

    // add element to new Position
    (insertIntoNode?.node.children ?? this.nodes!).splice(
      addAtNodeIdx,
      0,
      movedNode.node
    );
    this.dataSource.update(this.createWrapperNodes(this.nodes!));

    const afterNodeIdx = addAtNodeIdx - 1;
    const afterNode =
      afterNodeIdx > -1 && wrapperList.length > afterNodeIdx
        ? wrapperList[afterNodeIdx]
        : undefined;
    this.nodeMoved.emit({
      node: movedNode,
      parent: toNode.dropType === DropType.DROP_INTO ? toNode : toNode.parent,
      afterNode: afterNode,
    });
  }

  private findAddIndex(
    node: TreeNodeWrapperDropZone,
    insertIntoNode: TreeNodeWrapper | undefined,
    insertIntoList: TreeNodeWrapper[]
  ) {
    if (
      insertIntoNode &&
      node.dropType === DropType.DROP_INTO &&
      !insertIntoNode.node.children
    ) {
      insertIntoNode.node.children = [];
    }
    let addAtNodeIdx = 0;
    if (
      node.dropType === DropType.DROP_AFTER ||
      node.dropType === DropType.DROP_BEFORE
    ) {
      addAtNodeIdx = insertIntoList.findIndex((child) => child.id === node.id);
      if (node.dropType === DropType.DROP_AFTER) {
        addAtNodeIdx++;
      }
    }
    return addAtNodeIdx;
  }

  private removeElementFromPreviousPosition(movedNode: TreeNodeWrapper) {
    const removeFromList = movedNode.parent?.node.children ?? this.nodes!;
    const removeIndex = removeFromList.findIndex(
      (child) => child.id === movedNode.id
    );
    removeFromList.splice(removeIndex, 1);
  }
}

interface TreeNodeWrapperDropZone extends TreeNodeWrapper {
  dropType?: DropType;
}

enum DropType {
  DROP_AFTER = 'DROP_AFTER',
  DROP_BEFORE = 'DROP_BEFORE',
  DROP_INTO = 'DROP_INTO',
}
